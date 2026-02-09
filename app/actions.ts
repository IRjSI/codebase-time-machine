"use server";

import { cloneRepo } from "@/lib/git/clone";
import { getCommitHistory } from "@/lib/git/history";
import { computeCommitSignals, classifyCommit } from "@/lib/analysis/heuristics";

type CommitView = {
  hash: string;
  message: string;
  date: string;
  label: string;
  score: number;
  reasons: string[];
};

export async function analyzeRepo(repoUrl: string): Promise<CommitView[]> {
    // 1. Clone
    const repoPath = await cloneRepo(repoUrl);
    
    // 2. Get commits
    const commits = await getCommitHistory(repoPath);

    // 3. Analyze each commit
    const results = [];
    for (const commit of commits.slice(0, 100)) {
        const signals = await computeCommitSignals(repoPath, commit.hash);
        const classification = classifyCommit(signals);
   
        results.push({
            hash: commit.hash,
            message: commit.message,
            date: commit.date,
            label: classification.label,
            score: classification.score,
            reasons: classification.reasons,
        });
    }

    console.log(results);

    // Later: store / return this
    return results;
}