/** biome-ignore-all lint/suspicious/noExplicitAny: dynamic return types */
import {experimental_kv} from "attio/server"
import {enc, HmacSHA256} from "crypto-js"
import {timingSafeEqual} from "../lib/crypto"
import {assertRecord, deleteRecord, listRecords} from "../api/records"

export default async function stripeWebhookHandler(request: Request) {
    const body = await request.text()
    const endpointSecret = await experimental_kv.get("stripe-webhook-secret")

    const secret = endpointSecret?.value

    if (!secret) {
        return new Response("Endpoint secret not configured", {status: 400})
    }

    const signatureHeader = request.headers.get("stripe-signature")

    if (!signatureHeader) {
        return new Response("Signature header not found", {status: 400})
    }

    const parts = signatureHeader.split(",").map((part) => part.split("="))
    const timestamp = parts.find((part) => part[0] === "t")?.[1]
    const requestSignature = parts.find((part) => part[0] === "v1")?.[1]

    if (!timestamp) {
        return new Response("Timestamp is missing", {status: 400})
    }

    if (!requestSignature) {
        return new Response("Signature is missing", {status: 400})
    }

    const signedPayload = `${timestamp}.${body}`
    const computedSignature = HmacSHA256(signedPayload, secret as string).toString(enc.Hex)

    if (!timingSafeEqual(requestSignature, computedSignature)) {
        return new Response("Signature is invalid", {status: 400})
    }

    const event = JSON.parse(body)
    switch (event.type) {
        case "customer.created":
        case "customer.updated": {
            const values: Record<string, any> = {
                customer_id: event.data.object.id,
            }

            if (event.data.object.email) {
                values.email = event.data.object.email

                const users = (await listRecords({
                    object: "users",
                    filter: {
                        primary_email_address: event.data.object.email,
                    },
                })) as any

                if (users.data.length > 0) {
                    values.user_id = users.data[0].id.record_id
                }

                const people = (await listRecords({
                    object: "people",
                    filter: {
                        email_addresses: event.data.object.email,
                    },
                })) as any

                if (people.data.length > 0) {
                    values.person_id = people.data[0].id.record_id
                }
            }
            if (event.data.object.name) {
                values.name = event.data.object.name
            }

            if (event.data.object.address) {
                values.address = {
                    line_1: event.data.object.address.line1,
                    line_2: event.data.object.address.line2,
                    line_3: null,
                    line_4: null,
                    locality: event.data.object.address.city,
                    region: event.data.object.address.state,
                    postcode: event.data.object.address.postal_code,
                    country_code: event.data.object.address.country,
                    latitude: null,
                    longitude: null,
                }
            }

            if (event.data.object.shipping) {
                values.shipping = {
                    line_1: event.data.object.shipping.address.line1,
                    line_2: event.data.object.shipping.address.line2,
                    line_3: null,
                    line_4: null,
                    locality: event.data.object.shipping.address.city,
                    region: event.data.object.shipping.address.state,
                    postcode: event.data.object.shipping.address.postal_code,
                    country_code: event.data.object.shipping.address.country,
                    latitude: null,
                    longitude: null,
                }
            }

            await assertRecord({
                object: "customers",
                values: values,
                matching_attribute: "customer_id",
            })
            break
        }
        case "customer.deleted": {
            const customers = (await listRecords({
                object: "customers",
                filter: {
                    customer_id: event.data.object.id,
                },
            })) as any

            if (customers.data.length > 0) {
                for (const customer of customers.data) {
                    await deleteRecord({
                        object: "customers",
                        record: customer.id.record_id,
                    })
                }
            }
            break
        }
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.paused":
        case "customer.subscription.pending_update_applied":
        case "customer.subscription.pending_update_expired":
        case "customer.subscription.resumed":
        case "customer.subscription.trial_will_end": {
            const values: Record<string, any> = {
                subscription_id: event.data.object.id,
            }

            if (event.data.object.customer) {
                const customers = (await listRecords({
                    object: "customers",
                    filter: {
                        customer_id: event.data.object.customer,
                    },
                })) as any

                if (customers.data.length > 0) {
                    values.customer_id = customers.data[0].id.record_id
                }
            }

            if (event.data.object.latest_invoice) {
                const invoices = (await listRecords({
                    object: "invoices",
                    filter: {
                        invoice_id: event.data.object.latest_invoice,
                    },
                })) as any

                if (invoices.data.length > 0) {
                    values.latest_invoice = invoices.data[0].id.record_id
                }
            }

            if (event.data.object.description) {
                values.description = event.data.object.description
            }

            if (event.data.object.status) {
                values.status = [event.data.object.status]
            }

            if (event.data.object.canceled_at) {
                values.canceled_at = new Date(event.data.object.canceled_at * 1000).toISOString()
            }

            if (event.data.object.cancel_at_period_end) {
                values.cancelled =
                    event.data.object.cancel_at_period_end === true ? ["True"] : ["False"]
            }

            if (event.data.object.collection_method) {
                values.collection_method = [event.data.object.collection_method]
            }

            if (event.data.object.days_until_due) {
                values.days_until_due = event.data.object.days_until_due
            }

            if (event.data.object.start_date) {
                values.start_date = new Date(event.data.object.start_date * 1000).toISOString()
            }

            if (event.data.object.trial_start) {
                values.trial_start = new Date(event.data.object.trial_start * 1000).toISOString()
            }

            if (event.data.object.trial_end) {
                values.trial_end = new Date(event.data.object.trial_end * 1000).toISOString()
            }

            await assertRecord({
                object: "subscriptions",
                values: values,
                matching_attribute: "subscription_id",
            })
            break
        }
        case "customer.subscription.deleted": {
            const subscriptions = (await listRecords({
                object: "subscriptions",
                filter: {
                    subscription_id: event.data.object.id,
                },
            })) as any

            if (subscriptions.data.length > 0) {
                for (const subscription of subscriptions.data) {
                    await deleteRecord({
                        object: "subscriptions",
                        record: subscription.id.record_id,
                    })
                }
            }
            break
        }
        case "invoice.created":
        case "invoice.updated":
        case "invoice.finalization_failed":
        case "invoice.finalized":
        case "invoice.marked_uncollectible":
        case "invoice.overdue":
        case "invoice.overpaid":
        case "invoice.paid":
        case "invoice.payment_action_required":
        case "invoice.payment_failed":
        case "invoice.payment_succeeded":
        case "invoice.sent":
        case "invoice.upcoming":
        case "invoice.voided":
        case "invoice.will_be_due": {
            const values: Record<string, any> = {
                invoice_id: event.data.object.id,
            }

            if (event.data.object.customer) {
                const customers = (await listRecords({
                    object: "customers",
                    filter: {
                        customer_id: event.data.object.customer,
                    },
                })) as any

                if (customers.data.length > 0) {
                    values.customer_id = customers.data[0].id.record_id
                }
            }

            if (event.data.object.description) {
                values.description = event.data.object.description
            }

            if (event.data.object.hosted_invoice_url) {
                values.invoice_url = event.data.object.hosted_invoice_url
            }

            if (event.data.object.status) {
                values.status = [event.data.object.status]
            }

            if (event.data.object.total) {
                values.total = event.data.object.total / 100
            }

            if (event.data.object.amount_due) {
                values.amount_due = event.data.object.amount_due / 100
            }

            if (event.data.object.amount_overpaid) {
                values.amount_overpaid = event.data.object.amount_overpaid / 100
            }

            if (event.data.object.amount_paid) {
                values.amount_paid = event.data.object.amount_paid / 100
            }

            if (event.data.object.amount_remaining) {
                values.amount_remaining = event.data.object.amount_remaining / 100
            }

            if (event.data.object.amount_shipping) {
                values.amount_shipping = event.data.object.amount_shipping / 100
            }

            if (event.data.object.applied_amount) {
                values.applied_amount = event.data.object.applied_amount / 100
            }

            if (event.data.object.due_date) {
                values.due_date = new Date(event.data.object.due_date * 1000).toISOString()
            }

            if (event.data.object.ending_balance) {
                values.ending_balance = event.data.object.ending_balance / 100
            }

            if (event.data.object.invoice_pdf) {
                values.invoice_pdf = event.data.object.invoice_pdf
            }

            if (event.data.object.receipt_number) {
                values.receipt_number = event.data.object.receipt_number
            }

            if (event.data.object.starting_balance) {
                values.starting_balance = event.data.object.starting_balance / 100
            }

            if (event.data.object.subtotal) {
                values.subtotal = event.data.object.subtotal / 100
            }

            if (event.data.object.subtotal_excluding_tax) {
                values.subtotal_excl_tax = event.data.object.subtotal_excluding_tax / 100
            }

            if (event.data.object.total_excluding_tax) {
                values.total_excl_tax = event.data.object.total_excluding_tax / 100
            }

            await assertRecord({
                object: "invoices",
                values: values,
                matching_attribute: "invoice_id",
            })
            break
        }
        case "invoice.deleted": {
            const invoices = (await listRecords({
                object: "invoices",
                filter: {
                    invoice_id: event.data.object.id,
                },
            })) as any

            if (invoices.data.length > 0) {
                for (const invoice of invoices.data) {
                    await deleteRecord({
                        object: "invoices",
                        record: invoice.id.record_id,
                    })
                }
            }
            break
        }
        default:
            console.log(`Unhandled event type ${event.type}`)
    }

    return new Response("OK", {status: 200})
}
