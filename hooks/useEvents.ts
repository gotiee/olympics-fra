import useSWR from "swr";
import { useMemo } from "react";
import { fetcher } from "@/utils/fetcher";
import { Event, EventsResponse, EventStatus } from "@/interfaces/Event";
import { escapeRegExp } from "@/utils/utils";
import { Competitor } from "@/interfaces/Competitor";

export function useEvents(
  searchTerm: string,
  statusFilter: string,
  countryCode: string
) {
  const {
    data: sports,
    error,
    isValidating,
  } = useSWR<EventsResponse>(process.env.NEXT_PUBLIC_API, fetcher, {
    refreshInterval: 5000,
  });

  const isLoadingSports = !sports && !error;
  const isValidatingSports = isValidating;

  const didCountryWinEventMedal = (
    event: Event,
    countryCode: string
  ): Competitor[] | undefined => {
    return event.competitors.filter(
      (competitor) =>
        competitor.noc === countryCode &&
        competitor?.results &&
        competitor?.results?.medalType !== ""
    );
  };

  const didCountryWinEvent = (event: Event, countryCode: string): boolean => {
    return event.competitors.some(
      (competitor) =>
        competitor.noc === countryCode &&
        competitor?.results?.winnerLoserTie === "W"
    );
  };

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
        const regex = new RegExp(escapeRegExp(searchTerm), "i");
        const matchesSearch = regex.test(event.disciplineName);
        const matchesStatus =
          (statusFilter === EventStatus.All || event.status === statusFilter) &&
          event.status !== EventStatus.Cancelled &&
          event.status !== EventStatus.Delayed &&
          event.status !== EventStatus.Rescheduled;

        const matchesRunningStatus =
          statusFilter === EventStatus.Running &&
          [
            EventStatus.Interupted,
            EventStatus.GettingReady,
            EventStatus.Running,
          ].includes(event.status);
        const didCountryWinEventMedalArray = didCountryWinEventMedal(
          event,
          countryCode
        );
        const matchesMedal =
          statusFilter === "MEDAL" &&
          didCountryWinEventMedalArray &&
          didCountryWinEventMedalArray.length > 0;
        const matchesVictory =
          statusFilter === "VICTORY" && didCountryWinEvent(event, countryCode);
        return (
          matchesSearch &&
          (matchesStatus ||
            matchesMedal ||
            matchesVictory ||
            matchesRunningStatus)
        );
      });
      if (events.length > 0) {
        filtered[date] = events;
      }
    }
    return filtered;
  }, [eventsByDate, searchTerm, statusFilter, countryCode]);

  return { filteredEventsByDate, isLoadingSports, isValidatingSports };
}
