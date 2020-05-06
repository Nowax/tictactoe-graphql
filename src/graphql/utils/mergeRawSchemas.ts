import { mergeWith, isArray } from 'lodash'
import { IExecutableSchemaDefinition } from 'apollo-server'

function withArraysConcatenation(objValue: string | any[], srcValue: any) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue)
  }
  return
}

export const mergeRawSchemas = (
  ...schemas: IExecutableSchemaDefinition[]
): IExecutableSchemaDefinition => {
  return mergeWith({}, ...schemas, withArraysConcatenation)
}
