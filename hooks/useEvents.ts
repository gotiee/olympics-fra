import useSWR from "swr";
import { useMemo } from "react";
import { fetcher } from "@/utils/fetcher";
import { Event, EventsResponse, EventStatus } from "@/interfaces/Event";
import {
  didCountryWinEvent,
  didCountryWinEventMedal,
  escapeRegExp,
} from "@/utils/utils";

export function useEvents(
  searchTerm: string,
  statusFilter: string,
  countryCode: string
) {
  // Utiliser SWR pour récupérer les données
  const {
    data: sports,
    error,
    isValidating,
  } = useSWR<EventsResponse>(process.env.NEXT_PUBLIC_API, fetcher, {
    refreshInterval: 5000,
  });

  const isLoadingSports = !sports && !error;
  const isValidatingSports = isValidating;

  // Grouper les événements par date
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

  // Appliquer les filtres
  const filteredEventsByDate = useMemo(() => {
    const filtered: { [key: string]: Event[] } = {};
    for (const date in eventsByDate) {
      const events = eventsByDate[date].filter((event) => {
        const regex = new RegExp(escapeRegExp(searchTerm), "i");
        const matchesSearch = regex.test(event.disciplineName);
        const matchesStatus =
          (statusFilter === EventStatus.All || event.status === statusFilter) &&
          event.status !== EventStatus.Cancelled &&
          event.status !== EventStatus.Delayed;

        const matchesRunningStatus =
          statusFilter === EventStatus.Running &&
          [
            EventStatus.Interupted,
            EventStatus.GettingReady,
            EventStatus.Running,
          ].includes(event.status);

        const matchesSchedule =
          statusFilter === EventStatus.Scheduled &&
          [EventStatus.Scheduled, EventStatus.Rescheduled].includes(
            event.status
          );

        const didCountryWinEventMedalArray = didCountryWinEventMedal(
          event,
          countryCode
        );

        const matchesMedal =
          statusFilter === "MEDAL" &&
          didCountryWinEventMedalArray &&
          didCountryWinEventMedalArray.length > 0;

        const matchesVictory =
          statusFilter === "VICTORY" &&
          (didCountryWinEvent(event, countryCode) ||
            (didCountryWinEventMedalArray &&
              didCountryWinEventMedalArray.length > 0));

        return (
          matchesSearch &&
          (matchesStatus ||
            matchesMedal ||
            matchesVictory ||
            matchesRunningStatus ||
            matchesSchedule)
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
