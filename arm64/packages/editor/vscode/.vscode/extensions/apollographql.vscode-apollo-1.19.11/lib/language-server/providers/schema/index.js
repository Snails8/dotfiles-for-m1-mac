"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaProviderFromConfig = void 0;
const config_1 = require("../../config");
const endpoint_1 = require("./endpoint");
const engine_1 = require("./engine");
const file_1 = require("./file");
function schemaProviderFromConfig(config, clientIdentity) {
    if (config.service && config.service.localSchemaFile) {
        const isListOfSchemaFiles = Array.isArray(config.service.localSchemaFile);
        return new file_1.FileSchemaProvider(isListOfSchemaFiles
            ? { paths: config.service.localSchemaFile }
            : { path: config.service.localSchemaFile });
    }
    if (config.service && config.service.endpoint) {
        return new endpoint_1.EndpointSchemaProvider(config.service.endpoint);
    }
    if (config_1.isClientConfig(config)) {
        if (typeof config.client.service === "string") {
            return new engine_1.EngineSchemaProvider(config, clientIdentity);
        }
        if (config.client.service) {
            if (config_1.isLocalServiceConfig(config.client.service)) {
                const isListOfSchemaFiles = Array.isArray(config.client.service.localSchemaFile);
                return new file_1.FileSchemaProvider(isListOfSchemaFiles
                    ? { paths: config.client.service.localSchemaFile }
                    : {
                        path: config.client.service.localSchemaFile,
                    });
            }
            return new endpoint_1.EndpointSchemaProvider(config.client.service);
        }
    }
    if (config.graph && config.engine) {
        return new engine_1.EngineSchemaProvider(config, clientIdentity);
    }
    throw new Error("No schema provider was created, because the project type was unable to be resolved from your config. Please add either a client or service config. For more information, please refer to https://go.apollo.dev/t/config");
}
exports.schemaProviderFromConfig = schemaProviderFromConfig;
//# sourceMappingURL=index.js.map