/** biome-ignore-all lint/suspicious/noExplicitAny: dynamic return types */
import {type RecordAction, runQuery} from "attio/client"
import getSubscription from "../queries/get-subscription.graphql"

export const recordAction: RecordAction = {
    id: "open-subscription",
    label: "Open in Stripe",
    onTrigger: async ({recordId}) => {
        const subscription = await runQuery(getSubscription, {
            recordId,
        })

        const subscriptionId =
            subscription.record?.subscription_id?.__typename === "TextValue"
                ? (subscription.record?.subscription_id?.value ?? "")
                : ""
        const mode =
            subscription.record?.mode?.__typename === "SelectValue"
                ? (subscription.record?.mode?.value?.title ?? "Test")
                : "Test"
        const subscriptionUrl =
            mode === "Test"
                ? `https://dashboard.stripe.com/test/subscriptions/${subscriptionId}`
                : `https://dashboard.stripe.com/subscriptions/${subscriptionId}`
        window.open(subscriptionUrl, "_blank")
    },
    objects: "subscriptions",
}
