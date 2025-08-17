/** biome-ignore-all lint/suspicious/noExplicitAny: dynamic return types */
import {attioFetch} from "attio/server"

export default async function monthlyRevenue({recordId}: {recordId: string}): Promise<number> {
    const invoices = (await attioFetch({
        method: "POST",
        path: `/objects/invoices/records/query`,
        body: {
            filter: {
                customer_id: {
                    target_object: "customers",
                    target_record_id: recordId,
                },
                due_date: {
                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                        .toISOString()
                        .split("T")[0],
                },
            },
        } as any,
    })) as any

    return invoices.data.reduce(
        (acc: number, invoice: any) => acc + invoice.values.total[0].currency_value,
        0
    )
}
