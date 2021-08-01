"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interfaceKeeper = exports.tokensEnum = void 0;
var typescript_1 = __importStar(require("typescript"));
var exportModifier = typescript_1.default.factory.createModifier(typescript_1.SyntaxKind.ExportKeyword);
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
exports.tokensEnum = typescript_1.default.factory.createEnumDeclaration(undefined, [exportModifier], 'idiotsTokens', []);
function interfaceKeeper(checker) {
    return function (context) {
        var visit = function (node) {
            if (typescript_1.default.isInterfaceDeclaration(node)
                && node.decorators &&
                node.decorators.filter(function (decorator) { return typescript_1.default.isCallExpression(decorator.expression)
                    && typescript_1.default.isIdentifier(decorator.expression.expression)
                    && decorator.expression.expression.escapedText === 'Injectable'; }).length > 0) {
                var newInterfaceDeclaration = typescript_1.default.factory.updateInterfaceDeclaration(node, // node
                undefined, // decorators
                node.modifiers, // modifiers
                node.name, // name
                node.typeParameters, // type parameters
                node.heritageClauses, // heritage clauses
                node.members // members
                );
                console.log('found interface declaration ' + node.name.escapedText.toString());
                exports.tokensEnum = typescript_1.default.factory.updateEnumDeclaration(exports.tokensEnum, // enum
                undefined, // decorators
                exports.tokensEnum.modifiers, // modifiers
                exports.tokensEnum.name, __spreadArray(__spreadArray([], exports.tokensEnum.members), [typescript_1.default.factory.createEnumMember(node.name.escapedText.toString(), typescript_1.default.factory.createStringLiteral(node.name.escapedText.toString()))]));
                return newInterfaceDeclaration;
                // return ts.factory.createClassDeclaration([], [], node.name.text, [], [], []);
            }
            else if (typescript_1.default.isParameter(node) && typescript_1.default.isConstructorDeclaration(node.parent)) {
                console.log('param: ' + node.name.getText() + ' constructor: ' + node.parent.getText());
                var type = node.type;
                if (!type) {
                    return node;
                }
                var typeAtParamLoc = checker.getTypeAtLocation(node);
                //         console.log('class? ' + typeAtParamLoc.isClass() + ' class or interface? ' + typeAtParamLoc.isClassOrInterface());
                if (!isInterface(typeAtParamLoc)) {
                    return node;
                }
                var injectionDecorator = typescript_1.default.factory.createDecorator(typescript_1.default.factory.createCallExpression(typescript_1.default.factory.createIdentifier("inject"), undefined, [typescript_1.default.factory.createStringLiteral(type.getText())]));
                return typescript_1.default.factory.updateParameterDeclaration(node, __spreadArray(__spreadArray([], (node.decorators || [])), [injectionDecorator]), node.modifiers, node.dotDotDotToken, node.name, node.questionToken, node.type, node.initializer);
            }
            return typescript_1.default.visitEachChild(node, function (child) { return visit(child); }, context);
        };
        return function (node) { return typescript_1.default.visitNode(node, visit); };
    };
}
exports.interfaceKeeper = interfaceKeeper;
function isInterface(type) {
    return type.isClassOrInterface() && !type.isClass();
}
//# sourceMappingURL=interface-decorator.js.map