/** biome-ignore-all lint/suspicious/noExplicitAny: dynamic return types */
import type {Connection} from "attio/server"
import {assertRecord} from "../api/records"

export async function syncCustomers(connection: Connection) {
    let hasMore = true
    let startingAfter = null

    while (hasMore) {
        const url = new URL("https://api.stripe.com/v1/customers")
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

        for (const customer of data.data) {
            const values: Record<string, any> = {
                customer_id: customer.id,
            }

            if (customer.email) {
                values.email = customer.email
            }

            if (customer.name) {
                values.name = customer.name
            }

            if (customer.address) {
                values.address = {
                    line_1: customer.address.line1,
                    line_2: customer.address.line2,
                    line_3: null,
                    line_4: null,
                    locality: customer.address.city,
                    region: customer.address.state,
                    postcode: customer.address.postal_code,
                    country_code: customer.address.country,
                    latitude: null,
                    longitude: null,
                }
            }

            if (customer.shipping) {
                values.shipping = {
                    line_1: customer.shipping.address.line1,
                    line_2: customer.shipping.address.line2,
                    line_3: null,
                    line_4: null,
                    locality: customer.shipping.address.city,
                    region: customer.shipping.address.state,
                    postcode: customer.shipping.address.postal_code,
                    country_code: customer.shipping.address.country,
                    latitude: null,
                    longitude: null,
                }
            }

            if (customer.balance) {
                values.balance = customer.balance / 100
            }

            if (customer.invoice_prefix) {
                values.invoice_prefix = customer.invoice_prefix
            }

            if (customer.livemode) {
                values.mode = ["Live"]
            } else {
                values.mode = ["Test"]
            }

            await assertRecord({
                object: "customers",
                values: values,
                matching_attribute: "customer_id",
            })
        }

        if (data.data.length > 0) {
            startingAfter = data.data[data.data.length - 1].id
        }
    }
}
