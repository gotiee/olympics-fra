import useSWR from "swr";
import { useMemo } from "react";
import { fetcher } from "@/utils/fetcher";
import { Event, EventsResponse } from "@/interfaces/Event";
import { escapeRegExp } from "@/utils/utils";

export function useEvents(searchTerm: string, statusFilter: string) {
  const {
    data: sports,
    error,
    isValidating,
  } = useSWR<EventsResponse>(process.env.NEXT_PUBLIC_API, fetcher, {
    refreshInterval: 5000,
  });

  const isLoadingSports = !sports && !error;
  const isValidatingSports = isValidating;

  const eventsByDate = useMemo(() => {
    if (!sports) return {};
    return sports.units.reduce((acc: { [key: string]: Event[] }, event) => {
      const date = new Date(event.startDate).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {});
  }, [sports]);

  const filteredEventsByDate = useMemo(() => {
    const filtered: { [key: string]: Event[] } = {};
    for (const date in eventsByDate) {
      const events = eventsByDate[date].filter((event) => {
        console.log(event.status)
        const regex = new RegExp(escapeRegExp(searchTerm), "i");
        const matchesSearch = regex.test(event.disciplineName);
        const matchesStatus =
          statusFilter === "All" || event.statusDescription === statusFilter;
        return matchesSearch && matchesStatus;
      });
      if (events.length > 0) {
        filtered[date] = events;
      }
    }
    return filtered;
  }, [eventsByDate, searchTerm, statusFilter]);

  return { filteredEventsByDate, isLoadingSports, isValidatingSports };
}
