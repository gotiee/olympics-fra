import { TV } from "@/interfaces/TV";
import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
export function useTv() {
  const { data: tv } = useSWR<TV>("/api", fetcher, { refreshInterval: 5000 });
  return { tv };
}
