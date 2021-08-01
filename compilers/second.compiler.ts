import path from 'path';
import ts from 'typescript';
import _ from 'lodash';
import fs from 'fs';
import { interfaceKeeper } from '../transformers/interface-decorator';
import { transformer } from '../transformers/file.transformer'

const filePath = path.resolve(_.first(process.argv.slice(2))!);

const program = ts.createProgram([filePath], {});
const checker = program.getTypeChecker();
const source = program.getSourceFile(filePath);
const printer = ts.createPrinter();

// Run source file through our transformer
// TODO - make interfaceKeeper in to a class with the tokenEnums field set after transforming
const result = ts.transform(source!, [transformer(program)]);

import { tokensEnum } from '../transformers/interface-decorator';
const tokensResult = ts.transform(tokensEnum, []);

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

fs.writeFileSync(
  path.resolve(__dirname, '../generated/second.enum.output.ts'),
  printer.printNode(ts.EmitHint.Unspecified, tokensEnum, result.transformed[0])
);