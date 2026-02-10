import * as git from 'isomorphic-git';
import fs from "fs";

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
    const log = await git.log({
        fs,
        dir: repoPath,
    });
    
    return log.map(commit => ({
        hash: commit.oid,
        date: new Date(commit.commit.author.timestamp * 1000).toISOString(),
        message: commit.commit.message,
        author: commit.commit.author.name,
        parents: commit.commit.parent,
    }));
}

export async function getFileStatsForCommit(repoPath: string, commitHash: string): Promise<FileStat[]> {
    const commits = await git.log({ fs, dir: repoPath });
    const commit = commits.find(c => c.oid === commitHash);

    const parent = commit?.commit.parent?.[0];

    const stats: { path: string; added: number; removed: number }[] = [];
    /*
        raw:
        added removed path
        3	    1	    src/utils.ts
        0	    2	    README.md
        -	    -	    assets/logo.png
    */

    async function readText(entry?: any): Promise<string> {
        if (!entry) return "";
        if (entry.type() !== "blob") return "";

        const content = await entry.content();
        if (!content) return "";

        return Buffer.from(content).toString("utf8");
    }


    await git.walk({
        fs,
        dir: repoPath,
        trees: [
        git.TREE({ ref: parent }),
        git.TREE({ ref: commitHash }),
        ],
        map: async (filepath, [before, after]) => {
        if (filepath === ".") return;

        if (!before && !after) return;

        const beforeText = await readText(before);

        const afterText = await readText(after);

        const beforeLines = beforeText.split("\n").length;
        const afterLines = afterText.split("\n").length;

        stats.push({
            path: filepath,
            added: Math.max(0, afterLines - beforeLines),
            removed: Math.max(0, beforeLines - afterLines),
        });
        },
    });

    return stats;
}