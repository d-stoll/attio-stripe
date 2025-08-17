import {type RecordWidget, useAsyncCache, Widget} from "attio/client"
import React from "react"
import totalRevenue from "./total-revenue.server"

const TotalRevenueWidget = ({recordId}: {recordId: string}) => {
    const results = useAsyncCache({
        totalRevenue: [totalRevenue, {recordId}],
    })
    return (
        <Widget.TextWidget>
            <Widget.Title>Total Revenue</Widget.Title>
            <Widget.Text.Primary>{results.values.totalRevenue}$</Widget.Text.Primary>
        </Widget.TextWidget>
    )
}

export const recordWidget: RecordWidget = {
    id: "customer-total-revenue",
    label: "Total Revenue",
    Widget: ({recordId}) => {
        return (
            <React.Suspense fallback={<Widget.Loading />}>
                <TotalRevenueWidget recordId={recordId} />
            </React.Suspense>
        )
    },
    objects: "customers",
}
