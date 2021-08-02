import {
    TransformationContext,
    SourceFile, Node, VisitResult, Visitor,
    visitNode, visitEachChild, Transformer, Program, factory, isCallExpression, isConstructorDeclaration, isIdentifier, isInterfaceDeclaration, isParameter, SyntaxKind, updateSourceFile, updateSourceFileNode, TypeChecker
} from 'typescript'
import { isInterface } from '../utils/utils';

// interface TypeScriptTransform {
//     (ctx: TransformationContext): Transformer<SourceFile>;
// }

// function sampleTransformer(ctx: TransformationContext) {
//     return (sf: SourceFile) => visitNode(sf, visitor(ctx, sf, opts))
// }

function visit(ctx: TransformationContext, sf: SourceFile) {
    const visitor: Visitor = (node: Node): VisitResult<Node> => {
        // here we can check each node and potentially return 
        // new nodes if we want to leave the node as is, and 
        // continue searching through child nodes:
        return visitEachChild(node, visitor, ctx);
    };
    return visitor;
}

export default function () {
    return (ctx: TransformationContext): Transformer<SourceFile> => {
        return (sf: SourceFile) => visitNode(sf, visit(ctx, sf))
    }
}
// TODO: move all of these to a separate file
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
// export let tokensEnum = factory.createEnumDeclaration(undefined, [exportModifier], 'idiotsTokens', []);
export function transformer(typeChecker: TypeChecker/* program: Program */, /* opts?: TransformerOptions */) {
    function visitor(context: TransformationContext, sf: SourceFile, result: { addedDecorator: boolean }) {
        // const typeChecker = program.getTypeChecker();

        const visitor: Visitor = (node: Node) => {

            // if (isInterfaceDeclaration(node)
            //     && node.decorators &&
            //     node.decorators.filter(
            //         decorator => isCallExpression(decorator.expression)
            //             && isIdentifier(decorator.expression.expression)
            //             && decorator.expression.expression.escapedText === 'Injectable').length > 0) {
            //     // found interface with decorator, remove decorator
            //     const newInterfaceDeclaration = factory.updateInterfaceDeclaration(
            //         node, // node
            //         undefined, // decorators
            //         node.modifiers, // modifiers
            //         node.name,  // name
            //         node.typeParameters,  // type parameters
            //         node.heritageClauses, // heritage clauses
            //         node.members  // members
            //     );
            //     console.log('found interface declaration ' + node.name.escapedText.toString());
            //     tokensEnum = factory.updateEnumDeclaration(
            //         tokensEnum,         // enum
            //         undefined,         // decorators
            //         tokensEnum.modifiers,   // modifiers
            //         tokensEnum.name,          // identifier
            //         [...tokensEnum.members, factory.createEnumMember(
            //             node.name.escapedText.toString(),
            //             factory.createStringLiteral(node.name.escapedText.toString())
            //         )]
            //     );
            //     return newInterfaceDeclaration;
            //     // return factory.createClassDeclaration([], [], node.name.text, [], [], []);
            // } else
            if (isParameter(node) && isConstructorDeclaration(node.parent)) {
                // found constructor param
                // console.log('param: ' + node.name.getText() + ' constructor: ' + node.parent.getText());
                const type = node.type;
                if (!type) {
                    return node;
                }
                const typeAtParamLoc = typeChecker.getTypeAtLocation(node);
                // console.log('class? ' + typeAtParamLoc.isClass() + ' class or interface? ' + typeAtParamLoc.isClassOrInterface());
                if (!isInterface(typeAtParamLoc)) {
                    return node;
                }
                const injectionDecorator = factory.createDecorator(factory.createCallExpression(
                    factory.createIdentifier("inject"),
                    undefined,
                    [factory.createStringLiteral(type.getText())]
                ));
                result.addedDecorator = true;
                return factory.updateParameterDeclaration(
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
            return visitEachChild(node, visitor, context);

        };

        return visitor;
    }

    return (ctx: TransformationContext) => {
        return (sf: SourceFile) => {
            const result = { addedDecorator: false };
            const newSf = visitNode(sf, visitor(ctx, sf, result));
            if (result.addedDecorator) {
                return factory.updateSourceFile(newSf, [importSyringe, ...newSf.statements])
            }
            return newSf;
        }
    };
}