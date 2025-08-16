import {experimental_kv} from "attio/server"
import {enc, HmacSHA256} from "crypto-js"
import {timingSafeEqual} from "../lib/crypto"

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
