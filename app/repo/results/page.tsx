import { analyzeRepo } from "@/app/actions";

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

export default async function ResultsPage({ searchParams }: { searchParams: { repo: string } }) {
  const params = await searchParams;

  const data = await analyzeRepo(params.repo);

  const hasStructuralAnalysis  = data.some(c => c.structuralAnalysisApplied);

  if (!data) {
    return <p>No results</p>;
  }

  const commits: CommitView[] = data;

  return (
    !hasStructuralAnalysis ? (
      <div className="mb-4 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
        This repository does not contain JavaScript or TypeScript source files.
        Commits are classified conservatively using file-level signals only.
      </div>
    ) : (
      <div className="min-h-screen bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black p-4 sm:p-8">
        <main className="mx-auto max-w-5xl">
          
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  Commit Analysis
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  Structural evolution detected across {commits.length} commits
                </p>
              </div>
              
              <div className="flex gap-2">
                <div className="cursor-pointer rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 shadow-sm">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {commits.filter(c => c.label === 'major').length}
                  </div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wide">Major</div>
                </div>
                
                <div className="cursor-pointer rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 shadow-sm">
                  <div className="text-2xl font-bold text-zinc-600 dark:text-zinc-400">
                    {commits.filter(c => c.label === 'minor').length}
                  </div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wide">Minor</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {commits.map((c, idx) => (
              <div
                key={c.hash}
                className="group relative"
              >
                {idx !== commits.length - 1 && (
                  <div className={`absolute left-6 top-14 bottom-0 w-0.5 bg-linear-to-b from-zinc-300 to-transparent dark:from-zinc-700`} />
                )}
                
                <div className={`relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 ${c.label === 'major' ? 'from-red-500 to-red-500/20 dark:from-red-700 dark:to-red-700/20' : ''}`}>
                  <div className="flex items-start gap-4 p-5">
                    
                    <div className="relative shrink-0 mt-0.5">
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        c.label === "major"
                          ? "bg-red-500 border-red-300 dark:border-red-700 shadow-lg shadow-red-500/50"
                          : "bg-zinc-400 border-zinc-300 dark:border-zinc-700"
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                          {c.message}
                        </h3>
                        
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${
                            c.label === "major"
                              ? "bg-red-500/10 text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-500/20"
                              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 ring-1 ring-inset ring-zinc-200 dark:ring-zinc-700"
                          }`}
                        >
                          {c.label === "major" && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                          )}
                          {c.label}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(c.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className="flex items-center gap-1.5 font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          {c.hash.slice(0, 7)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 rounded-xl bg-linear-to-r from-zinc-500/0 via-zinc-500/0 to-zinc-500/0 group-hover:from-zinc-500/5 group-hover:via-zinc-500/5 group-hover:to-transparent dark:group-hover:from-zinc-400/5 dark:group-hover:via-zinc-400/5 transition-all duration-300 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          {commits.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
                <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                No commits found
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Start making commits to see your analysis here
              </p>
            </div>
          )}
        </main>
      </div>
    )
  );
}
