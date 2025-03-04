"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATE_OPERATIONS = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.VALIDATE_OPERATIONS = graphql_tag_1.default `
  mutation ValidateOperations(
    $id: ID!
    $operations: [OperationDocumentInput!]!
    $tag: String
    $gitContext: GitContextInput
  ) {
    service(id: $id) {
      validateOperations(
        tag: $tag
        operations: $operations
        gitContext: $gitContext
      ) {
        validationResults {
          type
          code
          description
          operation {
            name
          }
        }
      }
    }
  }
`;
//# sourceMappingURL=validateOperations.js.map