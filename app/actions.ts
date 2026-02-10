"use server";

import { cloneRepo } from "@/lib/git/clone";
import { getCommitHistory } from "@/lib/git/history";
import { computeCommitSignals, classifyCommit } from "@/lib/analysis/heuristics";
import fs from "fs/promises";

type CommitView = {
  hash: string;
  message: string;
  date: string;
  label: string;
  score: number;
  reasons: string[];
  onlyDocsChanged: boolean;
    structuralAnalysisApplied: boolean;
};

export async function analyzeRepo(repoUrl: string): Promise<CommitView[]> {
    // 1. Clone
    // why clone repo if we only need the commit history? because we also need to analyze the file changes in each commit to compute the signals, which requires access to the repo's .git directory and files. using git commands on the local clone is much more efficient than making API calls to a remote service for each commit.
    const repoPath = await cloneRepo(repoUrl); 
    
    try {
        // 2. Get commits
        const commits = await getCommitHistory(repoPath);
    
        // 3. Analyze each commit
        const results = [];
        for (const commit of commits.slice(0, 100)) {
            // gets all the signals for a commit
            const signals = await computeCommitSignals(repoPath, commit.hash, commit.parents?.[0] || null);
            // classifies the commit based on the signals
            const classification = classifyCommit(signals);
       
            results.push({
                hash: commit.hash,
                message: commit.message,
                date: commit.date,
                label: classification.label,
                score: classification.score,
                reasons: classification.reasons,
                onlyDocsChanged: signals.onlyDocsChanged,
                structuralAnalysisApplied: signals.structuralAnalysisApplied
            });
        }
    
        return results;
    } finally {
        await fs.rm(repoPath, { recursive: true, force: true });
    }
}