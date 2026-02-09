# Codebase Time Machine

Codebase Time Machine analyzes a Git repository’s history and highlights **structural code evolution** instead of raw line diffs.

The goal is to answer a simple question:

> *When did the codebase actually change in shape, not just in text?*

---

## High-level flow

```
Clone repository
↓
Get commit history
↓
For each commit:
Compute commit signals
├─ File stats (LOC added / removed)
└─ AST signals (structural deltas)
Classify commit (major / minor)
```


The analysis is deterministic, rule-based, and explainable.

---

## Detailed execution flow

### 1. Clone repository

The repository is cloned locally into a `.repos/` directory.

This is required because all Git operations used (`log`, `show`, `numstat`) operate on a **local Git object database**, not remote URLs.

---

### 2. Extract commit history

The full commit timeline is read using Git metadata.

Each commit provides:
- commit hash
- author
- date
- commit message

This defines the sequence of commits to analyze.

---

### 3. Per-commit analysis

Each commit is analyzed independently.

---

#### 3.1 Compute commit signals

This step aggregates **raw data into structured signals**.

##### a) File-level statistics

For the commit:
- all changed files are collected
- per-file lines added and removed are extracted
- totals are computed:
  - `locAdded`
  - `locRemoved`

These represent the **magnitude of change** at the commit level.

---

##### b) AST-based structural analysis

For JavaScript / TypeScript files (`.js`, `.jsx`, `.ts`, `.tsx`):

1. File contents are loaded:
   - before the commit (`commit^`)
   - after the commit (`commit`)
2. Each version is parsed into an AST
3. Structural elements are counted:
   - functions
   - exports
   - classes
   - control flow branches
4. Deltas are computed between before and after

If a file:
- does not exist before → treated as file creation
- does not exist after → treated as file deletion
- cannot be parsed → treated as structurally opaque

Commits without analyzable source files are handled explicitly.

---

### 4. Commit classification

Aggregated commit signals are passed through a heuristic classifier.

Signals considered include:
- public API changes (exports)
- new abstractions (functions, classes)
- increased control flow
- size of change (LOC)
- documentation-only commits

The result is:
- `major` → structural evolution
- `minor` → refactors, docs, metadata, non-structural changes

Each classification includes a score and human-readable reasons.

---

## Scope and constraints

- **Language support**: JavaScript / TypeScript only
- **Analysis focus**: structural evolution, not behavioral correctness
- **Parsing strategy**: best-effort, permissive AST parsing
- **Heuristics**: conservative by design
- **Unsupported languages**: skipped without failure

The system prioritizes **clarity and reliability over coverage**.

---

## Production constraints and design decisions

This project performs Git-level analysis (cloning repositories, reading commit history, and inspecting file contents at specific commits). While this works naturally in local development, deploying to a serverless environment introduces strict runtime constraints.

### Filesystem limitations

On serverless platforms (e.g. Vercel), the application code directory is read-only. Only a temporary directory (`/tmp`) is writable.

**Resolution**  
Repositories are cloned into a temporary directory and removed after analysis. The cloned repository is treated as short-lived scratch space, not persistent storage.

---

### Missing system Git binary

Serverless runtimes do not provide access to system binaries such as `git`. Any solution relying on spawning the Git CLI (e.g. via `simple-git`) will fail in production.

**Resolution**  
The project switches to a pure JavaScript Git implementation (`isomorphic-git`) that runs entirely in userland without requiring a system `git` binary. This makes the analysis pipeline compatible with serverless deployments.
