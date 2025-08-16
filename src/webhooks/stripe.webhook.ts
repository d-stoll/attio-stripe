import {experimental_kv} from "attio/server"

export default async function stripeWebhookHandler(request: Request) {
    if (!request.body) {
        return new Response("Body is missing", {status: 400})
    }

    const body = await request.text()
    const endpointSecret = await experimental_kv.get("stripe-webhook-secret")

    if (endpointSecret?.value) {
        const signatureHeader = request.headers.get("stripe-signature")
        const parts = signatureHeader?.split(",").map((part) => part.split("="))
        const timestamp = parts?.find((part) => part[0] === "t")?.[1]
        const requestSignature = parts?.find((part) => part[0] === "v1")?.[1]

        if (!timestamp || !requestSignature) {
            return new Response("Signature is missing", {status: 400})
        }

        const signedPayload = `${timestamp}.${body}`

        const encoder = new TextEncoder()
        const key = await crypto.subtle.importKey(
            "raw",
            encoder.encode(endpointSecret.value as string),
            {name: "HMAC", hash: "SHA-256"},
            false,
            ["sign"]
        )
        const buffer = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload))

        const computedSignature = Array.from(new Uint8Array(buffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")

        if (requestSignature !== computedSignature) {
            return new Response("Signature is invalid", {status: 400})
        }
    }

    const event = JSON.parse(body)
    switch (event.type) {
        case "customer.created":
            console.log(event)
            break
        case "customer.updated":
            console.log(event)
            break
        case "customer.deleted":
            console.log(event)
            break
        case "customer.subscription.created":
            console.log(event)
            break
        case "customer.subscription.updated":
        case "customer.subscription.paused":
        case "customer.subscription.pending_update_applied":
        case "customer.subscription.pending_update_expired":
        case "customer.subscription.resumed":
        case "customer.subscription.trial_will_end":
            console.log(event)
            break
        case "customer.subscription.deleted":
            console.log(event)
            break
        case "invoice.created":
            console.log(event)
            break
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
        case "invoice.will_be_due":
            console.log(event)
            break
        case "invoice.deleted":
            console.log(event)
            break
        default:
            console.log(`Unhandled event type ${event.type}`)
    }

    return new Response("OK", {status: 200})
}
