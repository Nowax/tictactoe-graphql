import { mergeWith, isArray } from 'lodash'
import { IExecutableSchemaDefinition } from 'apollo-server'

function withArraysConcatination(objValue: string | any[], srcValue: any) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue)
  }
}

export const mergeRawSchemas = (
  ...schemas: IExecutableSchemaDefinition[]
): IExecutableSchemaDefinition => {
  return mergeWith({}, ...schemas, withArraysConcatination)
}
