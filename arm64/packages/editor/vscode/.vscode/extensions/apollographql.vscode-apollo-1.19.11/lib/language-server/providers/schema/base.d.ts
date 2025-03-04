import { GraphQLSchema } from "graphql";
import { NotificationHandler } from "vscode-languageserver";
export interface SchemaResolveConfig {
    tag?: string;
    force?: boolean;
}
export declare type SchemaChangeUnsubscribeHandler = () => void;
export interface GraphQLSchemaProvider {
    resolveSchema(config?: SchemaResolveConfig): Promise<GraphQLSchema>;
    onSchemaChange(handler: NotificationHandler<GraphQLSchema>): SchemaChangeUnsubscribeHandler;
    resolveFederatedServiceSDL(): Promise<string | void>;
}
//# sourceMappingURL=base.d.ts.map