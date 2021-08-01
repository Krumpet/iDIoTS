// import * as ts from "typescript"
// import { interfaceKeeper } from "../interface-decorator"

// // hardcode our input file
// const filePath = "./code-samples/sampleCode.ts";

// // create a program instance, which is a collection of source files
// // in this case we only have one source file
// const program = ts.createProgram([filePath], {});

// // pull off the typechecker instance from our program
// const checker = program.getTypeChecker();

// // get our models.ts source file AST
// const source = program.getSourceFile(filePath);

// // create TS printer instance which gives us utilities to pretty print our final AST
// const printer = ts.createPrinter();


// let result = ts.transpileModule(source?.text!, {
//     compilerOptions: { module: ts.ModuleKind.CommonJS },
//     transformers: { before: [interfaceKeeper(null)] }
// });

// ts.createProgram({ rootNames: [], options: {} }).emit()

// console.log(result.outputText);