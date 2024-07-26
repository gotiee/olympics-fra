"use client";

import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useState, useMemo, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Rings, TailSpin } from "react-loader-spinner";
import { Input } from "@/components/ui/input";
import { Check, Clock } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// Les interfaces et le code pour obtenir l'URL des icônes sont les mêmes
// Définition des interfaces et de la fonction getIconUrl

interface Competitor {
  code: string;
  noc: string;
  name: string;
  order: number;
  results: {
    position: string;
    mark: string;
    winnerLoserTie: string;
    medalType: string;
    irm: string;
  };
}

interface EventUnit {
  id: string;
  disciplineName: string;
  eventUnitName: string;
  startDate: string;
  venueDescription: string;
  statusDescription: string;
  disciplineCode: string;
  competitors: Competitor[];
}

interface SportsResponse {
  units: EventUnit[];
}

interface IconContent {
  id: string;
  entityId: string;
  name: string;
  url: string;
  odfCode: string;
  pictogram: string;
}

interface IconModule {
  content: IconContent[];
}

export default function Home() {
  const {
    data: sports,
    error: sportsError,
    isLoading: isLoadingSports,
    isValidating: isValidatingSports,
  } = useSWR<SportsResponse>(process.env.NEXT_PUBLIC_API, fetcher, {
    refreshInterval: 5000,
  });

  const getIconUrl = (disciplineCode: string) => {
    return (
      process.env.NEXT_PUBLIC_ICONS_API + disciplineCode.toLowerCase() + ".svg"
    );
  };

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initialSearchTerm = searchParams.get("search") ?? "";
  const initialStatusFilter =
    (searchParams.get("status") as
      | "All"
      | "En cours"
      | "Terminée"
      | "Interruption programmée"
      | "En préparation") || "All";

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [statusFilter, setStatusFilter] = useState<
    | "All"
    | "En cours"
    | "Terminée"
    | "Interruption programmée"
    | "En préparation"
  >(initialStatusFilter);

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
    }, {} as { [key: string]: EventUnit[] });
  }, [sports]);

  const filteredEventsByDate = useMemo(() => {
    const filtered = {} as { [key: string]: EventUnit[] };
    for (const date in eventsByDate) {
      const events = eventsByDate[date].filter((event) => {
        const regex = new RegExp(searchTerm, "i");
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    updateQueryParams(e.target.value, statusFilter);
  };

  const handleStatusFilterChange = (e: string) => {
    setStatusFilter(
      e as
        | "All"
        | "En cours"
        | "Terminée"
        | "Interruption programmée"
        | "En préparation"
    );
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
    if (initialSearchTerm !== "" || initialStatusFilter !== "All") return;
    Object.keys(eventsByDate).forEach((date) => {
      const { 0: day, 1: month, 2: year } = date.split("/");
      const dayDate = new Date(`${year}-${month}-${day}`);
      dayDate.setHours(23, 59, 59, 999);
      if (dayDate < now) {
        setCollapsedDays((prev) => [...prev, date]);
      }
    });
  }, [isLoadingSports]);

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
          <Input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border p-2 rounded"
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

interface EventCardProps {
  event: EventUnit;
  getIconUrl: (disciplineCode: string) => string | null;
}

const EventCard: React.FC<EventCardProps> = ({ event, getIconUrl }) => {
  const [showCompetitors, setShowCompetitors] = useState(false);

  const toggleCompetitors = () => {
    setShowCompetitors(!showCompetitors);
  };

  const iconUrl = getIconUrl(event.disciplineCode);

  const getStatusColor = () => {
    switch (event.statusDescription) {
      case "Terminée":
        return "border-blue-500 shadow-blue-500";
      case "En cours":
        return "border-green-500 shadow-green-500";
      case "Interruption programmée":
        return "border-yellow-500 shadow-yellow-500";
      case "En préparation":
        return "border-yellow-500 shadow-yellow-500";
      default:
        return "border-gray-300";
    }
  };

  function getFlagUrl(countryCode: string) {
    if (!countryCode) return "";
    return (
      process.env.NEXT_PUBLIC_FLAG_API + countryCode.toLowerCase() + ".png"
    );
  }

  return (
    <div className={`border p-4 rounded shadow  ${getStatusColor()}`}>
      <div className="flex items-center mb-4 justify-between">
        <div className="flex">
          {iconUrl && (
            <img
              src={iconUrl}
              alt={event.disciplineName}
              className="w-10 h-10 mr-4"
            />
          )}
          <h2 className="text-xl font-semibold">{event.disciplineName}</h2>
        </div>
        {event.statusDescription === "Programmée" && <Clock />}
        {event.statusDescription === "Terminée" && <Check />}
        <Rings
          visible={
            event.statusDescription === "En cours" ||
            event.statusDescription === "Interruption programmée" ||
            event.statusDescription === "En préparation"
          }
          height="40"
          width="40"
          color="#ef4444"
          ariaLabel="rings-loading"
        />
      </div>
      <div className="h-28 text-base">
        <strong>
          {new Intl.DateTimeFormat("fr-FR", {
            timeStyle: "short",
          }).format(new Date(event.startDate))}
        </strong>
        <p>{event.eventUnitName}</p>
        <p>Lieux : {event.venueDescription}</p>
      </div>

      <Accordion type="single" collapsible onValueChange={toggleCompetitors}>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            {showCompetitors
              ? "Cacher les résultats"
              : "Afficher les résultats"}
          </AccordionTrigger>
          <AccordionContent>
            {event.competitors.map((competitor, index) => (
              <div key={competitor?.code} className="mt-2 flex">
                <p className="flex">
                  <img
                    src={getFlagUrl(competitor?.noc)}
                    alt={competitor?.noc}
                    className="h-5 mr-2"
                  />
                  {index + 1} - {competitor?.name} : {competitor?.results?.mark}
                </p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
