"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REMOVE_SERVICE_AND_COMPOSE = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.REMOVE_SERVICE_AND_COMPOSE = graphql_tag_1.default `
  mutation RemoveServiceAndCompose(
    $id: ID!
    $graphVariant: String!
    $name: String!
  ) {
    service(id: $id) {
      removeImplementingServiceAndTriggerComposition(
        graphVariant: $graphVariant
        name: $name
      ) {
        compositionConfig {
          implementingServiceLocations {
            name
            path
          }
        }
        errors {
          locations {
            column
            line
          }
          message
        }
        updatedGateway
      }
    }
  }
`;
//# sourceMappingURL=removeServiceAndCompose.js.map