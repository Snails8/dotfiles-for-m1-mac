import { NotificationHandler } from "vscode-languageserver";
import { GraphQLSchema } from "graphql";
import { ClientIdentity } from "../../engine";
import { ClientConfig } from "../../config";
import { GraphQLSchemaProvider, SchemaChangeUnsubscribeHandler, SchemaResolveConfig } from "./base";
export declare class EngineSchemaProvider implements GraphQLSchemaProvider {
    private config;
    private clientIdentity?;
    private schema?;
    private client?;
    constructor(config: ClientConfig, clientIdentity?: ClientIdentity | undefined);
    resolveSchema(override: SchemaResolveConfig): Promise<GraphQLSchema>;
    onSchemaChange(_handler: NotificationHandler<GraphQLSchema>): SchemaChangeUnsubscribeHandler;
    resolveFederatedServiceSDL(): Promise<void>;
}
export declare const SCHEMA_QUERY: import("graphql").DocumentNode;
//# sourceMappingURL=engine.d.ts.map