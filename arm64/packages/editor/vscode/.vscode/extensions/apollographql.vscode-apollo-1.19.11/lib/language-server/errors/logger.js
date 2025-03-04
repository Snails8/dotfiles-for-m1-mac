"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logErrorMessage = exports.logError = exports.ToolError = void 0;
const graphql_1 = require("graphql");
const path_1 = __importDefault(require("path"));
class ToolError extends Error {
    constructor(message) {
        super(message);
        this.name = "ToolError";
        this.message = message;
    }
}
exports.ToolError = ToolError;
const isRunningFromXcodeScript = process.env.XCODE_VERSION_ACTUAL;
function logError(error) {
    if (error instanceof ToolError) {
        logErrorMessage(error.message);
    }
    else if (error instanceof graphql_1.GraphQLError) {
        const fileName = error.source && error.source.name;
        if (error.locations) {
            for (const location of error.locations) {
                logErrorMessage(error.message, fileName, location.line);
            }
        }
        else {
            logErrorMessage(error.message, fileName);
        }
    }
    else {
        console.error(error.stack);
    }
}
exports.logError = logError;
function logErrorMessage(message, fileName, lineNumber) {
    if (isRunningFromXcodeScript) {
        if (fileName && lineNumber) {
            console.error(`${fileName}:${lineNumber}: error: ${message}`);
        }
        else {
            console.error(`error: ${message}`);
        }
    }
    else {
        if (fileName) {
            const truncatedFileName = "/" + fileName.split(path_1.default.sep).slice(-4).join(path_1.default.sep);
            console.error(`...${truncatedFileName}: ${message}`);
        }
        else {
            console.error(`error: ${message}`);
        }
    }
}
exports.logErrorMessage = logErrorMessage;
//# sourceMappingURL=logger.js.map