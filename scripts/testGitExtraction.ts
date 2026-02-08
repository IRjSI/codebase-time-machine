import { cloneRepo } from "../lib/git/clone";
import { getCommitHistory } from "../lib/git/history";
import { getFileStatsForCommit } from "../lib/git/history";

async function run() {
  const repoUrl = "https://github.com/strdr4605/mockingcase.git";

  // 1. Clone
  const repoPath = await cloneRepo(repoUrl);
  console.log("Repo cloned at:", repoPath);

  // 2. Get commits
  const commits = await getCommitHistory(repoPath);
  console.log("Total commits:", commits.length);

  // Sanity check: log first & last
  console.log("Oldest commit:", commits[commits.length - 1]);
  console.log("Newest commit:", commits[0]);

  // 3. Pick one commit (newest)
  const sampleCommit = commits[0].hash;
  console.log("Testing commit:", sampleCommit);

  // 4. Get file stats
  const stats = await getFileStatsForCommit(repoPath, sampleCommit);
  console.log("File stats:", stats);
}

run().catch(console.error);
