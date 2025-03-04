import { GraphQLProject } from "./base";
import { LoadingHandler } from "../loadingHandler";
import { ServiceConfig } from "../config";
import { ClientIdentity } from "../engine";
import URI from "vscode-uri";
export declare function isServiceProject(project: GraphQLProject): project is GraphQLServiceProject;
export interface GraphQLServiceProjectConfig {
    clientIdentity?: ClientIdentity;
    config: ServiceConfig;
    configFolderURI: URI;
    loadingHandler: LoadingHandler;
}
export declare class GraphQLServiceProject extends GraphQLProject {
    constructor({ clientIdentity, config, configFolderURI, loadingHandler, }: GraphQLServiceProjectConfig);
    get displayName(): string;
    initialize(): never[];
    validate(): void;
    getProjectStats(): {
        loaded: boolean;
        type: string;
    };
    resolveFederationInfo(): Promise<string | void>;
}
//# sourceMappingURL=service.d.ts.map