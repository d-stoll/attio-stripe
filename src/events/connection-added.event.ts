/** biome-ignore-all lint(suspicious/noExplicitAny): For the purpose of this tutorial, we are using the `any` type to keep the code simple. In a real-world application, you should use more specific types. */
import {
    createWebhookHandler,
    experimental_kv,
    updateWebhookHandler,
    type Connection,
} from "attio/server"
import {createAttribute, getAttributes, type CreateAttributeParams} from "../api/attributes"
import {createObject, getObjects} from "../api/objects"

const customerAttributesToAdd: Omit<CreateAttributeParams, "object">[] = [
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
]

const invoiceAttributesToAdd: Omit<CreateAttributeParams, "object">[] = [
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
        api_slug: "invoice-url",
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
        api_slug: "amount-due",
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
        api_slug: "amount-overpaid",
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
        api_slug: "amount-paid",
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
        api_slug: "amount-remaining",
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
        api_slug: "amount-shipping",
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
        title: "Aplied Amount",
        description: "The amount that was applied to the invoice.",
        api_slug: "applied-amount",
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
        api_slug: "due-date",
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
        api_slug: "ending-balance",
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
        api_slug: "invoice-pdf",
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
        api_slug: "receipt-number",
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
        api_slug: "starting-balance",
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
        api_slug: "subtotal-excl-tax",
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
        api_slug: "total-excl-tax",
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
]

const subscriptionAttributesToAdd: Omit<CreateAttributeParams, "object">[] = [
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
        title: "Items",
        description: "List of subscription items, each with an attached price.",
        api_slug: "items",
        type: "select",
        is_required: false,
        is_unique: false,
        is_multiselect: true,
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
        api_slug: "canceled-at",
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
        type: "boolean",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Collection Method",
        description:
            "Either charge_automatically, or send_invoice. When charging automatically, Stripe will attempt to pay this subscription at the end of the cycle using the default source attached to the customer. When sending an invoice, Stripe will email your customer an invoice with payment instructions and mark the subscription as active.",
        api_slug: "collection-method",
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
        api_slug: "days-until-due",
        type: "number",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Discounts",
        description:
            "The discounts applied to the subscription. Subscription item discounts are applied before subscription discounts. Use expand[]=discounts to expand each discount.",
        api_slug: "discounts",
        type: "select",
        is_required: false,
        is_unique: false,
        is_multiselect: true,
        config: {},
    },
    {
        title: "Start Date",
        description:
            "Date when the subscription was first created. The date might differ from the created date due to backdating.",
        api_slug: "start-date",
        type: "date",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Trial Start",
        description: "If the subscription has a trial, the beginning of that trial.",
        api_slug: "trial-start",
        type: "date",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
    {
        title: "Trial End",
        description: "If the subscription has a trial, the end of that trial.",
        api_slug: "trial-end",
        type: "date",
        is_required: false,
        is_unique: false,
        is_multiselect: false,
        config: {},
    },
]

const createObjectAndAttributes = async (
    objects: any,
    objectApiSlug: string,
    singularNoun: string,
    pluralNoun: string,
    attributesToAdd: any[]
) => {
    const object = objects.data.find((o: any) => o?.api_slug === objectApiSlug)

    console.log(object)

    if (!object) {
        await createObject({
            api_slug: objectApiSlug,
            singular_noun: singularNoun,
            plural_noun: pluralNoun,
        })
    }

    const existingAttributes: any = await getAttributes(objectApiSlug)

    console.log(existingAttributes)

    for (const attribute of attributesToAdd) {
        console.log(attribute)
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

export default async function connectionAdded({connection}: {connection: Connection}) {
    const objects: any = await getObjects()

    await createObjectAndAttributes(
        objects,
        "customers",
        "Customer",
        "Customers",
        customerAttributesToAdd
    )

    await createObjectAndAttributes(
        objects,
        "invoices",
        "Invoice",
        "Invoices",
        invoiceAttributesToAdd
    )

    await createObjectAndAttributes(
        objects,
        "subscriptions",
        "Subscription",
        "Subscriptions",
        subscriptionAttributesToAdd
    )

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
                    "v1.customer.created",
                    "v1.customer.updated",
                    "v1.customer.deleted",
                    "v1.customer.subscription.created",
                    "v1.customer.subscription.deleted",
                    "v1.customer.subscription.paused",
                    "v1.customer.subscription.pending_update_applied",
                    "v1.customer.subscription.pending_update_expired",
                    "v1.customer.subscription.resumed",
                    "v1.customer.subscription.trial_will_end",
                    "v1.customer.subscription.updated",
                    "v1.invoice.created",
                    "v1.invoice.deleted",
                    "v1.invoice.finalization_failed",
                    "v1.invoice.finalized",
                    "v1.invoice.marked_uncollectible",
                    "v1.invoice.overdue",
                    "v1.invoice.overpaid",
                    "v1.invoice.paid",
                    "v1.invoice.payment_action_required",
                    "v1.invoice.payment_failed",
                    "v1.invoice.payment_succeeded",
                    "v1.invoice.sent",
                    "v1.invoice.upcoming",
                    "v1.invoice.updated",
                    "v1.invoice.voided",
                    "v1.invoice.will_be_due",
                ],
                webhook_endpoint: {
                    url: stripeWebhookHandler.url,
                },
                include: ["webhook_endpoint.signing_secret", "webhook_endpoint.url"],
            }),
        }
    )

    if (stripeWebhookRegistrationResponse.ok) {
        const stripeWebhookRegistration = await stripeWebhookRegistrationResponse.json()

        await updateWebhookHandler(stripeWebhookHandler.id, {
            externalWebhookId: stripeWebhookRegistration.id,
        })
        await experimental_kv.set("stripe-webhook-secret", stripeWebhookRegistration.signing_secret)
    } else {
        throw new Error("Stripe webhook registration failed")
    }
}
