import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as git from 'isomorphic-git';
import fs from 'fs';
import { BABEL_PARSER_CONFIG } from './parserConfig';

type AstSignal = {
  functions: number;
  exports: number;
  classes: number;
  branches: number;
};

export async function getAstSignalsForCommit(repoPath: string, commitHash: string, filePath: string, parentHash: string | null) {
  // repoPath is the path to the git repository in our project's .repos directory
  // commitHash is the hash of the commit we want to analyze
  // filePath is the path to the file within the repository we want to analyze (e.g. "src/mockingcase.js")
  const before = parentHash
    ? await getFileAtCommit(repoPath, parentHash, filePath)
    : null;
  // commitHash  -> the commit itself
  // commitHash^ -> its immediate parent (one step before)

  const after = await getFileAtCommit(
    repoPath,
    commitHash,
    filePath
  );

  return {
    before: before ? extractAstSignals(before) : null,
    after: after ? extractAstSignals(after) : null,
  };
}

export function extractAstSignals(code: string): AstSignal {
    try {
      const ast = parse(code, BABEL_PARSER_CONFIG as any); // it takes source code as a string and converts it into an Abstract Syntax Tree (AST).
  
      const signal: AstSignal = {
        functions: 0,
        exports: 0,
        classes: 0,
        branches: 0,
      };
  
      traverse(ast, {
        FunctionDeclaration() {
          signal.functions++;
        },
        ExportNamedDeclaration() {
          signal.exports++;
        },
        ExportDefaultDeclaration() {
          signal.exports++;
        },
        ClassDeclaration() {
          signal.classes++;
        },
        IfStatement() {
          signal.branches++;
        },
        SwitchStatement() {
          signal.branches++;
        }
      });
  
      return signal;
    } catch {
      return {
        functions: 0,
        exports: 0,
        classes: 0,
        branches: 0,
      };
    }
}

async function getFileAtCommit(repoPath: string, commitHash: string, filePath: string): Promise<string | null> {
  console.log(repoPath, commitHash, filePath);
  const { blob } = await git.readBlob({
    fs,
    dir: repoPath,
    oid: commitHash,
    filepath: filePath
  });

  try {
    // git show <commitHash>:file.js
    // const content = await git.raw([
    //   "show",
    //   `${commitHash}:${filePath}`,
    // ]);
    return Buffer.from(blob).toString("utf8");
  } catch {
    // file did not exist at this commit
    return null;
  }
}