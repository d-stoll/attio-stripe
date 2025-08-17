/** biome-ignore-all lint/suspicious/noExplicitAny: dynamic return types */
import {type RecordAction, runQuery} from "attio/client"
import getCustomer from "../queries/get-customer.graphql"

export const recordAction: RecordAction = {
    id: "open-customer",
    label: "Open in Stripe",
    onTrigger: async ({recordId}) => {
        const customer = await runQuery(getCustomer, {
            recordId,
        })

        const customerId =
            customer.record?.customer_id?.__typename === "TextValue"
                ? (customer.record?.customer_id?.value ?? "")
                : ""
        const mode =
            customer.record?.mode?.__typename === "SelectValue"
                ? (customer.record?.mode?.value?.title ?? "Test")
                : "Test"

        const customerUrl =
            mode === "Test"
                ? `https://dashboard.stripe.com/test/customers/${customerId}`
                : `https://dashboard.stripe.com/customers/${customerId}`
        window.open(customerUrl, "_blank")
    },
    objects: "customers",
}
