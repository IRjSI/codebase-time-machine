"use client";

import { useSearchParams } from "next/navigation";

type CommitView = {
  hash: string;
  message: string;
  date: string;
  label: "major" | "minor";
  score: number;
  reasons: string[];
};

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");

  if (!data) {
    return <p>No results</p>;
  }

  const commits: CommitView[] = JSON.parse(decodeURIComponent(data));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <main className="mx-auto max-w-3xl bg-white dark:bg-zinc-900 rounded-lg p-6">
        <h1 className="mb-6 text-xl font-semibold">
          Commit Analysis
        </h1>

        <ul className="space-y-3">
          {commits.map((c) => (
            <li
              key={c.hash}
              className="flex items-center justify-between border-b pb-2"
            >
              <div>
                <p className="text-sm font-medium">{c.message}</p>
                <p className="text-xs text-zinc-500">
                  {new Date(c.date).toLocaleString()}
                </p>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded ${
                  c.label === "major"
                    ? "bg-red-100 text-red-700"
                    : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {c.label.toUpperCase()}
              </span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
