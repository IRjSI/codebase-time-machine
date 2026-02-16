import { analyzeRepo } from "@/app/actions";
import CommitList from "@/components/CommitList";
import { ErrorState } from "@/components/ErrorState";

export default async function ResultsPage({ searchParams }: { searchParams: { repo: string } }) {
  const params = await searchParams;

  const data = await analyzeRepo(params.repo);

  try {
    if (!data.success) {
      return <ErrorState message={data.error!} />;
    }

    return (
      <CommitList data={data.data!} />
    );
  } catch (error) {
    
  }
}
