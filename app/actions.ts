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

export async function analyzeRepo(repoUrl: string): Promise<{ success: boolean; data?: CommitView[]; error?: string }> {
    // 1. Clone
    // why clone repo if we only need the commit history? because we also need to analyze the file changes in each commit to compute the signals, which requires access to the repo's .git directory and files. using git commands on the local clone is much more efficient than making API calls to a remote service for each commit.
    let repoPath = "";
    try {
        repoPath = await cloneRepo(repoUrl); 
        // 2. Get commits
        const commits = await getCommitHistory(repoPath);
    
        // 3. Analyze each commit
        const results = [];
        for (const commit of commits.slice(0, 24)) {
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
    
        return {
            success: true,
            data: results,
        }
    } catch(error: any) {
        console.error("Error analyzing repository:", error);
        return { success: false, error: error.message || "An error occurred while analyzing the repository." };
    } finally {
        if (repoPath && repoPath.startsWith("/tmp/repos")) {
            await fs.rm(repoPath, { recursive: true, force: true });
        }
    }
}