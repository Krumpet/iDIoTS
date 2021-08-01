import ts, { factory, SyntaxKind } from "typescript";
import { isInterface } from '../utils/utils';

const exportModifier = factory.createModifier(SyntaxKind.ExportKeyword);
const importSyringe = factory.createImportDeclaration(
    undefined,
    undefined,
    factory.createImportClause(
        false,
        undefined,
        factory.createNamedImports([factory.createImportSpecifier(
            undefined,
            factory.createIdentifier("inject")
        )])
    ),
    factory.createStringLiteral("tsyringe")
);
// helper to give us Node string type given kind
// const syntaxToKind = (kind: ts.Node["kind"]) => {
//     return ts.SyntaxKind[kind];
// };

// visit each node in the root AST and log its kind
// source?.forEachChild(node => {
//     if (ts.isInterfaceDeclaration(node)) {
//         console.log(syntaxToKind(node.kind))
//     }
// })

// ts.forEachChild(source, node => {
//     console.log(syntaxToKind(node.kind));
// });

export let tokensEnum = ts.factory.createEnumDeclaration(undefined, [exportModifier], 'idiotsTokens', []);
export function interfaceKeeper<T extends ts.Node>(checker: ts.TypeChecker): ts.TransformerFactory<T> {
    return context => {
        const visit: ts.Visitor = node => {
            if (ts.isInterfaceDeclaration(node)
                && node.decorators &&
                node.decorators.filter(
                    decorator => ts.isCallExpression(decorator.expression)
                        && ts.isIdentifier(decorator.expression.expression)
                        && decorator.expression.expression.escapedText === 'Injectable').length > 0) {
                // found interface with decorator, remove decorator
                const newInterfaceDeclaration = ts.factory.updateInterfaceDeclaration(
                    node, // node
                    undefined, // decorators
                    node.modifiers, // modifiers
                    node.name,  // name
                    node.typeParameters,  // type parameters
                    node.heritageClauses, // heritage clauses
                    node.members  // members
                );
                console.log('found interface declaration ' + node.name.escapedText.toString());
                tokensEnum = ts.factory.updateEnumDeclaration(
                    tokensEnum,         // enum
                    undefined,         // decorators
                    tokensEnum.modifiers,   // modifiers
                    tokensEnum.name,          // identifier
                    [...tokensEnum.members, ts.factory.createEnumMember(
                        node.name.escapedText.toString(),
                        ts.factory.createStringLiteral(node.name.escapedText.toString())
                    )]
                );
                return newInterfaceDeclaration;
                // return ts.factory.createClassDeclaration([], [], node.name.text, [], [], []);
            } else
                if (ts.isParameter(node) && ts.isConstructorDeclaration(node.parent)) {
                    // found constructor param
                    console.log('param: ' + node.name.getText() + ' constructor: ' + node.parent.getText());
                    const type = node.type;
                    if (!type) {
                        return node;
                    }
                    const typeAtParamLoc = checker.getTypeAtLocation(node);
                    //         console.log('class? ' + typeAtParamLoc.isClass() + ' class or interface? ' + typeAtParamLoc.isClassOrInterface());
                    if (!isInterface(typeAtParamLoc)) {
                        return node;
                    }
                    const injectionDecorator = ts.factory.createDecorator(ts.factory.createCallExpression(
                        ts.factory.createIdentifier("inject"),
                        undefined,
                        [ts.factory.createStringLiteral(type.getText())]
                    ));
                    return ts.factory.updateParameterDeclaration(
                        node,
                        [...(node.decorators || []), injectionDecorator],
                        node.modifiers,
                        node.dotDotDotToken,
                        node.name,
                        node.questionToken,
                        node.type,
                        node.initializer
                    );
                }
            return ts.visitEachChild(node, child => visit(child), context);
        };

        return node => ts.visitNode(node, visit);
    };
}
