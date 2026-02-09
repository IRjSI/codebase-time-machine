"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    router.push(`/repo/results?repo=${repoUrl}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-50 via-zinc-100 to-zinc-50 dark:from-zinc-950 dark:via-black dark:to-zinc-950 px-4 py-12">
      <main className="w-full max-w-xl">
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-zinc-200/30 dark:bg-zinc-800/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-300/20 dark:bg-zinc-700/10 rounded-full blur-3xl" />
        </div>

        <div className="relative rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-10 shadow-2xl shadow-zinc-900/5 dark:shadow-black/20">

        <div className="absolute -top-3 -right-3">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-br from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 rounded-2xl blur-lg opacity-30" />
            <div className="relative rotate-45 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 shadow-xl border-4 border-white dark:border-zinc-900">
              <Link href={"https://github.com/IRjSI/codebase-time-machine"} target="_blank" rel="noopener noreferrer">
                <svg className="-rotate-45 h-7 w-7 text-white dark:text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
          
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 blur-xl opacity-20" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 shadow-lg">
                <svg className="w-8 h-8 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight mb-3">
              Codebase Time Machine
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Uncover when your codebase actually evolved
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="repo"
                className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300"
              >
                GitHub Repository
              </label>
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-linear-to-r from-zinc-400 to-zinc-500 dark:from-zinc-600 dark:to-zinc-500 opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <svg className="h-5 w-5 text-zinc-400 dark:text-zinc-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="repo"
                    type="url"
                    placeholder="https://github.com/username/repository"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-11 pr-4 py-3.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 focus:ring-4 focus:ring-zinc-200/50 dark:focus:ring-zinc-700/50"
                    required
                  />
                </div>
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                JS/TS repository only
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 px-6 py-4 text-sm font-semibold text-white dark:text-black shadow-lg shadow-zinc-900/20 dark:shadow-zinc-100/10 transition-all hover:shadow-xl hover:shadow-zinc-900/30 dark:hover:shadow-zinc-100/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent" />
              
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing repository...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Analyze Repository
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              <span className="text-zinc-400 dark:text-zinc-500">No account or authentication required</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
