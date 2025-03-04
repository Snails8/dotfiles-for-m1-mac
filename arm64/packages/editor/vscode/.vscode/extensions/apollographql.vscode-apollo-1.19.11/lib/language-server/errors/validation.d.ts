import { FieldNode, ValidationContext, GraphQLSchema, DocumentNode, OperationDefinitionNode, FragmentDefinitionNode, InlineFragmentNode } from "graphql";
import { TextEdit } from "vscode-languageserver";
import { ValidationRule } from "graphql/validation/ValidationContext";
export interface CodeActionInfo {
    message: string;
    edits: TextEdit[];
}
export declare const defaultValidationRules: ValidationRule[];
export declare function getValidationErrors(schema: GraphQLSchema, document: DocumentNode, fragments?: {
    [fragmentName: string]: FragmentDefinitionNode;
}, rules?: ValidationRule[]): any;
export declare function validateQueryDocument(schema: GraphQLSchema, document: DocumentNode): void;
export declare function NoAnonymousQueries(context: ValidationContext): {
    OperationDefinition(node: OperationDefinitionNode): boolean;
};
export declare function NoTypenameAlias(context: ValidationContext): {
    Field(node: FieldNode): void;
};
export declare function NoMissingClientDirectives(context: ValidationContext): {
    InlineFragment?: undefined;
    FragmentDefinition?: undefined;
    Field?: undefined;
} | {
    InlineFragment: (node: FieldNode | InlineFragmentNode | FragmentDefinitionNode) => false | undefined;
    FragmentDefinition: (node: FieldNode | InlineFragmentNode | FragmentDefinitionNode) => false | undefined;
    Field: (node: FieldNode | InlineFragmentNode | FragmentDefinitionNode) => false | undefined;
};
//# sourceMappingURL=validation.d.ts.map