"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEvents } from "@/hooks/useEvents";
import { useDisciplines } from "@/hooks/useDisciplines";
import { FilterBar } from "@/components/FilterBar";
import { EventList } from "@/components/EventList";
import MedalsTable from "@/components/MedalsTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EventStatus } from "@/interfaces/Event";
import LoadingBar from "react-top-loading-bar";
import { useFranceTv } from "@/hooks/useFranceTv";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initialSearchTerm = searchParams.get("search") ?? "";
  const initialStatusFilter = searchParams.get("status") ?? EventStatus.All;
  const initialTab = searchParams.get("tab") ?? "events";

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [tab, setTab] = useState<string>(initialTab);
  const [collapsedDays, setCollapsedDays] = useState<string[]>([]);
  const [isFixed, setIsFixed] = useState<boolean>(false);
  const [seen, setSeen] = useState<boolean>(false);

  const { filteredEventsByDate, isLoadingSports, isValidatingSports } =
    useEvents(searchTerm, statusFilter, "FRA");
  const disciplines = useDisciplines(searchTerm);
  const { franceTv } = useFranceTv();
  const ref = useRef<any>(null);
  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 90);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const updateQueryParams = (search: string, status: string, tab: string) => {
    const params = new URLSearchParams(searchParams as any);
    params.set("search", search);
    params.set("status", status);
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`);
    setSeen(false);
  };

  useEffect(() => {
    const now = new Date();
    if (
      ![
        EventStatus.All,
        EventStatus.Finished,
        EventStatus.Scheduled,
        "VICTORY",
      ].includes(statusFilter as EventStatus)
    ) {
      setCollapsedDays([]);
      return;
    }

    if (seen || isLoadingSports) return;

    Object.keys(filteredEventsByDate).forEach((date) => {
      const [day, month, year] = date.split("/");
      const dayDate = new Date(`${year}-${month}-${day}`);
      dayDate.setHours(23, 59, 59, 999);
      if (dayDate < now) {
        setCollapsedDays((prev) => [...prev, date]);
      }
      dayDate.setHours(0, 0, 0, 0);

      if (dayDate > now) {
        setCollapsedDays((prev) => [...prev, date]);
      }
    });
    setSeen(true);
  }, [
    isLoadingSports,
    searchTerm,
    statusFilter,
    filteredEventsByDate,
    setSeen,
    seen,
  ]);

  useEffect(() => {
    if (isValidatingSports || isLoadingSports) {
      ref?.current?.staticStart();
    } else {
      ref?.current?.complete();
    }
  }, [isValidatingSports, isLoadingSports, searchTerm, statusFilter]);

  const toggleDay = (date: string) => {
    setCollapsedDays((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const isDayCollapsed = (date: string) => collapsedDays.includes(date);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between lg:px-24 lg:py-8 px-4 py-1">
      <LoadingBar color="#f11946" ref={ref} shadow={true} />
      <div className="container mx-auto  lg:p-4 p-2">
        <div className="flex items-center justify-center w-full mb-4">
          <picture>
            <img className="lg:w-8 w-6 mr-4" src="/images/jo.png" alt="jo" />
          </picture>
          <h1 className="lg:text-2xl text-lg font-bold mb-4 text-center">
            Équipe de France <br /> Jeux Olympiques 2026
          </h1>
          <picture>
            <img className="lg:w-8 w-6 ml-4" src="/images/jop.png" alt="jop" />
          </picture>
        </div>
        <Tabs
          defaultValue={tab}
          className={`w-full`}
          onValueChange={(tab) => {
            setTab(tab);
            updateQueryParams(searchTerm, statusFilter, tab);
          }}
        >
          <TabsList className={`w-full lg:mb-4 mb-2 lg:h-12`}>
            <TabsTrigger value="events" className={`w-full lg:text-lg`}>
              Événements
            </TabsTrigger>
            <TabsTrigger value="medals" className="w-full lg:text-lg">
              Tableau des Médailles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <FilterBar
              initialSearchTerm={initialSearchTerm}
              disciplines={disciplines}
              searchTerm={searchTerm}
              setSearchTerm={(search) => {
                setSearchTerm(search);
                updateQueryParams(search, statusFilter, tab);
              }}
              statusFilter={statusFilter}
              setStatusFilter={(status) => {
                setStatusFilter(status);
                updateQueryParams(searchTerm, status, tab);
              }}
              isFixed={isFixed}
            />

            {!isLoadingSports &&
              Object.entries(filteredEventsByDate).length === 0 && (
                <h1>Aucun événements</h1>
              )}
            <EventList
              franceTv={franceTv}
              filteredEventsByDate={filteredEventsByDate}
              toggleDay={toggleDay}
              isDayCollapsed={isDayCollapsed}
              getIconUrl={(disciplineCode: string) =>
                process.env.NEXT_PUBLIC_ICONS_API +
                disciplineCode.toLowerCase() +
                ".svg"
              }
            />
          </TabsContent>

          <TabsContent value="medals">
            <MedalsTable />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
