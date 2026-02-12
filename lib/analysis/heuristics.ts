import { getFileStatsForCommit } from "../git/history";
import { getAstSignalsForCommit } from "./astDiff";
import * as git from "isomorphic-git";
import fs from "fs";

export type CommitSignals = {
  locAdded: number;
  locRemoved: number;

  functionsDelta: number;
  exportsDelta: number;
  classesDelta: number;
  branchesDelta: number;

  filesChanged: number;
  onlyDocsChanged: boolean;
  structuralAnalysisApplied: boolean;
};

export function classifyCommit(signals: CommitSignals) {
  let score = 0;
  const reasons: string[] = [];

  if (signals.exportsDelta > 0) {
    score += 3;
    reasons.push("Public API changed");
  }

  if (signals.functionsDelta > 0) {
    score += 2;
    reasons.push("New functions introduced");
  }

  if (signals.branchesDelta > 0) {
    score += 1;
    reasons.push("New control flow added");
  }

  if (signals.locAdded + signals.locRemoved > 40) {
    score += 1;
    reasons.push("Large code change");
  }

  if (signals.onlyDocsChanged) {
    score = 0;
    reasons.length = 0;
  }

  return {
    label: score >= 3 ? "major" : "minor",
    score,
    reasons,
  };
}

async function fileExistsAtCommit(
  repoPath: string,
  commitHash: string,
  filePath: string
): Promise<boolean> {
  try {
    await git.readBlob({
      fs,
      dir: repoPath,
      oid: commitHash,
      filepath: filePath,
    });
    return true;
  } catch (err: any) {
    if (err.code === "NotFoundError") return false;
    throw err;
  }
}

export async function computeCommitSignals(repoPath: string, commitHash: string, parentHash: string | null): Promise<CommitSignals> {
  const fileStats = await getFileStatsForCommit(repoPath, commitHash);
  /* o/p of getFileStatsForCommit
    {
      path,
      added: added === "-" ? 0 : Number(added),
      removed: removed === "-" ? 0 : Number(removed),
    };
  */

  // total lines of code added across all files in the commit
  const locAdded = fileStats.reduce((sum, f) => sum + f.added, 0);
  
  // total lines of code removed across all files in the commit
  const locRemoved = fileStats.reduce((sum, f) => sum + f.removed, 0);

  /* example:
    locAdded   = 10 + 3 + 5 = 18
    locRemoved = 2 + 1 + 0 = 3
  */

  const analyzableFiles = fileStats.filter(f =>
    [".js", ".jsx", ".ts", ".tsx"].some(ext => f.path.endsWith(ext))
  );

  let functionsDelta = 0; // how many functions added or removed in the commit
  let exportsDelta = 0; // how many exports added or removed in the commit
  let classesDelta = 0; // how many classes added or removed in the commit
  let branchesDelta = 0; // how many new branches (if statements, loops) added or removed in the commit

  const structuralAnalysisApplied = analyzableFiles.length > 0;

  if (analyzableFiles.length === 0) {
    const onlyDocsChanged = fileStats.every(f =>
      f.path.endsWith(".md") ||
      f.path.toLowerCase().includes("readme")
    );

    return {
      locAdded,
      locRemoved,

      functionsDelta: 0,
      exportsDelta: 0,
      classesDelta: 0,
      branchesDelta: 0,

      filesChanged: fileStats.length,
      onlyDocsChanged,
      structuralAnalysisApplied: false,
    };
  }

  let primaryFile: string | null = null;

  for (const f of analyzableFiles) {
    const existsInCommit = await fileExistsAtCommit(repoPath, commitHash, f.path);
    const existsInParent = parentHash
      ? await fileExistsAtCommit(repoPath, parentHash, f.path)
      : false;

    if (existsInCommit || existsInParent) {
      primaryFile = f.path;
      break;
    }
  }

  if (!primaryFile) {
    // No structurally analyzable file for this commit
    return {
      locAdded,
      locRemoved,
      functionsDelta: 0,
      exportsDelta: 0,
      classesDelta: 0,
      branchesDelta: 0,
      filesChanged: fileStats.length,
      onlyDocsChanged: false,
      structuralAnalysisApplied: false,
    };
  }


  const ast = await getAstSignalsForCommit(repoPath, commitHash, primaryFile, parentHash);

  if (!ast) {
    // Structural analysis not applicable for this commit
    return {
      locAdded,
      locRemoved,
      functionsDelta: 0,
      exportsDelta: 0,
      classesDelta: 0,
      branchesDelta: 0,
      filesChanged: fileStats.length,
      onlyDocsChanged: false,
      structuralAnalysisApplied: false,
    };
  }

  const { before, after } = ast;

  if (before && after) {
    functionsDelta = after.functions - before.functions;
    exportsDelta = after.exports - before.exports;
    classesDelta = after.classes - before.classes;
    branchesDelta = after.branches - before.branches;
  } else if (!before && after) {
    // file created
    functionsDelta = after.functions;
    exportsDelta = after.exports;
    classesDelta = after.classes;
    branchesDelta = after.branches;
  } else if (before && !after) {
    // file deleted
    functionsDelta = -before.functions;
    exportsDelta = -before.exports;
    classesDelta = -before.classes;
    branchesDelta = -before.branches;
  }

  return {
    locAdded,
    locRemoved,

    functionsDelta,
    exportsDelta,
    classesDelta,
    branchesDelta,

    filesChanged: fileStats.length,
    onlyDocsChanged: false,
    structuralAnalysisApplied,
  };
}
