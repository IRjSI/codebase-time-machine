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

  const analyzableFiles = fileStats.filter(f =>
    [".js", ".jsx", ".ts", ".tsx"].some(ext => f.path.endsWith(ext))
  );

  let functionsDelta = 0;
  let exportsDelta = 0;
  let classesDelta = 0;
  let branchesDelta = 0;

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
    };
  }

  const primaryFile = analyzableFiles[0];

  const ast = await getAstSignalsForCommit(
    repoPath,
    commitHash,
    primaryFile.path
  );

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
  };
}
