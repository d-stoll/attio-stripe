import {type RecordWidget, useAsyncCache, Widget} from "attio/client"
import React from "react"
import annualRevenue from "./annual-revenue.server"

const AnnualRevenueWidget = ({recordId}: {recordId: string}) => {
    const results = useAsyncCache({
        annualRevenue: [annualRevenue, {recordId}],
    })

    return (
        <Widget.TextWidget>
            <Widget.Title>Annual Revenue</Widget.Title>
            <Widget.Text.Primary>{results.values.annualRevenue}$</Widget.Text.Primary>
        </Widget.TextWidget>
    )
}

export const recordWidget: RecordWidget = {
    id: "customer-annual-revenue",
    label: "Annual Revenue",
    Widget: ({recordId}) => {
        return (
            <React.Suspense fallback={<Widget.Loading />}>
                <AnnualRevenueWidget recordId={recordId} />
            </React.Suspense>
        )
    },
    objects: "customers",
}
