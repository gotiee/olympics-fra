"use client";

import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useState, useMemo, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TailSpin } from "react-loader-spinner";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Event, EventStatus } from "@/interfaces/Event";
import { EventCard } from "@/components/ui/event-card";
import { SearchBar } from "@/components/ui/search-bar";

interface SportsResponse {
  units: Event[];
}

export default function Home() {
  const {
    data: sports,
    isLoading: isLoadingSports,
    isValidating: isValidatingSports,
  } = useSWR<SportsResponse>(process.env.NEXT_PUBLIC_API, fetcher, {
    refreshInterval: 5000,
  });

  const { data: disciplinesData } = useSWR<any>(
    process.env.NEXT_PUBLIC_DISCIPLINES_API,
    fetcher
  );

  const getIconUrl = (disciplineCode: string) => {
    return (
      process.env.NEXT_PUBLIC_ICONS_API + disciplineCode.toLowerCase() + ".svg"
    );
  };

  const [disciplines, setDisciplines] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (!disciplinesData) return;
    setDisciplines(
      disciplinesData.modules[0].content.map((discipline: any) => ({
        value: discipline.name,
        label: discipline.name,
      }))
    );
  }, [disciplinesData]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initialSearchTerm = searchParams.get("search") ?? "";
  const initialStatusFilter =
    (searchParams.get("status") as EventStatus) ?? "All";

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [statusFilter, setStatusFilter] =
    useState<EventStatus>(initialStatusFilter);

  const updateQueryParams = (search: string, status: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("search", search);
    params.set("status", status);

    router.push(`${pathname}?${params.toString()}`);
  };

  const [collapsedDays, setCollapsedDays] = useState<string[]>([]);

  const eventsByDate = useMemo(() => {
    if (!sports) return {};
    return sports.units.reduce((acc, event) => {
      const date = new Date(event.startDate).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {} as { [key: string]: Event[] });
  }, [sports]);

  const filteredEventsByDate = useMemo(() => {
    const filtered = {} as { [key: string]: Event[] };
    for (const date in eventsByDate) {
      const events = eventsByDate[date].filter((event) => {
        const regex = new RegExp(searchTerm, "i");
        const matchesSearch = regex.test(event.disciplineName);
        const matchesStatus =
          statusFilter === EventStatus.All ||
          event.statusDescription === statusFilter;
        return matchesSearch && matchesStatus;
      });
      if (events.length > 0) {
        filtered[date] = events;
      }
    }
    return filtered;
  }, [eventsByDate, searchTerm, statusFilter]);

  const handleSearchChange = (string: string) => {
    setSearchTerm(string);
    updateQueryParams(string, statusFilter);
  };

  const handleStatusFilterChange = (e: string) => {
    setStatusFilter(e as EventStatus);
    updateQueryParams(searchTerm, e);
  };

  const toggleDay = (date: string) => {
    setCollapsedDays((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const isDayCollapsed = (date: string) => {
    return collapsedDays.includes(date);
  };

  const getDateFromString = (date: string) => {
    const { 0: day, 1: month, 2: year } = date.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  const firstLetterToUpperCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    const now = new Date();
    if (searchTerm !== "" || statusFilter !== "All") {
      setCollapsedDays([]);
      return;
    }
    Object.keys(eventsByDate).forEach((date) => {
      const { 0: day, 1: month, 2: year } = date.split("/");
      const dayDate = new Date(`${year}-${month}-${day}`);
      dayDate.setHours(23, 59, 59, 999);
      if (dayDate < now) {
        setCollapsedDays((prev) => [...prev, date]);
      }
    });
  }, [isLoadingSports, searchTerm, statusFilter]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between lg:px-24 lg:py-8 px-8 py-2">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold ">
            Équipe de France aux Jeux Olympiques 2024
          </h1>
          <TailSpin
            visible={isValidatingSports}
            height="30"
            width="30"
            color="#3b82f6"
            radius="5"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
        <div className="mb-4 flex gap-4">
          <SearchBar
            initialSearch={initialSearchTerm}
            disciplines={disciplines}
            handleSearchChange={handleSearchChange}
          />
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="All">Tous</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Terminée">Terminée</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {!isLoadingSports &&
          Object.entries(filteredEventsByDate).length === 0 && (
            <h1>Aucun événements</h1>
          )}
        {Object.entries(filteredEventsByDate).map(([date, events]) => (
          <div key={date} className="mb-2">
            <Accordion
              type="single"
              collapsible
              onValueChange={toggleDay}
              value={!isDayCollapsed(date) ? "item-1" : ""}
            >
              <AccordionItem value="item-1">
                <AccordionTrigger
                  onClick={() => toggleDay(date)}
                  className="text-lg"
                >
                  {firstLetterToUpperCase(
                    new Intl.DateTimeFormat("fr-FR", {
                      dateStyle: "full",
                    }).format(new Date(getDateFromString(date)))
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        getIconUrl={getIconUrl}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>
    </main>
  );
}
