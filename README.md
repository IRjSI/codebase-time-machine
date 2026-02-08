# Codebase Time Machine

A tool that analyzes a Git repository’s history and highlights structural code evolution instead of raw line diffs.
The goal is to surface when the shape of the codebase changes, not every edit.

## What it does

For each commit, the system:

- Extracts file-level change stats (lines added/removed, files touched)
- Parses JavaScript/TypeScript files into ASTs
- Compares before vs after structure
- Classifies the commit as:
  - major → structural evolution
  - minor → refactors, docs, metadata, noise

```
Git Repo
  ↓
Commit Metadata
  ↓
File Stats (LOC, files changed)
  ↓
AST Signals (before / after)
  ↓
Aggregated Commit Signals
  ↓
Heuristic Classification
```

- Get the repo user want to analyze ✅
- Get the commit history (upto 100 commits) ✅
- Get all the details related to each commit ✅
- Get the AST of the commit ✅

- Heuristics, the important part:
    - Classify each commit as major or minor, i.e., important or not
