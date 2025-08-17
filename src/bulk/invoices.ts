/** biome-ignore-all lint/suspicious/noExplicitAny: dynamic return types */
import {type Connection, experimental_kv} from "attio/server"
import {assertRecord, listRecords} from "../api/records"

export async function syncInvoices(connection: Connection) {
    let hasMore = true
    let startingAfter = null

    while (hasMore) {
        const url = new URL("https://api.stripe.com/v1/invoices")
        if (startingAfter) {
            url.searchParams.set("starting_after", startingAfter)
        }
        url.searchParams.set("limit", "100")
        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${connection.value}`,
                "Stripe-Version": "2025-07-30.preview",
            },
        })

        const data = await response.json()

        hasMore = data.has_more

        for (const invoice of data.data) {
            const values: Record<string, any> = {
                invoice_id: invoice.id,
            }

            if (invoice.customer) {
                const customers = (await listRecords({
                    object: "customers",
                    filter: {
                        customer_id: invoice.customer,
                    },
                })) as any

                if (customers.data.length > 0) {
                    values.customer_id = customers.data[0].id.record_id
                }
            }

            if (invoice?.lines?.data) {
                const products: string[] = []
                for (const productId of invoice.lines.data.map(
                    (line: any) => line.pricing.price_details.product
                )) {
                    const product = await experimental_kv.get(`stripe-product-${productId}`)
                    if (product) {
                        products.push(product.value as string)
                    }
                }
                values.products = products
            }

            if (invoice.description) {
                values.description = invoice.description
            }

            if (invoice.hosted_invoice_url) {
                values.invoice_url = invoice.hosted_invoice_url
            }

            if (invoice.status) {
                values.status = [invoice.status]
            }

            if (invoice.total) {
                values.total = invoice.total / 100
            }

            if (invoice.amount_due) {
                values.amount_due = invoice.amount_due / 100
            }

            if (invoice.amount_overpaid) {
                values.amount_overpaid = invoice.amount_overpaid / 100
            }

            if (invoice.amount_paid) {
                values.amount_paid = invoice.amount_paid / 100
            }

            if (invoice.amount_remaining) {
                values.amount_remaining = invoice.amount_remaining / 100
            }

            if (invoice.amount_shipping) {
                values.amount_shipping = invoice.amount_shipping / 100
            }

            if (invoice.applied_amount) {
                values.applied_amount = invoice.applied_amount / 100
            }

            if (invoice.due_date) {
                values.due_date = new Date(invoice.due_date * 1000).toISOString()
            }

            if (invoice.ending_balance) {
                values.ending_balance = invoice.ending_balance / 100
            }

            if (invoice.invoice_pdf) {
                values.invoice_pdf = invoice.invoice_pdf
            }

            if (invoice.receipt_number) {
                values.receipt_number = invoice.receipt_number
            }

            if (invoice.starting_balance) {
                values.starting_balance = invoice.starting_balance / 100
            }

            if (invoice.subtotal) {
                values.subtotal = invoice.subtotal / 100
            }

            if (invoice.subtotal_excluding_tax) {
                values.subtotal_excl_tax = invoice.subtotal_excluding_tax / 100
            }

            if (invoice.total_excluding_tax) {
                values.total_excl_tax = invoice.total_excluding_tax / 100
            }

            if (invoice.livemode) {
                values.mode = ["Live"]
            } else {
                values.mode = ["Test"]
            }

            await assertRecord({
                object: "invoices",
                values: values,
                matching_attribute: "invoice_id",
            })
        }

        startingAfter = data.data[data.data.length - 1].id
    }
}
