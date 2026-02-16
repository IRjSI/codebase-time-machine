import * as git from 'isomorphic-git';
import http from "isomorphic-git/http/node";
import path from "path";
import fs from "fs";

export async function cloneRepo(repoUrl: string): Promise<string> {
    const repoName = repoUrl.split("/").pop()?.replace(".git", "");
    if (!repoName) {
        throw new Error("Invalid repository URL");
    }

    const baseDir = path.join("/tmp", "repos"); // C:\Users\HP\codebase-time-machine\.repos
    const repoPath = path.join(baseDir, repoName); // C:\Users\HP\codebase-time-machine\.repos\mockingcase

    // NOTE: repo name collisions are not handled
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
    }
    // const git: SimpleGit = simpleGit();
    try {
        await git.clone({
            fs,
            http,
            dir: repoPath,
            url: repoUrl,
            depth: 100,
        });
    } catch (error: any) {
        if (!error.message.includes("exists")) throw error;
    }

    return repoPath;
}
