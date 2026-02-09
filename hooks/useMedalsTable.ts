import { MedalEntry } from "@/interfaces/Medals";
import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";

export function useMedalsTable(all: boolean) {
  const { data: medalsData } = useSWR<{
    medalStandings: { medalsTable: MedalEntry[] };
  }>(process.env.NEXT_PUBLIC_MEDALS_TABLE_API, fetcher);

  const getFilteredMedals = () => {
    if (!medalsData) return [];
    if (all) return medalsData.medalStandings.medalsTable;

    const topThree = medalsData.medalStandings.medalsTable.slice(0, 3);
    const france = medalsData.medalStandings.medalsTable.find(
      (entry) => entry.organisation === "FRA",
    );

    if (france && !topThree.some((entry) => entry.organisation === "FRA")) {
      return [...topThree, france];
    }
    return topThree;
  };

  return getFilteredMedals();
}
