import ts from "typescript";

export function isInterface(type: ts.Type) {
    return type.isClassOrInterface() && !type.isClass();
}