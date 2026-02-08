import { getFileStatsForCommit } from "../git/history";
import { getAstSignalsForCommit } from "./astDiff";

export type CommitSignals = {
  locAdded: number;
  locRemoved: number;

  functionsDelta: number;
  exportsDelta: number;
  classesDelta: number;
  branchesDelta: number;

  filesChanged: number;
  onlyDocsChanged: boolean;
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

export async function computeCommitSignals(repoPath: string, commitHash: string): Promise<CommitSignals> {
  const fileStats = await getFileStatsForCommit(repoPath, commitHash);

  const locAdded = fileStats.reduce((sum, f) => sum + f.added, 0);
  const locRemoved = fileStats.reduce((sum, f) => sum + f.removed, 0);

  // assume single JS file for now
  const jsFile = fileStats.find(f => f.path.endsWith(".ts"));
  console.log("jsFile:", jsFile);

  let functionsDelta = 0;
  let exportsDelta = 0;
  let classesDelta = 0;
  let branchesDelta = 0;

  if (jsFile) {
    const ast = await getAstSignalsForCommit(
      repoPath,
      commitHash,
      jsFile.path
    );

    const before = ast.before;
    const after = ast.after;

    if (before && after) {
      functionsDelta = after.functions - before.functions;
      exportsDelta = after.exports - before.exports;
      classesDelta = after.classes - before.classes;
      branchesDelta = after.branches - before.branches;
    }

    // file created or deleted
    if (!before && after) {
      functionsDelta = after.functions;
      exportsDelta = after.exports;
      classesDelta = after.classes;
      branchesDelta = after.branches;
    }

    if (before && !after) {
      functionsDelta = -before.functions;
      exportsDelta = -before.exports;
      classesDelta = -before.classes;
      branchesDelta = -before.branches;
    }
  }

  const onlyDocsChanged =
    !jsFile &&
    fileStats.every(f =>
      f.path.endsWith(".md") || f.path.toLowerCase().includes("readme")
    );

  return {
    locAdded,
    locRemoved,

    functionsDelta,
    exportsDelta,
    classesDelta,
    branchesDelta,

    filesChanged: fileStats.length,
    onlyDocsChanged,
  };
}
