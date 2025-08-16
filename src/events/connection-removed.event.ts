import {listWebhookHandlers, deleteWebhookHandler, experimental_kv} from "attio/server"
import type {Connection} from "attio/server"

export default async function connectionRemoved({connection}: {connection: Connection}) {
    const webhookHandlers = await listWebhookHandlers()

    for (const webhookHandler of webhookHandlers) {
        const stripeWebhookDeletionResponse = await fetch(
            `https://api.stripe.com/v2/core/event_destinations/${webhookHandler.externalWebhookId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${connection.value}`,
                    "Stripe-Version": "2025-07-30.preview",
                },
            }
        )

        if (!stripeWebhookDeletionResponse.ok) {
            throw new Error("Failed to delete Stripe webhook")
        }

        await deleteWebhookHandler(webhookHandler.id)
    }

    await experimental_kv.delete("stripe-webhook-secret")
}
