/** biome-ignore-all lint/suspicious/noExplicitAny: dynamic return types */
import {type Connection, experimental_kv} from "attio/server"
import {createOption, listOptions} from "../api/attributes"

export async function syncProducts(connection: Connection) {
    let hasMore = true
    let startingAfter = null

    const invoiceListOptions = (await listOptions({
        object: "invoices",
        attribute: "products",
    })) as any

    const subscriptionListOptions = (await listOptions({
        object: "subscriptions",
        attribute: "products",
    })) as any

    const invoiceOptions = invoiceListOptions.data.map((option: any) => option.title) as string[]
    const subscriptionOptions = subscriptionListOptions.data.map(
        (option: any) => option.title
    ) as string[]

    while (hasMore) {
        const url = new URL("https://api.stripe.com/v1/products")
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

        for (const product of data.data) {
            await experimental_kv.set(`stripe-product-${product.id}`, product.name)

            if (!invoiceOptions.includes(product.name)) {
                await createOption({
                    object: "invoices",
                    attribute: "products",
                    title: product.name,
                })
                invoiceOptions.push(product.name)
            }

            if (!subscriptionOptions.includes(product.name)) {
                await createOption({
                    object: "subscriptions",
                    attribute: "products",
                    title: product.name,
                })
                subscriptionOptions.push(product.name)
            }
        }

        startingAfter = data.data[data.data.length - 1].id
    }
}
