import { FranceTv } from "@/interfaces/FranceTv";
import { fetcher, fetcherFranceTv } from "@/utils/fetcher";
import useSWR from "swr";

export function useFranceTv() {
  const { data: franceTv } = useSWR<FranceTv>("/api", fetcher, {
    refreshInterval: 5000,
  });

  return {
    franceTv,
  };
}
