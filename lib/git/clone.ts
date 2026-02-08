import { simpleGit, SimpleGit } from 'simple-git';
import path from "path";
import fs from "fs";

export async function cloneRepo(repoUrl: string): Promise<string> {
    const repoName = repoUrl.split("/").pop()?.replace(".git", "");
    if (!repoName) {
        throw new Error("Invalid repository URL");
    }

    const baseDir = path.join(process.cwd(), ".repos");
    const repoPath = path.join(baseDir, repoName);

    // NOTE: repo name collisions are not handled
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
    }
    if (!fs.existsSync(repoPath)) {
        const git: SimpleGit = simpleGit();
        await git.clone(repoUrl, repoPath, ["--depth", "100"]);
    }

    return repoPath;
}
