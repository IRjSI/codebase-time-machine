import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { simpleGit } from "simple-git";

type AstSignal = {
  functions: number;
  exports: number;
  classes: number;
  branches: number;
};

export async function getAstSignalsForCommit(repoPath: string, commitHash: string, filePath: string) {
  // repoPath is the path to the git repository in our project's .repos directory
  // commitHash is the hash of the commit we want to analyze
  // filePath is the path to the file within the repository we want to analyze (e.g. "src/mockingcase.js")
  const before = await getFileAtCommit(
    repoPath,
    `${commitHash}^`,
    filePath
  );
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
    const ast = parse(code, {
      sourceType: 'module',
      plugins: [
        'typescript',
      ],
    });

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
}

async function getFileAtCommit(repoPath: string, commitHash: string, filePath: string): Promise<string | null> {
  const git = simpleGit(repoPath);

  try {
    // git show <commitHash>:file.js
    const content = await git.raw([
      "show",
      `${commitHash}:${filePath}`,
    ]);
    return content;
  } catch {
    // file did not exist at this commit
    return null;
  }
}