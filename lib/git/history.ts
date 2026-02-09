import { simpleGit, SimpleGit } from 'simple-git';

export type CommitMeta = {
  hash: string;
  date: string;
  message: string;
  author: string;
  parents?: string[];
};

export type FileStat = {
  path: string;
  added: number;
  removed: number;
};

export async function getCommitHistory(repoPath: string): Promise<CommitMeta[]> {
    const git: SimpleGit = simpleGit(repoPath);
    const log = await git.log({
        "--all": null,
    });
    
    return log.all.map(commit => ({
        hash: commit.hash,
        date: commit.date,
        message: commit.message,
        author: commit.author_name
    }));
}

export async function getFileStatsForCommit(repoPath: string, commitHash: string): Promise<FileStat[]> {
    const git: SimpleGit = simpleGit(repoPath);
    
    const raw = await git.raw([
        "show",
        "--numstat", // instead of a textual diff, show numeric line statistics per file
        "--format=", // print no commit header at all
        commitHash, // commit to be inspected
    ]);
    /*
        raw:
        added removed path
        3	    1	    src/utils.ts
        0	    2	    README.md
        -	    -	    assets/logo.png
    */

    return raw
        .trim()
        .split("\n")
        .filter(Boolean)
        .map(line => {
            const [added, removed, path] = line.split("\t");

            return {
                path,
                added: added === "-" ? 0 : Number(added),
                removed: removed === "-" ? 0 : Number(removed),
            };
        });
}