"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apolloClientSchemaDocument = exports.apolloClientSchema = void 0;
const document_1 = require("../document");
const graphql_1 = require("graphql");
exports.apolloClientSchema = `#graphql
"""
Direct the client to resolve this field locally, either from the cache or local resolvers.
"""
directive @client(
  """
  When true, the client will never use the cache for this value. See
  https://www.apollographql.com/docs/react/essentials/local-state/#forcing-resolvers-with-clientalways-true
  """
  always: Boolean
) on FIELD | FRAGMENT_DEFINITION | INLINE_FRAGMENT

"""
Export this locally resolved field as a variable to be used in the remainder of this query. See
https://www.apollographql.com/docs/react/essentials/local-state/#using-client-fields-as-variables
"""
directive @export(
  """
  The variable name to export this field as.
  """
  as: String!
) on FIELD

"""
Specify a custom store key for this result. See
https://www.apollographql.com/docs/react/advanced/caching/#the-connection-directive
"""
directive @connection(
  """
  Specify the store key.
  """
  key: String!
  """
  An array of query argument names to include in the generated custom store key.
  """
  filter: [String!]
) on FIELD
`;
exports.apolloClientSchemaDocument = new document_1.GraphQLDocument(new graphql_1.Source(exports.apolloClientSchema));
//# sourceMappingURL=defaultClientSchema.js.map