/**
 * ****************************************************
 * THIS FILE IS AUTO-GENERATED AT DEVELOPMENT TIME.
 *
 * DO NOT EDIT DIRECTLY OR COMMIT IT TO SOURCE CONTROL.
 * ****************************************************
 */
import {Query} from "attio/client"

type Exact<T extends {[key: string]: unknown}> = {[K in keyof T]: T[K]}

type Scalars = {
    ID: {input: string; output: string}
    String: {input: string; output: string}
    Boolean: {input: boolean; output: boolean}
    Int: {input: number; output: number}
    Float: {input: number; output: number}
}

declare module "./get-subscription.graphql" {
    export type GetSubscriptionQueryVariables = Exact<{
        recordId: Scalars["String"]["input"]
    }>

    export type GetSubscriptionQuery = {
        record:
            | {
                  id: string
                  subscription_id:
                      | {__typename: "RecordReferenceValue"}
                      | {__typename: "MultiRecordReferenceValue"}
                      | {__typename: "PersonalNameValue"}
                      | {__typename: "TextValue"; value: string | null}
                      | {__typename: "DateValue"}
                      | {__typename: "TimestampValue"}
                      | {__typename: "NumberValue"}
                      | {__typename: "MultiEmailAddressValue"}
                      | {__typename: "DomainValue"}
                      | {__typename: "MultiDomainValue"}
                      | {__typename: "LocationValue"}
                      | {__typename: "InteractionValue"}
                      | {__typename: "SelectValue"}
                      | {__typename: "MultiSelectValue"}
                      | {__typename: "StatusValue"}
                      | {__typename: "CheckboxValue"}
                      | {__typename: "RatingValue"}
                      | {__typename: "PhoneNumberValue"}
                      | {__typename: "MultiPhoneNumberValue"}
                      | {__typename: "CurrencyValue"}
                      | {__typename: "ActorReferenceValue"}
                      | {__typename: "MultiActorReferenceValue"}
                      | null
                  mode:
                      | {__typename: "RecordReferenceValue"}
                      | {__typename: "MultiRecordReferenceValue"}
                      | {__typename: "PersonalNameValue"}
                      | {__typename: "TextValue"}
                      | {__typename: "DateValue"}
                      | {__typename: "TimestampValue"}
                      | {__typename: "NumberValue"}
                      | {__typename: "MultiEmailAddressValue"}
                      | {__typename: "DomainValue"}
                      | {__typename: "MultiDomainValue"}
                      | {__typename: "LocationValue"}
                      | {__typename: "InteractionValue"}
                      | {__typename: "SelectValue"; value: {title: string} | null}
                      | {__typename: "MultiSelectValue"}
                      | {__typename: "StatusValue"}
                      | {__typename: "CheckboxValue"}
                      | {__typename: "RatingValue"}
                      | {__typename: "PhoneNumberValue"}
                      | {__typename: "MultiPhoneNumberValue"}
                      | {__typename: "CurrencyValue"}
                      | {__typename: "ActorReferenceValue"}
                      | {__typename: "MultiActorReferenceValue"}
                      | null
              }
            | {
                  id: string
                  subscription_id:
                      | {__typename: "RecordReferenceValue"}
                      | {__typename: "MultiRecordReferenceValue"}
                      | {__typename: "PersonalNameValue"}
                      | {__typename: "TextValue"; value: string | null}
                      | {__typename: "DateValue"}
                      | {__typename: "TimestampValue"}
                      | {__typename: "NumberValue"}
                      | {__typename: "MultiEmailAddressValue"}
                      | {__typename: "DomainValue"}
                      | {__typename: "MultiDomainValue"}
                      | {__typename: "LocationValue"}
                      | {__typename: "InteractionValue"}
                      | {__typename: "SelectValue"}
                      | {__typename: "MultiSelectValue"}
                      | {__typename: "StatusValue"}
                      | {__typename: "CheckboxValue"}
                      | {__typename: "RatingValue"}
                      | {__typename: "PhoneNumberValue"}
                      | {__typename: "MultiPhoneNumberValue"}
                      | {__typename: "CurrencyValue"}
                      | {__typename: "ActorReferenceValue"}
                      | {__typename: "MultiActorReferenceValue"}
                      | null
                  mode:
                      | {__typename: "RecordReferenceValue"}
                      | {__typename: "MultiRecordReferenceValue"}
                      | {__typename: "PersonalNameValue"}
                      | {__typename: "TextValue"}
                      | {__typename: "DateValue"}
                      | {__typename: "TimestampValue"}
                      | {__typename: "NumberValue"}
                      | {__typename: "MultiEmailAddressValue"}
                      | {__typename: "DomainValue"}
                      | {__typename: "MultiDomainValue"}
                      | {__typename: "LocationValue"}
                      | {__typename: "InteractionValue"}
                      | {__typename: "SelectValue"; value: {title: string} | null}
                      | {__typename: "MultiSelectValue"}
                      | {__typename: "StatusValue"}
                      | {__typename: "CheckboxValue"}
                      | {__typename: "RatingValue"}
                      | {__typename: "PhoneNumberValue"}
                      | {__typename: "MultiPhoneNumberValue"}
                      | {__typename: "CurrencyValue"}
                      | {__typename: "ActorReferenceValue"}
                      | {__typename: "MultiActorReferenceValue"}
                      | null
              }
            | {
                  id: string
                  subscription_id:
                      | {__typename: "RecordReferenceValue"}
                      | {__typename: "MultiRecordReferenceValue"}
                      | {__typename: "PersonalNameValue"}
                      | {__typename: "TextValue"; value: string | null}
                      | {__typename: "DateValue"}
                      | {__typename: "TimestampValue"}
                      | {__typename: "NumberValue"}
                      | {__typename: "MultiEmailAddressValue"}
                      | {__typename: "DomainValue"}
                      | {__typename: "MultiDomainValue"}
                      | {__typename: "LocationValue"}
                      | {__typename: "InteractionValue"}
                      | {__typename: "SelectValue"}
                      | {__typename: "MultiSelectValue"}
                      | {__typename: "StatusValue"}
                      | {__typename: "CheckboxValue"}
                      | {__typename: "RatingValue"}
                      | {__typename: "PhoneNumberValue"}
                      | {__typename: "MultiPhoneNumberValue"}
                      | {__typename: "CurrencyValue"}
                      | {__typename: "ActorReferenceValue"}
                      | {__typename: "MultiActorReferenceValue"}
                      | null
                  mode:
                      | {__typename: "RecordReferenceValue"}
                      | {__typename: "MultiRecordReferenceValue"}
                      | {__typename: "PersonalNameValue"}
                      | {__typename: "TextValue"}
                      | {__typename: "DateValue"}
                      | {__typename: "TimestampValue"}
                      | {__typename: "NumberValue"}
                      | {__typename: "MultiEmailAddressValue"}
                      | {__typename: "DomainValue"}
                      | {__typename: "MultiDomainValue"}
                      | {__typename: "LocationValue"}
                      | {__typename: "InteractionValue"}
                      | {__typename: "SelectValue"; value: {title: string} | null}
                      | {__typename: "MultiSelectValue"}
                      | {__typename: "StatusValue"}
                      | {__typename: "CheckboxValue"}
                      | {__typename: "RatingValue"}
                      | {__typename: "PhoneNumberValue"}
                      | {__typename: "MultiPhoneNumberValue"}
                      | {__typename: "CurrencyValue"}
                      | {__typename: "ActorReferenceValue"}
                      | {__typename: "MultiActorReferenceValue"}
                      | null
              }
            | {
                  id: string
                  subscription_id:
                      | {__typename: "RecordReferenceValue"}
                      | {__typename: "MultiRecordReferenceValue"}
                      | {__typename: "PersonalNameValue"}
                      | {__typename: "TextValue"; value: string | null}
                      | {__typename: "DateValue"}
                      | {__typename: "TimestampValue"}
                      | {__typename: "NumberValue"}
                      | {__typename: "MultiEmailAddressValue"}
                      | {__typename: "DomainValue"}
                      | {__typename: "MultiDomainValue"}
                      | {__typename: "LocationValue"}
                      | {__typename: "InteractionValue"}
                      | {__typename: "SelectValue"}
                      | {__typename: "MultiSelectValue"}
                      | {__typename: "StatusValue"}
                      | {__typename: "CheckboxValue"}
                      | {__typename: "RatingValue"}
                      | {__typename: "PhoneNumberValue"}
                      | {__typename: "MultiPhoneNumberValue"}
                      | {__typename: "CurrencyValue"}
                      | {__typename: "ActorReferenceValue"}
                      | {__typename: "MultiActorReferenceValue"}
                      | null
                  mode:
                      | {__typename: "RecordReferenceValue"}
                      | {__typename: "MultiRecordReferenceValue"}
                      | {__typename: "PersonalNameValue"}
                      | {__typename: "TextValue"}
                      | {__typename: "DateValue"}
                      | {__typename: "TimestampValue"}
                      | {__typename: "NumberValue"}
                      | {__typename: "MultiEmailAddressValue"}
                      | {__typename: "DomainValue"}
                      | {__typename: "MultiDomainValue"}
                      | {__typename: "LocationValue"}
                      | {__typename: "InteractionValue"}
                      | {__typename: "SelectValue"; value: {title: string} | null}
                      | {__typename: "MultiSelectValue"}
                      | {__typename: "StatusValue"}
                      | {__typename: "CheckboxValue"}
                      | {__typename: "RatingValue"}
                      | {__typename: "PhoneNumberValue"}
                      | {__typename: "MultiPhoneNumberValue"}
                      | {__typename: "CurrencyValue"}
                      | {__typename: "ActorReferenceValue"}
                      | {__typename: "MultiActorReferenceValue"}
                      | null
              }
            | {
                  id: string
                  subscription_id:
                      | {__typename: "RecordReferenceValue"}
                      | {__typename: "MultiRecordReferenceValue"}
                      | {__typename: "PersonalNameValue"}
                      | {__typename: "TextValue"; value: string | null}
                      | {__typename: "DateValue"}
                      | {__typename: "TimestampValue"}
                      | {__typename: "NumberValue"}
                      | {__typename: "MultiEmailAddressValue"}
                      | {__typename: "DomainValue"}
                      | {__typename: "MultiDomainValue"}
                      | {__typename: "LocationValue"}
                      | {__typename: "InteractionValue"}
                      | {__typename: "SelectValue"}
                      | {__typename: "MultiSelectValue"}
                      | {__typename: "StatusValue"}
                      | {__typename: "CheckboxValue"}
                      | {__typename: "RatingValue"}
                      | {__typename: "PhoneNumberValue"}
                      | {__typename: "MultiPhoneNumberValue"}
                      | {__typename: "CurrencyValue"}
                      | {__typename: "ActorReferenceValue"}
                      | {__typename: "MultiActorReferenceValue"}
                      | null
                  mode:
                      | {__typename: "RecordReferenceValue"}
                      | {__typename: "MultiRecordReferenceValue"}
                      | {__typename: "PersonalNameValue"}
                      | {__typename: "TextValue"}
                      | {__typename: "DateValue"}
                      | {__typename: "TimestampValue"}
                      | {__typename: "NumberValue"}
                      | {__typename: "MultiEmailAddressValue"}
                      | {__typename: "DomainValue"}
                      | {__typename: "MultiDomainValue"}
                      | {__typename: "LocationValue"}
                      | {__typename: "InteractionValue"}
                      | {__typename: "SelectValue"; value: {title: string} | null}
                      | {__typename: "MultiSelectValue"}
                      | {__typename: "StatusValue"}
                      | {__typename: "CheckboxValue"}
                      | {__typename: "RatingValue"}
                      | {__typename: "PhoneNumberValue"}
                      | {__typename: "MultiPhoneNumberValue"}
                      | {__typename: "CurrencyValue"}
                      | {__typename: "ActorReferenceValue"}
                      | {__typename: "MultiActorReferenceValue"}
                      | null
              }
            | {
                  id: string
                  subscription_id:
                      | {__typename: "RecordReferenceValue"}
                      | {__typename: "MultiRecordReferenceValue"}
                      | {__typename: "PersonalNameValue"}
                      | {__typename: "TextValue"; value: string | null}
                      | {__typename: "DateValue"}
                      | {__typename: "TimestampValue"}
                      | {__typename: "NumberValue"}
                      | {__typename: "MultiEmailAddressValue"}
                      | {__typename: "DomainValue"}
                      | {__typename: "MultiDomainValue"}
                      | {__typename: "LocationValue"}
                      | {__typename: "InteractionValue"}
                      | {__typename: "SelectValue"}
                      | {__typename: "MultiSelectValue"}
                      | {__typename: "StatusValue"}
                      | {__typename: "CheckboxValue"}
                      | {__typename: "RatingValue"}
                      | {__typename: "PhoneNumberValue"}
                      | {__typename: "MultiPhoneNumberValue"}
                      | {__typename: "CurrencyValue"}
                      | {__typename: "ActorReferenceValue"}
                      | {__typename: "MultiActorReferenceValue"}
                      | null
                  mode:
                      | {__typename: "RecordReferenceValue"}
                      | {__typename: "MultiRecordReferenceValue"}
                      | {__typename: "PersonalNameValue"}
                      | {__typename: "TextValue"}
                      | {__typename: "DateValue"}
                      | {__typename: "TimestampValue"}
                      | {__typename: "NumberValue"}
                      | {__typename: "MultiEmailAddressValue"}
                      | {__typename: "DomainValue"}
                      | {__typename: "MultiDomainValue"}
                      | {__typename: "LocationValue"}
                      | {__typename: "InteractionValue"}
                      | {__typename: "SelectValue"; value: {title: string} | null}
                      | {__typename: "MultiSelectValue"}
                      | {__typename: "StatusValue"}
                      | {__typename: "CheckboxValue"}
                      | {__typename: "RatingValue"}
                      | {__typename: "PhoneNumberValue"}
                      | {__typename: "MultiPhoneNumberValue"}
                      | {__typename: "CurrencyValue"}
                      | {__typename: "ActorReferenceValue"}
                      | {__typename: "MultiActorReferenceValue"}
                      | null
              }
            | null
    }

    const value: Query<GetSubscriptionQueryVariables, GetSubscriptionQuery>
    export default value
}
