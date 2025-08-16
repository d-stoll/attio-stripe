/** biome-ignore-all lint/suspicious/noExplicitAny: dynamic return types */
import {Connection} from "attio/server"
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
            console.log(customer)
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

            await assertRecord({
                object: "customers",
                values: values,
                matching_attribute: "customer_id",
            })
        }

        startingAfter = data.data[data.data.length - 1].id
    }
}
