/// <reference types="node" />
import { Agent as HttpAgent } from "http";
import { Agent as HttpsAgent } from "https";
export declare type RequestAgent = HttpAgent | HttpsAgent;
export declare type ReferrerPolicy = "" | "no-referrer" | "no-referrer-when-downgrade" | "same-origin" | "origin" | "strict-origin" | "origin-when-cross-origin" | "strict-origin-when-cross-origin" | "unsafe-url";
export { default as fetch, Request, Response, Headers, ResponseInit, BodyInit, RequestInfo, HeadersInit, Body, RequestInit, RequestMode, RequestCredentials, RequestCache, RequestRedirect, } from "node-fetch";
//# sourceMappingURL=fetch.d.ts.map