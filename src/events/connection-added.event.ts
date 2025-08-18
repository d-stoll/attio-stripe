/** biome-ignore-all lint(suspicious/noExplicitAny): dynamic return types */
import {
    type Connection,
    createWebhookHandler,
    deleteWebhookHandler,
    experimental_kv,
    updateWebhookHandler,
} from "attio/server"
import {
    type CreateAttributeParams,
    createAttribute,
    createOption,
    getAttributes,
    listOptions,
} from "../api/attributes"
import {createObject, getObjects} from "../api/objects"
import {syncCustomers} from "../bulk/customers"
import {syncInvoices} from "../bulk/invoices"
import {syncProducts} from "../bulk/products"
import {syncSubscriptions} from "../bulk/subscriptions"

const customerAttributes: Omit<CreateAttributeParams, "object">[] = [
    {
        title: "Customer ID",
        description: "The customer's ID in Stripe.",
        api_slug: "customer_id",
        type: "text",
        is_required: true,
        is_unique: true,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Email",
        description: "The customer's email address.",
        api_slug: "email",
        type: "text",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Name",
        description: "The customer's name.",
        api_slug: "name",
        type: "text",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Address",
        description: "The customer's address.",
        api_slug: "address",
        type: "location",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Shipping",
        description:
            "Mailing and shipping address for the customer. Appears on invoices emailed to this customer.",
        api_slug: "shipping",
        type: "location",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Balance",
        description:
            "The current balance, if any, that’s stored on the customer in their default currency. If negative, the customer has credit to apply to their next invoice. If positive, the customer has an amount owed that’s added to their next invoice. The balance only considers amounts that Stripe hasn't successfully applied to any invoice. It doesn't reflect unpaid invoices. This balance is only taken into account after invoices finalize.",
        api_slug: "balance",
        type: "currency",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {
            currency: {
                default_currency_code: "USD",
                display_type: "symbol",
            },
        },
    },
    {
        title: "Invoice Prefix",
        description: "The prefix for the customer used to generate unique invoice numbers.",
        api_slug: "invoice_prefix",
        type: "text",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Mode",
        description: "The mode of the customer, either 'Live' or 'Test'.",
        api_slug: "mode",
        type: "select",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
]

const customerSelectOptions: {attribute: string; options: string[]}[] = [
    {
        attribute: "mode",
        options: ["Live", "Test"],
    },
]

const invoiceAttributes: Omit<CreateAttributeParams, "object">[] = [
    {
        title: "Invoice ID",
        description: "The invoice's ID in Stripe.",
        api_slug: "invoice_id",
        type: "text",
        is_required: true,
        is_unique: true,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Customer ID",
        description: "The customer's ID in Stripe.",
        api_slug: "customer_id",
        type: "record-reference",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {
            record_reference: {
                allowed_objects: ["customers"],
            },
        },
    },
    {
        title: "Products",
        description: "List of products that are part of the invoice.",
        api_slug: "products",
        type: "select",
        is_required: false,
        is_unique: false,
        is_multiselect: true,
        config: {},
    },
    {
        title: "Description",
        description: "A description of the invoice.",
        api_slug: "description",
        type: "text",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Invoice URL",
        description: "The URL of the invoice that can be used to view the invoice.",
        api_slug: "invoice_url",
        type: "text",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Status",
        description: "The status of the invoice, one of draft, open, paid, uncollectible, or void.",
        api_slug: "status",
        type: "select",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Total",
        description: "Total after discounts and taxes.",
        api_slug: "total",
        type: "currency",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {
            currency: {
                default_currency_code: "USD",
                display_type: "symbol",
            },
        },
    },
    {
        title: "Amount Due",
        description:
            "Final amount due at this time for this invoice. If the invoice's total is smaller than the minimum charge amount, for example, or if there is account credit that can be applied to the invoice, the amount_due may be 0. If there is a positive starting_balance for the invoice (the customer owes money), the amount_due will also take that into account. The charge that gets generated for the invoice will be for the amount specified in amount_due.",
        api_slug: "amount_due",
        type: "currency",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {
            currency: {
                default_currency_code: "USD",
                display_type: "symbol",
            },
        },
    },
    {
        title: "Amount Overpaid",
        description:
            "Amount that was overpaid on the invoice. The amount overpaid is credited to the customer's credit balance.",
        api_slug: "amount_overpaid",
        type: "currency",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {
            currency: {
                default_currency_code: "USD",
                display_type: "symbol",
            },
        },
    },
    {
        title: "Amount Paid",
        description: "The amount that was paid.",
        api_slug: "amount_paid",
        type: "currency",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {
            currency: {
                default_currency_code: "USD",
                display_type: "symbol",
            },
        },
    },
    {
        title: "Amount Remaining",
        description: "The difference between amount_due and amount_paid.",
        api_slug: "amount_remaining",
        type: "currency",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {
            currency: {
                default_currency_code: "USD",
                display_type: "symbol",
            },
        },
    },
    {
        title: "Amount Shipping",
        description: "This is the sum of all the shipping amounts.",
        api_slug: "amount_shipping",
        type: "currency",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {
            currency: {
                default_currency_code: "USD",
                display_type: "symbol",
            },
        },
    },
    {
        title: "Applied Amount",
        description: "The amount that was applied to the invoice.",
        api_slug: "applied_amount",
        type: "currency",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {
            currency: {
                default_currency_code: "USD",
                display_type: "symbol",
            },
        },
    },
    {
        title: "Due Date",
        description:
            "The date on which payment for this invoice is due. This value will be null for invoices where collection_method=charge_automatically.",
        api_slug: "due_date",
        type: "date",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Ending Balance",
        description:
            "Ending customer balance after the invoice is finalized. Invoices are finalized approximately an hour after successful webhook delivery or when payment collection is attempted for the invoice. If the invoice has not been finalized yet, this will be null.",
        api_slug: "ending_balance",
        type: "currency",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {
            currency: {
                default_currency_code: "USD",
                display_type: "symbol",
            },
        },
    },
    {
        title: "Invoice PDF",
        description:
            "The link to download the PDF for the invoice. If the invoice has not been finalized yet, this will be null.",
        api_slug: "invoice_pdf",
        type: "text",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Receipt Number",
        description:
            "This is the transaction number that appears on email receipts sent for this invoice.",
        api_slug: "receipt_number",
        type: "text",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Starting Balance",
        description:
            "Starting customer balance before the invoice is finalized. If the invoice has not been finalized yet, this will be the current customer balance. For revision invoices, this also includes any customer balance that was applied to the original invoice.",
        api_slug: "starting_balance",
        type: "currency",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {
            currency: {
                default_currency_code: "USD",
                display_type: "symbol",
            },
        },
    },
    {
        title: "Subtotal",
        description:
            "Total of all subscriptions, invoice items, and prorations on the invoice before any invoice level discount or exclusive tax is applied. Item discounts are already incorporated",
        api_slug: "subtotal",
        type: "currency",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {
            currency: {
                default_currency_code: "USD",
                display_type: "symbol",
            },
        },
    },
    {
        title: "Subtotal Excluding Tax",
        description:
            "The integer amount in cents representing the subtotal of the invoice before any invoice level discount or tax is applied. Item discounts are already incorporated",
        api_slug: "subtotal_excl_tax",
        type: "currency",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {
            currency: {
                default_currency_code: "USD",
                display_type: "symbol",
            },
        },
    },
    {
        title: "Total Excluding Tax",
        description:
            "The integer amount in cents representing the total amount of the invoice including all discounts but excluding all tax.",
        api_slug: "total_excl_tax",
        type: "currency",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {
            currency: {
                default_currency_code: "USD",
                display_type: "symbol",
            },
        },
    },
    {
        title: "Mode",
        description: "The mode of the customer, either 'Live' or 'Test'.",
        api_slug: "mode",
        type: "select",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
]

const invoiceSelectOptions: {attribute: string; options: string[]}[] = [
    {
        attribute: "status",
        options: ["Draft", "Open", "Paid", "Uncollectible", "Void"],
    },
    {
        attribute: "mode",
        options: ["Live", "Test"],
    },
]

const subscriptionAttributes: Omit<CreateAttributeParams, "object">[] = [
    {
        title: "Subscription ID",
        description: "The subscription's ID in Stripe.",
        api_slug: "subscription_id",
        type: "text",
        is_required: true,
        is_unique: true,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Customer",
        description: "The customer's ID in Stripe.",
        api_slug: "customer_id",
        type: "record-reference",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {
            record_reference: {
                allowed_objects: ["customers"],
            },
        },
    },
    {
        title: "Products",
        description: "List of products that are part of the subscription.",
        api_slug: "products",
        type: "select",
        is_required: false,
        is_unique: false,
        is_multiselect: true,
        config: {},
    },
    {
        title: "Latest Invoice",
        description: "The latest invoice for the subscription.",
        api_slug: "latest_invoice",
        type: "record-reference",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {
            record_reference: {
                allowed_objects: ["invoices"],
            },
        },
    },
    {
        title: "Description",
        description:
            "The subscription's description, meant to be displayable to the customer. Use this field to optionally store an explanation of the subscription for rendering in Stripe surfaces and certain local payment methods UIs.",
        api_slug: "description",
        type: "text",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Status",
        description: `
                Possible values are incomplete, incomplete_expired, trialing, active, past_due, canceled, unpaid, or paused.

                For collection_method=charge_automatically a subscription moves into incomplete if the initial payment attempt fails. A subscription in this status can only have metadata and default_source updated. Once the first invoice is paid, the subscription moves into an active status. If the first invoice is not paid within 23 hours, the subscription transitions to incomplete_expired. This is a terminal status, the open invoice will be voided and no further invoices will be generated.

                A subscription that is currently in a trial period is trialing and moves to active when the trial period is over.

                A subscription can only enter a paused status when a trial ends without a payment method. A paused subscription doesn't generate invoices and can be resumed after your customer adds their payment method. The paused status is different from pausing collection, which still generates invoices and leaves the subscription's status unchanged.

                If subscription collection_method=charge_automatically, it becomes past_due when payment is required but cannot be paid (due to failed payment or awaiting additional user actions). Once Stripe has exhausted all payment retry attempts, the subscription will become canceled or unpaid (depending on your subscriptions settings).

                If subscription collection_method=send_invoice it becomes past_due when its invoice is not paid by the due date, and canceled or unpaid if it is still not paid by an additional deadline after that. Note that when a subscription has a status of unpaid, no subsequent invoices will be attempted (invoices will be created, but then immediately automatically closed). After receiving updated payment information from a customer, you may choose to reopen and pay their closed invoices.
                `,
        api_slug: "status",
        type: "select",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Canceled At",
        description:
            "If the subscription has been canceled, the date of that cancellation. If the subscription was canceled with cancel_at_period_end, canceled_at will reflect the time of the most recent update request, not the end of the subscription period when the subscription is automatically moved to a canceled state.",
        api_slug: "canceled_at",
        type: "date",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Cancel At Period End",
        description:
            "Whether this subscription will (if status=active) or did (if status=canceled) cancel at the end of the current billing period.",
        api_slug: "cancelled",
        type: "select",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Collection Method",
        description:
            "Either charge_automatically, or send_invoice. When charging automatically, Stripe will attempt to pay this subscription at the end of the cycle using the default source attached to the customer. When sending an invoice, Stripe will email your customer an invoice with payment instructions and mark the subscription as active.",
        api_slug: "collection_method",
        type: "select",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Days until due",
        description:
            "Number of days a customer has to pay invoices generated by this subscription. This value will be null for subscriptions where collection_method=charge_automatically.",
        api_slug: "days_until_due",
        type: "number",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Start Date",
        description:
            "Date when the subscription was first created. The date might differ from the created date due to backdating.",
        api_slug: "start_date",
        type: "date",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Trial Start",
        description: "If the subscription has a trial, the beginning of that trial.",
        api_slug: "trial_start",
        type: "date",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Trial End",
        description: "If the subscription has a trial, the end of that trial.",
        api_slug: "trial_end",
        type: "date",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Mode",
        description: "The mode of the customer, either 'Live' or 'Test'.",
        api_slug: "mode",
        type: "select",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
]

const subscriptionSelectOptions: {attribute: string; options: string[]}[] = [
    {
        attribute: "status",
        options: [
            "Incomplete",
            "Incomplete Expired",
            "Trialing",
            "Active",
            "Past Due",
            "Canceled",
            "Unpaid",
            "Paused",
        ],
    },
    {
        attribute: "cancelled",
        options: ["True", "False"],
    },
    {
        attribute: "collection_method",
        options: ["Charge Automatically", "Send Invoice"],
    },
    {
        attribute: "mode",
        options: ["Live", "Test"],
    },
]

const createObjectAndAttributes = async (
    objects: any,
    objectApiSlug: string,
    singularNoun: string,
    pluralNoun: string,
    attributes: any[]
) => {
    const object = objects.data.find((o: any) => o?.api_slug === objectApiSlug)

    if (!object) {
        await createObject({
            api_slug: objectApiSlug,
            singular_noun: singularNoun,
            plural_noun: pluralNoun,
        })
    }

    const existingAttributes: any = await getAttributes(objectApiSlug)

    for (const attribute of attributes) {
        if (
            !existingAttributes.data.find(
                (existingAttribute: any) => existingAttribute?.api_slug === attribute.api_slug
            )
        ) {
            await createAttribute({
                object: objectApiSlug,
                ...attribute,
            })
        }
    }
}

const createSelectOptions = async (
    object: string,
    selectOptions: {attribute: string; options: string[]}[]
) => {
    for (const selectOption of selectOptions) {
        const existingOptions: any = await listOptions({object, attribute: selectOption.attribute})

        for (const option of selectOption.options) {
            if (
                !existingOptions.data.find(
                    (existingOption: any) => existingOption?.title === option
                )
            ) {
                await createOption({
                    object,
                    attribute: selectOption.attribute,
                    title: option,
                })
            }
        }
    }
}

export default async function connectionAdded({connection}: {connection: Connection}) {
    const objects: any = await getObjects()

    await createObjectAndAttributes(
        objects,
        "customers",
        "Customer",
        "Customers",
        customerAttributes
    )

    await createSelectOptions("customers", customerSelectOptions)

    await createObjectAndAttributes(objects, "invoices", "Invoice", "Invoices", invoiceAttributes)

    await createSelectOptions("invoices", invoiceSelectOptions)

    await createObjectAndAttributes(
        objects,
        "subscriptions",
        "Subscription",
        "Subscriptions",
        subscriptionAttributes
    )

    await createSelectOptions("subscriptions", subscriptionSelectOptions)

    const stripeWebhookHandler = await createWebhookHandler({
        fileName: "stripe",
    })

    const stripeWebhookRegistrationResponse = await fetch(
        "https://api.stripe.com/v2/core/event_destinations",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${connection.value}`,
                "Stripe-Version": "2025-07-30.preview",
            },
            body: JSON.stringify({
                name: "Attio",
                description: "Sync Stripe resources to Attio objects",
                type: "webhook_endpoint",
                event_payload: "snapshot",
                enabled_events: [
                    "customer.created",
                    "customer.updated",
                    "customer.deleted",
                    "customer.subscription.created",
                    "customer.subscription.deleted",
                    "customer.subscription.paused",
                    "customer.subscription.pending_update_applied",
                    "customer.subscription.pending_update_expired",
                    "customer.subscription.resumed",
                    "customer.subscription.trial_will_end",
                    "customer.subscription.updated",
                    "invoice.created",
                    "invoice.deleted",
                    "invoice.finalization_failed",
                    "invoice.finalized",
                    "invoice.marked_uncollectible",
                    "invoice.overdue",
                    "invoice.overpaid",
                    "invoice.paid",
                    "invoice.payment_action_required",
                    "invoice.payment_failed",
                    "invoice.payment_succeeded",
                    "invoice.sent",
                    "invoice.upcoming",
                    "invoice.updated",
                    "invoice.voided",
                    "invoice.will_be_due",
                    "product.created",
                    "product.updated",
                ],
                webhook_endpoint: {
                    url: stripeWebhookHandler.url,
                },
                include: ["webhook_endpoint.signing_secret", "webhook_endpoint.url"],
            }),
        }
    )

    if (!stripeWebhookRegistrationResponse.ok) {
        console.error(
            `Stripe webhook registration failed: ${stripeWebhookRegistrationResponse.statusText} ${stripeWebhookRegistrationResponse.status} ${await stripeWebhookRegistrationResponse.text()}`
        )
        throw new Error("Stripe webhook registration failed")
    }

    const stripeWebhookRegistration = await stripeWebhookRegistrationResponse.json()

    await updateWebhookHandler(stripeWebhookHandler.id, {
        externalWebhookId: stripeWebhookRegistration.id,
    })

    await experimental_kv.set(
        "stripe-webhook-secret",
        stripeWebhookRegistration.webhook_endpoint.signing_secret
    )

    try {
        await syncProducts(connection)
        await syncCustomers(connection)
        await syncInvoices(connection)
        await syncSubscriptions(connection)
    } catch (error) {
        console.error(error)

        const stripeWebhookDeletionResponse = await fetch(
            `https://api.stripe.com/v2/core/event_destinations/${stripeWebhookRegistration.id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${connection.value}`,
                    "Stripe-Version": "2025-07-30.preview",
                },
            }
        )

        if (!stripeWebhookDeletionResponse.ok) {
            console.error(
                `Failed to delete Stripe webhook: ${stripeWebhookDeletionResponse.statusText} ${stripeWebhookDeletionResponse.status} ${await stripeWebhookDeletionResponse.text()}`
            )

            throw new Error("Failed to delete Stripe webhook")
        }

        await deleteWebhookHandler(stripeWebhookHandler.id)
        throw new Error("Failed to sync Stripe resources to Attio objects")
    }
}
