import { MedalEntry } from "@/interfaces/Medals";
import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";

export function useMedalsTable(all: boolean) {
  const { data: medalsData } = useSWR<{ medalsTable: MedalEntry[] }>(
    process.env.NEXT_PUBLIC_MEDALS_TABLE_API,
    fetcher
  );

  const getFilteredMedals = () => {
    if (!medalsData) return [];
    if (all) return medalsData.medalsTable;

    const topThree = medalsData.medalsTable.slice(0, 3);
    const france = medalsData.medalsTable.find((entry) => entry.noc === "FRA");

    if (france && !topThree.some((entry) => entry.noc === "FRA")) {
      return [...topThree, france];
    }
    return topThree;
  };

  return getFilteredMedals();
}
