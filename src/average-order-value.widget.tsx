import {type RecordWidget, useAsyncCache, Widget} from "attio/client"
import React from "react"
import averageOrderValue from "./average-order-value.server"

const AverageOrderValueWidget = ({recordId}: {recordId: string}) => {
    const results = useAsyncCache({
        averageOrderValue: [averageOrderValue, {recordId}],
    })
    return (
        <Widget.TextWidget>
            <Widget.Title>Average Order Value</Widget.Title>
            <Widget.Text.Primary>{results.values.averageOrderValue}$</Widget.Text.Primary>
        </Widget.TextWidget>
    )
}

export const recordWidget: RecordWidget = {
    id: "customer-average-order-value",
    label: "Average Order Value",
    Widget: ({recordId}) => {
        return (
            <React.Suspense fallback={<Widget.Loading />}>
                <AverageOrderValueWidget recordId={recordId} />
            </React.Suspense>
        )
    },
    objects: "customers",
}
