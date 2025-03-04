"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHECK_SCHEMA = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.CHECK_SCHEMA = graphql_tag_1.default `
  mutation CheckSchema(
    $id: ID!
    $schema: IntrospectionSchemaInput
    $schemaHash: String
    $tag: String
    $gitContext: GitContextInput
    $historicParameters: HistoricQueryParameters
  ) {
    service(id: $id) {
      checkSchema(
        proposedSchema: $schema
        proposedSchemaHash: $schemaHash
        baseSchemaTag: $tag
        gitContext: $gitContext
        historicParameters: $historicParameters
      ) {
        targetUrl
        diffToPrevious {
          severity
          affectedClients {
            __typename
          }
          affectedQueries {
            __typename
          }
          numberOfCheckedOperations
          changes {
            severity
            code
            description
          }
          validationConfig {
            from
            to
            queryCountThreshold
            queryCountThresholdPercentage
          }
        }
      }
    }
  }
`;
//# sourceMappingURL=checkSchema.js.map