"use client";

import { useState } from "react";
import { analyzeRepo } from "./actions";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await analyzeRepo(repoUrl);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-xl rounded-xl bg-white p-8 shadow dark:bg-zinc-900">
        <h1 className="mb-6 text-2xl font-semibold">
          Codebase Time Machine
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="url"
            placeholder="https://github.com/user/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            className="rounded border px-3 py-2 text-sm dark:bg-black"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </form>
      </main>
    </div>
  );
}
