"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounceHandler = void 0;
const lodash_debounce_1 = __importDefault(require("lodash.debounce"));
function debounceHandler(handler, leading = true) {
    return lodash_debounce_1.default(handler, 250, { leading });
}
exports.debounceHandler = debounceHandler;
//# sourceMappingURL=debouncer.js.map