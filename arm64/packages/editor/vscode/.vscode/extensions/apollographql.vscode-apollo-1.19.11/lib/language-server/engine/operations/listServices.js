"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LIST_SERVICES = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
exports.LIST_SERVICES = graphql_tag_1.default `
  query ListServices($id: ID!, $graphVariant: String!) {
    frontendUrlRoot
    service(id: $id) {
      implementingServices(graphVariant: $graphVariant) {
        __typename
        ... on FederatedImplementingServices {
          services {
            graphID
            graphVariant
            name
            url
            updatedAt
          }
        }
      }
    }
  }
`;
//# sourceMappingURL=listServices.js.map