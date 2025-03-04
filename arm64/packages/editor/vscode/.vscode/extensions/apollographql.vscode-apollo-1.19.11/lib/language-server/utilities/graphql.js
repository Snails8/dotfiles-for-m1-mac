"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasClientDirective = exports.simpleCollectFields = exports.withTypenameFieldAddedWhereNeeded = exports.removeDirectiveAnnotatedFields = exports.removeDirectives = exports.getFieldDef = exports.highlightNodeForNode = exports.isDirectiveDefinitionNode = exports.isNamedNode = exports.isNode = void 0;
const graphql_1 = require("graphql");
function isNode(maybeNode) {
    return maybeNode && typeof maybeNode.kind === "string";
}
exports.isNode = isNode;
function isNamedNode(node) {
    return "name" in node;
}
exports.isNamedNode = isNamedNode;
function isDirectiveDefinitionNode(node) {
    return node.kind === graphql_1.Kind.DIRECTIVE_DEFINITION;
}
exports.isDirectiveDefinitionNode = isDirectiveDefinitionNode;
function highlightNodeForNode(node) {
    switch (node.kind) {
        case graphql_1.Kind.VARIABLE_DEFINITION:
            return node.variable;
        default:
            return isNamedNode(node) ? node.name : node;
    }
}
exports.highlightNodeForNode = highlightNodeForNode;
function getFieldDef(schema, parentType, fieldAST) {
    const name = fieldAST.name.value;
    if (name === graphql_1.SchemaMetaFieldDef.name &&
        schema.getQueryType() === parentType) {
        return graphql_1.SchemaMetaFieldDef;
    }
    if (name === graphql_1.TypeMetaFieldDef.name && schema.getQueryType() === parentType) {
        return graphql_1.TypeMetaFieldDef;
    }
    if (name === graphql_1.TypeNameMetaFieldDef.name &&
        (graphql_1.isObjectType(parentType) ||
            graphql_1.isInterfaceType(parentType) ||
            graphql_1.isUnionType(parentType))) {
        return graphql_1.TypeNameMetaFieldDef;
    }
    if (graphql_1.isObjectType(parentType) || graphql_1.isInterfaceType(parentType)) {
        return parentType.getFields()[name];
    }
    return undefined;
}
exports.getFieldDef = getFieldDef;
function removeDirectives(ast, directiveNames) {
    if (!directiveNames.length)
        return ast;
    return graphql_1.visit(ast, {
        Directive(node) {
            if (!!directiveNames.find((name) => name === node.name.value))
                return null;
            return node;
        },
    });
}
exports.removeDirectives = removeDirectives;
function removeOrphanedFragmentDefinitions(ast, fragmentNamesEligibleForRemoval) {
    let anyFragmentsRemoved = false;
    const fragmentSpreadNodeNames = new Set();
    graphql_1.visit(ast, {
        FragmentSpread(node) {
            fragmentSpreadNodeNames.add(node.name.value);
        },
    });
    ast = graphql_1.visit(ast, {
        FragmentDefinition(node) {
            if (fragmentNamesEligibleForRemoval.has(node.name.value) &&
                !fragmentSpreadNodeNames.has(node.name.value)) {
                anyFragmentsRemoved = true;
                return null;
            }
            return undefined;
        },
    });
    if (anyFragmentsRemoved) {
        return removeOrphanedFragmentDefinitions(ast, fragmentNamesEligibleForRemoval);
    }
    return ast;
}
function removeNodesWithEmptySelectionSets(ast) {
    ast = graphql_1.visit(ast, {
        enter(node) {
            return "selectionSet" in node &&
                node.selectionSet != null &&
                node.selectionSet.selections.length === 0
                ? null
                : undefined;
        },
    });
    return ast;
}
function removeDirectiveAnnotatedFields(ast, directiveNames) {
    graphql_1.print;
    if (!directiveNames.length)
        return ast;
    const removedFragmentDefinitionNames = new Set();
    const removedFragmentSpreadNames = new Set();
    ast = graphql_1.visit(ast, {
        enter(node) {
            if ("directives" in node &&
                node.directives &&
                node.directives.find((directive) => directiveNames.includes(directive.name.value))) {
                if (node.kind === graphql_1.Kind.FRAGMENT_DEFINITION) {
                    removedFragmentDefinitionNames.add(node.name.value);
                }
                graphql_1.visit(node, {
                    FragmentSpread(node) {
                        removedFragmentSpreadNames.add(node.name.value);
                    },
                });
                return null;
            }
            return undefined;
        },
    });
    ast = graphql_1.visit(ast, {
        FragmentSpread(node) {
            if (removedFragmentDefinitionNames.has(node.name.value)) {
                removedFragmentSpreadNames.add(node.name.value);
                return null;
            }
            return undefined;
        },
    });
    ast = removeOrphanedFragmentDefinitions(ast, removedFragmentSpreadNames);
    return removeNodesWithEmptySelectionSets(ast);
}
exports.removeDirectiveAnnotatedFields = removeDirectiveAnnotatedFields;
const typenameField = {
    kind: graphql_1.Kind.FIELD,
    name: { kind: graphql_1.Kind.NAME, value: "__typename" },
};
function withTypenameFieldAddedWhereNeeded(ast) {
    return graphql_1.visit(ast, {
        enter: {
            SelectionSet(node) {
                return Object.assign(Object.assign({}, node), { selections: node.selections.filter((selection) => !(selection.kind === "Field" &&
                        selection.name.value === "__typename")) });
            },
        },
        leave(node) {
            if (!(node.kind === graphql_1.Kind.FIELD ||
                node.kind === graphql_1.Kind.FRAGMENT_DEFINITION ||
                node.kind === graphql_1.Kind.INLINE_FRAGMENT)) {
                return undefined;
            }
            if (!node.selectionSet)
                return undefined;
            return Object.assign(Object.assign({}, node), { selectionSet: Object.assign(Object.assign({}, node.selectionSet), { selections: [typenameField, ...node.selectionSet.selections] }) });
        },
    });
}
exports.withTypenameFieldAddedWhereNeeded = withTypenameFieldAddedWhereNeeded;
function getFieldEntryKey(node) {
    return node.alias ? node.alias.value : node.name.value;
}
function simpleCollectFields(context, selectionSet, fields, visitedFragmentNames) {
    for (const selection of selectionSet.selections) {
        switch (selection.kind) {
            case graphql_1.Kind.FIELD: {
                const name = getFieldEntryKey(selection);
                if (!fields[name]) {
                    fields[name] = [];
                }
                fields[name].push(selection);
                break;
            }
            case graphql_1.Kind.INLINE_FRAGMENT: {
                simpleCollectFields(context, selection.selectionSet, fields, visitedFragmentNames);
                break;
            }
            case graphql_1.Kind.FRAGMENT_SPREAD: {
                const fragName = selection.name.value;
                if (visitedFragmentNames[fragName])
                    continue;
                visitedFragmentNames[fragName] = true;
                const fragment = context.fragments[fragName];
                if (!fragment)
                    continue;
                simpleCollectFields(context, fragment.selectionSet, fields, visitedFragmentNames);
                break;
            }
        }
    }
    return fields;
}
exports.simpleCollectFields = simpleCollectFields;
function hasClientDirective(node) {
    return (node.directives &&
        node.directives.some((directive) => directive.name.value === "client"));
}
exports.hasClientDirective = hasClientDirective;
//# sourceMappingURL=graphql.js.map