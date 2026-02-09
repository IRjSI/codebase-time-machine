import { analyzeRepo } from "@/app/actions";
import CommitList from "@/components/CommitList";

export default async function ResultsPage({ searchParams }: { searchParams: { repo: string } }) {
  const params = await searchParams;

  const data = await analyzeRepo(params.repo);

  return (
    <CommitList data={data} />
  );
}
