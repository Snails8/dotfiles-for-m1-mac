"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLWorkspace = void 0;
const path_1 = require("path");
const glob_1 = __importDefault(require("glob"));
const config_1 = require("./config");
const client_1 = require("./project/client");
const service_1 = require("./project/service");
const vscode_uri_1 = __importDefault(require("vscode-uri"));
const utilities_1 = require("./utilities");
class GraphQLWorkspace {
    constructor(LanguageServerLoadingHandler, config) {
        this.LanguageServerLoadingHandler = LanguageServerLoadingHandler;
        this.config = config;
        this._projectForFileCache = new Map();
        this.projectsByFolderUri = new Map();
    }
    onDiagnostics(handler) {
        this._onDiagnostics = handler;
    }
    onDecorations(handler) {
        this._onDecorations = handler;
    }
    onSchemaTags(handler) {
        this._onSchemaTags = handler;
    }
    onConfigFilesFound(handler) {
        this._onConfigFilesFound = handler;
    }
    createProject({ config, folder, }) {
        const { clientIdentity } = this.config;
        const project = config_1.isClientConfig(config)
            ? new client_1.GraphQLClientProject({
                config,
                loadingHandler: this.LanguageServerLoadingHandler,
                configFolderURI: vscode_uri_1.default.parse(folder.uri),
                clientIdentity,
            })
            : new service_1.GraphQLServiceProject({
                config: config,
                loadingHandler: this.LanguageServerLoadingHandler,
                configFolderURI: vscode_uri_1.default.parse(folder.uri),
                clientIdentity,
            });
        project.onDiagnostics((params) => {
            this._onDiagnostics && this._onDiagnostics(params);
        });
        if (client_1.isClientProject(project)) {
            project.onDecorations((params) => {
                this._onDecorations && this._onDecorations(params);
            });
            project.onSchemaTags((tags) => {
                this._onSchemaTags && this._onSchemaTags(tags);
            });
        }
        project.whenReady.then(() => project.validate());
        return project;
    }
    async addProjectsInFolder(folder) {
        const apolloConfigFiles = glob_1.default.sync("**/apollo.config.@(js|ts|cjs)", {
            cwd: vscode_uri_1.default.parse(folder.uri).fsPath,
            absolute: true,
            ignore: "**/node_modules/**",
        });
        const apolloConfigFolders = new Set(apolloConfigFiles.map(path_1.dirname));
        let foundConfigs = [];
        const projectConfigs = Array.from(apolloConfigFolders).map((configFolder) => config_1.loadConfig({ configPath: configFolder, requireConfig: true })
            .then((config) => {
            if (config) {
                foundConfigs.push(config);
                const projectsForConfig = config.projects.map((projectConfig) => this.createProject({ config, folder }));
                const existingProjects = this.projectsByFolderUri.get(folder.uri) || [];
                this.projectsByFolderUri.set(folder.uri, [
                    ...existingProjects,
                    ...projectsForConfig,
                ]);
            }
            else {
                utilities_1.Debug.error(`Workspace failed to load config from: ${configFolder}/`);
            }
        })
            .catch((error) => utilities_1.Debug.error(error)));
        await Promise.all(projectConfigs);
        if (this._onConfigFilesFound) {
            this._onConfigFilesFound(foundConfigs);
        }
    }
    reloadService() {
        this._projectForFileCache.clear();
        this.projectsByFolderUri.forEach((projects, uri) => {
            this.projectsByFolderUri.set(uri, projects.map((project) => {
                project.clearAllDiagnostics();
                return this.createProject({
                    config: project.config,
                    folder: { uri },
                });
            }));
        });
    }
    async reloadProjectForConfig(configUri) {
        const configPath = path_1.dirname(vscode_uri_1.default.parse(configUri).fsPath);
        let config;
        let error;
        try {
            config = await config_1.loadConfig({ configPath, requireConfig: true });
        }
        catch (e) {
            config = null;
            error = e;
        }
        const project = this.projectForFile(configUri);
        if (!config && this._onConfigFilesFound) {
            this._onConfigFilesFound(error);
        }
        if (project && config) {
            await Promise.all(project.updateConfig(config));
            this.reloadService();
        }
        if (!project && config) {
            const folderUri = vscode_uri_1.default.file(configPath).toString();
            const newProject = this.createProject({
                config,
                folder: { uri: folderUri },
            });
            const existingProjects = this.projectsByFolderUri.get(folderUri) || [];
            this.projectsByFolderUri.set(folderUri, [
                ...existingProjects,
                newProject,
            ]);
            this.reloadService();
        }
    }
    updateSchemaTag(selection) {
        const serviceID = selection.detail;
        if (!serviceID)
            return;
        this.projectsByFolderUri.forEach((projects) => {
            projects.forEach((project) => {
                if (client_1.isClientProject(project) && project.serviceID === serviceID) {
                    project.updateSchemaTag(selection.label);
                }
            });
        });
    }
    removeProjectsInFolder(folder) {
        const projects = this.projectsByFolderUri.get(folder.uri);
        if (projects) {
            projects.forEach((project) => project.clearAllDiagnostics());
            this.projectsByFolderUri.delete(folder.uri);
        }
    }
    get projects() {
        return Array.from(this.projectsByFolderUri.values()).flat();
    }
    projectForFile(uri) {
        const cachedResult = this._projectForFileCache.get(uri);
        if (cachedResult) {
            return cachedResult;
        }
        for (const projects of this.projectsByFolderUri.values()) {
            const project = projects.find((project) => project.includesFile(uri));
            if (project) {
                this._projectForFileCache.set(uri, project);
                return project;
            }
        }
        return undefined;
    }
}
exports.GraphQLWorkspace = GraphQLWorkspace;
//# sourceMappingURL=workspace.js.map