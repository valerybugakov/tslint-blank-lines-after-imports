import { IRuleMetadata, Replacement, Rules, AbstractWalker } from 'tslint';

import ts from 'typescript';

export class Rule extends Rules.AbstractRule {
  public static metadata: IRuleMetadata = {
    ruleName: 'blank-lines-after-imports',
    description: 'Helps to keep blank lines after import statements.',
    options: {
      type: 'number',
    },
    optionsDescription: 'Number of blank lines after imports.',
    type: 'formatting',
    typescriptOnly: false,
    hasFix: false,
  };

  apply(sourceFile: ts.SourceFile) {
    const [blankLinesAfterImport = 1] = this.ruleArguments;

    return this.applyWithWalker(
      new Walker(sourceFile, this.ruleName, {
        blankLinesAfterImport,
      })
    );
  }
}

class Walker extends AbstractWalker<{ blankLinesAfterImport: number }> {
  walk(sourceFile: ts.SourceFile) {
    const importStatements = sourceFile.statements.filter(statement => {
      return ts.isImportDeclaration(statement);
    });

    const lastImportStatement = importStatements[importStatements.length - 1];
    this.checkLastImport(lastImportStatement as ts.ImportDeclaration);
  }

  checkLastImport(node: ts.ImportDeclaration) {
    const { blankLinesAfterImport } = this.options;

    const { parent } = node;
    const nodePosition = parent.statements.indexOf(node);
    const nextNode = parent.statements[nodePosition + 1];

    if (nextNode) {
      this.checkForNewLine(node, nextNode, blankLinesAfterImport);
    }
  }

  checkForNewLine(
    node: ts.Node,
    nextNode: ts.Node,
    blankLinesAfterImport: number
  ) {
    const lineDifference = this.getLineDifference(node, nextNode);
    const expectedLineDifference = blankLinesAfterImport + 1;

    if (lineDifference < expectedLineDifference) {
      const suffix = blankLinesAfterImport > 1 ? 's' : '';
      const message = `Expected ${blankLinesAfterImport} blank line${suffix} after the last import statement`;

      const fix = new Replacement(node.getStart() + node.getWidth(), 0, '\n');

      this.addFailureAt(node.getStart(), node.getWidth(), message, fix);
    }
  }

  getLineDifference(node: ts.Node, nextNode: ts.Node) {
    const startNode = nextNode.getFirstToken() || nextNode;
    const endNode = node.getLastToken() || node;

    return this.getNodeLine(startNode) - this.getNodeLine(endNode);
  }

  getNodeLine(node: ts.Node) {
    const sourceFile = this.getSourceFile();
    const lastToken = node.getLastToken();
    const start = (lastToken || node).getStart(sourceFile);

    return ts.getLineAndCharacterOfPosition(sourceFile, start).line;
  }
}
