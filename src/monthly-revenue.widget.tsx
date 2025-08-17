import {type RecordWidget, useAsyncCache, Widget} from "attio/client"
import React from "react"
import monthlyRevenue from "./monthly-revenue.server"

const MonthlyRevenueWidget = ({recordId}: {recordId: string}) => {
    const results = useAsyncCache({
        monthlyRevenue: [monthlyRevenue, {recordId}],
    })
    return (
        <Widget.TextWidget>
            <Widget.Title>Monthly Revenue</Widget.Title>
            <Widget.Text.Primary>{results.values.monthlyRevenue}$</Widget.Text.Primary>
        </Widget.TextWidget>
    )
}

export const recordWidget: RecordWidget = {
    id: "customer-monthly-revenue",
    label: "Monthly Revenue",
    Widget: ({recordId}) => {
        return (
            <React.Suspense fallback={<Widget.Loading />}>
                <MonthlyRevenueWidget recordId={recordId} />
            </React.Suspense>
        )
    },
    objects: "customers",
}
