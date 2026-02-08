import { classifyCommit, computeCommitSignals } from "@/lib/analysis/heuristics";
import { getAstSignalsForCommit } from "../lib/analysis/astDiff";
import path from "path";

async function testAst() {
  const repoPath = path.join(process.cwd(), ".repos", "mockingcase");

  // pick a commit where mockingcase.js changed
  const commitHash = "979ce64";
  const filePath = "src/mockingcase.js";

  const signals = await getAstSignalsForCommit(
    repoPath,
    commitHash,
    filePath
  );

  console.log("AST signals:");
  console.dir(signals, { depth: null });

  const commitSignals = await computeCommitSignals(repoPath, commitHash)
  const result = classifyCommit(commitSignals)

  console.log("Commit classification result:", result);
}

testAst().catch(console.error);
