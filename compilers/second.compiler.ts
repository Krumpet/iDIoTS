import path from 'path';
import ts, { factory, NodeFlags, SyntaxKind } from 'typescript';
import _ from 'lodash';
import fs from 'fs';
import { interfaceKeeper } from '../transformers/interface-decorator';
import { transformer } from '../transformers/file.transformer'
// TODO - extend to multiple source files
const filePath = path.resolve(_.first(process.argv.slice(2))!);

const program = ts.createProgram([filePath], {});
const source = program.getSourceFile(filePath)!;
const printer = ts.createPrinter();
const typeChecker = program.getTypeChecker();

const exportModifier = factory.createModifier(SyntaxKind.ExportKeyword);
const interfaceNames = collectInterfaces(source);
const interfaceNamesEnum = factory.createEnumDeclaration(undefined, [exportModifier], 'idiotsTokens',
  interfaceNames.map(interfaceName =>
    factory.createEnumMember(interfaceName, factory.createStringLiteral(interfaceName))));
const enumFile = factory.createSourceFile([interfaceNamesEnum], factory.createToken(SyntaxKind.EndOfFileToken), NodeFlags.None);
// enumFile.fileName = 'enumstuff.ts';
// printer.printFile(enumFile);
// fs.writeFileSync(
//   path.resolve(__dirname, '../generated/second.enum.output.ts'),
//   printer.printNode(ts.EmitHint.Unspecified, interfaceNamesEnum, result.transformed[0])
// );
// console.log(names);

// TODO - extract to function
fs.writeFileSync(
  path.resolve(__dirname, '../generated/enum.ts'),
  printer.printFile(enumFile)
);

function collectInterfaces(node: ts.Node) {
  function collectInterfacesRecursive(node: ts.Node, interfaceNames: string[]) {
    if (ts.isInterfaceDeclaration(node)) {
      const symbol = typeChecker.getSymbolAtLocation(node.name);
      const tags = symbol?.getJsDocTags() || [];
      // console.log(tags);
      // TODO - extract to constant
      if (tags.filter(tag => tag.name === 'retain').length) {
        interfaceNames.push(node.name.text);
      }
    }
    node.forEachChild(child => collectInterfacesRecursive(child, interfaceNames));
  }
  const interfaceNames: string[] = [];
  collectInterfacesRecursive(node, interfaceNames);
  return interfaceNames;
}

// Run source file through our transformer
// TODO - make interfaceKeeper in to a class with the tokenEnums field set after transforming
const result = ts.transform(source!, [transformer(typeChecker)]);

// import { tokensEnum } from '../transformers/interface-decorator';
// const tokensResult = ts.transform(tokensEnum, []);

// TODO - expand to multiple files
// Create our output folder
const outputDir = path.resolve(__dirname, '../generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Write pretty printed transformed typescript to output directory
fs.writeFileSync(
  path.resolve(__dirname, '../generated/second.output.ts'),
  printer.printFile(_.first(result.transformed)!)
);
