/** biome-ignore-all lint/suspicious/noExplicitAny: dynamic return types */
import {type Connection, experimental_kv} from "attio/server"
import {assertRecord, listRecords} from "../api/records"

export async function syncSubscriptions(connection: Connection) {
    let hasMore = true
    let startingAfter = null

    while (hasMore) {
        const url = new URL("https://api.stripe.com/v1/subscriptions")
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

        for (const subscription of data.data) {
            const values: Record<string, any> = {
                subscription_id: subscription.id,
            }

            if (subscription.customer) {
                const customers = (await listRecords({
                    object: "customers",
                    filter: {
                        customer_id: subscription.customer,
                    },
                })) as any

                if (customers.data.length > 0) {
                    values.customer_id = customers.data[0].id.record_id
                }
            }

            if (subscription.latest_invoice) {
                const invoices = (await listRecords({
                    object: "invoices",
                    filter: {
                        invoice_id: subscription.latest_invoice,
                    },
                })) as any

                if (invoices.data.length > 0) {
                    values.latest_invoice = invoices.data[0].id.record_id
                }
            }

            if (subscription?.items?.data) {
                const products: string[] = []
                for (const productId of subscription.items.data.map(
                    (item: any) => item.plan.product
                )) {
                    const product = await experimental_kv.get(`stripe-product-${productId}`)
                    if (product) {
                        products.push(product.value as string)
                    }
                }
                values.products = products
            }

            if (subscription.description) {
                values.description = subscription.description
            }

            if (subscription.status) {
                values.status = [subscription.status]
            }

            if (subscription.canceled_at) {
                values.canceled_at = new Date(subscription.canceled_at * 1000).toISOString()
            }

            if (subscription.cancel_at_period_end) {
                values.cancelled = subscription.cancel_at_period_end === true ? ["True"] : ["False"]
            }

            if (subscription.collection_method) {
                values.collection_method = [subscription.collection_method]
            }

            if (subscription.days_until_due) {
                values.days_until_due = subscription.days_until_due
            }

            if (subscription.start_date) {
                values.start_date = new Date(subscription.start_date * 1000).toISOString()
            }

            if (subscription.trial_start) {
                values.trial_start = new Date(subscription.trial_start * 1000).toISOString()
            }

            if (subscription.trial_end) {
                values.trial_end = new Date(subscription.trial_end * 1000).toISOString()
            }

            if (subscription.livemode) {
                values.mode = ["Live"]
            } else {
                values.mode = ["Test"]
            }

            await assertRecord({
                object: "subscriptions",
                values: values,
                matching_attribute: "subscription_id",
            })
        }

        startingAfter = data.data[data.data.length - 1].id
    }
}
