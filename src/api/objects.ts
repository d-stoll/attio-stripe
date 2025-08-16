/** biome-ignore-all lint/suspicious/noExplicitAny: dynamic return types */
import {attioFetch} from "attio/server"

export const getObjects = async () => {
    return await attioFetch({
        method: "GET",
        path: "/objects",
    })
}

type CreateObjectParams = {
    api_slug: string
    singular_noun: string
    plural_noun: string
}

export const createObject = async (params: CreateObjectParams) => {
    return await attioFetch({
        method: "POST",
        path: "/objects",
        body: {
            data: params,
        },
    })
}
