"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var typescript_1 = __importDefault(require("typescript"));
var lodash_1 = __importDefault(require("lodash"));
var fs_1 = __importDefault(require("fs"));
var interface_decorator_1 = require("../interface-decorator");
var filePath = path_1.default.resolve(lodash_1.default.first(process.argv.slice(2)));
var program = typescript_1.default.createProgram([filePath], {});
var checker = program.getTypeChecker();
var source = program.getSourceFile(filePath);
var printer = typescript_1.default.createPrinter();
// Run source file through our transformer
// TODO - make interfaceKeeper in to a class with the tokenEnums field set after transforming
var result = typescript_1.default.transform(source, [interface_decorator_1.interfaceKeeper(checker)]);
var interface_decorator_2 = require("../interface-decorator");
var tokensResult = typescript_1.default.transform(interface_decorator_2.tokensEnum, []);
// Create our output folder
var outputDir = path_1.default.resolve(__dirname, '../generated');
if (!fs_1.default.existsSync(outputDir)) {
    fs_1.default.mkdirSync(outputDir);
}
// Write pretty printed transformed typescript to output directory
fs_1.default.writeFileSync(path_1.default.resolve(__dirname, '../generated/second.output.ts'), printer.printFile(lodash_1.default.first(result.transformed)));
fs_1.default.writeFileSync(path_1.default.resolve(__dirname, '../generated/second.enum.output.ts'), printer.printNode(typescript_1.default.EmitHint.Unspecified, interface_decorator_2.tokensEnum, result.transformed[0]));
//# sourceMappingURL=second.compiler.js.map