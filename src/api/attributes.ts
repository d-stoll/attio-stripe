/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import {attioFetch} from "attio/server"

export const getAttributes = async (object: string) => {
    return await attioFetch({
        method: "GET",
        path: `/objects/${object}/attributes`,
    })
}

export type CreateAttributeParams = {
    object: string
    title: string
    description: string
    api_slug: string
    type: string
    is_required: boolean
    is_unique: boolean
    is_multiselect: boolean
    config: {
        currency?: {
            default_currency_code: string
            display_type: string
        }
        record_reference?: {
            allowed_objects: string[]
        }
    }
}

export const createAttribute = async ({
    object,
    title,
    description,
    api_slug,
    type,
    is_required,
    is_unique,
    is_multiselect,
    config,
}: CreateAttributeParams) => {
    return await attioFetch({
        method: "POST",
        path: `/objects/${object}/attributes`,
        body: {
            data: {
                title,
                description,
                api_slug,
                type,
                is_required,
                is_unique,
                is_multiselect,
                config,
            },
            },
        });
}
