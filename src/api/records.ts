/** biome-ignore-all lint/suspicious/noExplicitAny: dynamic return types */
import {attioFetch} from "attio/server"

type ListRecordsParams = {
    object: string
    filter?: Record<string, any>
    sorts?: {
        direction: "asc" | "desc"
        attribute: string
        field: string
    }[]
    limit?: number
    offset?: number
}

export const listRecords = async (params: ListRecordsParams) => {
    return await attioFetch({
        method: "POST",
        path: `/objects/${params.object}/records/query`,
        body: {
            filter: params.filter,
            sorts: params.sorts,
            limit: params.limit,
            offset: params.offset,
        } as any,
    })
}

type GetRecordParams = {
    object: string
    record: string
}

export const getRecord = async (params: GetRecordParams) => {
    return await attioFetch({
        method: "GET",
        path: `/objects/${params.object}/records/${params.record}`,
    })
}

type AssertRecordParams = {
    object: string
    values: Record<string, any>
    matching_attribute: string
}

export const assertRecord = async (params: AssertRecordParams) => {
    return await attioFetch({
        method: "PUT" as any,
        path: `/objects/${params.object}/records`,
        queryParams: {
            matching_attribute: params.matching_attribute,
        },
        body: {
            data: {
                values: params.values,
            },
        },
    })
}

type DeleteRecordParams = {
    object: string
    record: string
}

export const deleteRecord = async (params: DeleteRecordParams) => {
    return await attioFetch({
        method: "DELETE",
        path: `/objects/${params.object}/records/${params.record}`,
    })
}
