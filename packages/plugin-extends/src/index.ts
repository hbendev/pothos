import { GraphQLNamedType, GraphQLObjectType } from 'graphql';
import {
  BasePlugin,
  QueryFieldsShape,
  MutationFieldsShape,
  SubscriptionFieldsShape,
  QueryFieldBuilder,
  MutationFieldBuilder,
  SubscriptionFieldBuilder,
  ObjectFieldBuilder,
  getObjectOptions,
} from '@giraphql/core';
import './global-types';

export default class ExtendsPlugin implements BasePlugin {
  onType(type: GraphQLNamedType, builder: GiraphQLSchemaTypes.SchemaBuilder<any>) {
    if (type instanceof GraphQLObjectType) {
      const extendsMap = getObjectOptions(type).extends || {};

      Object.keys(extendsMap).forEach((key) => {
        const shape = extendsMap[key];

        if (shape) {
          if (key === 'Query') {
            builder.queryFields(() => (shape as QueryFieldsShape<any>)(new QueryFieldBuilder()));
          } else if (key === 'Mutation') {
            builder.mutationFields(() =>
              (shape as MutationFieldsShape<any>)(new MutationFieldBuilder()),
            );
          } else if (key === 'Subscription') {
            builder.subscriptionFields(() =>
              (shape as SubscriptionFieldsShape<any>)(new SubscriptionFieldBuilder()),
            );
          } else {
            builder.objectFields(key, () => shape(new ObjectFieldBuilder(key)));
          }
        }
      });
    }
  }
}
