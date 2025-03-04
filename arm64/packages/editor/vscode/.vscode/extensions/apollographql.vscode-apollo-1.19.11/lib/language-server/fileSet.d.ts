import URI from "vscode-uri";
export declare class FileSet {
    private rootURI;
    private includes;
    private excludes;
    constructor({ rootURI, includes, excludes, configURI, }: {
        rootURI: URI;
        includes: string[];
        excludes: string[];
        configURI?: URI;
    });
    includesFile(filePath: string): boolean;
    allFiles(): string[];
}
//# sourceMappingURL=fileSet.d.ts.map