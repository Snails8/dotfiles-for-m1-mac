"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOAD_SCHEMA = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.UPLOAD_SCHEMA = graphql_tag_1.default `
  mutation UploadSchema(
    $id: ID!
    $schema: IntrospectionSchemaInput!
    $tag: String!
    $gitContext: GitContextInput
  ) {
    service(id: $id) {
      uploadSchema(schema: $schema, tag: $tag, gitContext: $gitContext) {
        code
        message
        success
        tag {
          tag
          schema {
            hash
          }
        }
      }
    }
  }
`;
//# sourceMappingURL=uploadSchema.js.map