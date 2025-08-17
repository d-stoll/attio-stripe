/** biome-ignore-all lint/suspicious/noExplicitAny: dynamic return types */
import {type RecordAction, runQuery} from "attio/client"
import getInvoice from "../queries/get-invoice.graphql"

export const recordAction: RecordAction = {
    id: "open-invoice",
    label: "Open in Stripe",
    onTrigger: async ({recordId}) => {
        const invoice = await runQuery(getInvoice, {
            recordId,
        })

        const invoiceId =
            invoice.record?.invoice_id?.__typename === "TextValue"
                ? (invoice.record?.invoice_id?.value ?? "")
                : ""
        const mode =
            invoice.record?.mode?.__typename === "SelectValue"
                ? (invoice.record?.mode?.value?.title ?? "Test")
                : "Test"
        const invoiceUrl =
            mode === "Test"
                ? `https://dashboard.stripe.com/test/invoices/${invoiceId}`
                : `https://dashboard.stripe.com/invoices/${invoiceId}`
        window.open(invoiceUrl, "_blank")
    },
    objects: "invoices",
}
