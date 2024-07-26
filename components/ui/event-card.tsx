import { Event, EventStatus } from "@/interfaces/Event";
import { Check, Clock, PartyPopper } from "lucide-react";
import { useRef, useState } from "react";
import { Rings } from "react-loader-spinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import Confetti from "react-confetti";
import { useMeasure } from "react-use";

interface EventCardProps {
  event: Event;
  getIconUrl: (disciplineCode: string) => string | null;
}

export const EventCard: React.FC<EventCardProps> = ({ event, getIconUrl }) => {
  const [showCompetitors, setShowCompetitors] = useState(false);
  const [ref, { width, height }] = useMeasure();

  const toggleCompetitors = () => {
    setShowCompetitors(!showCompetitors);
  };

  const didCountryWinEvent = (event: Event, countryCode: string): boolean => {
    return event.competitors.some(
      (competitor) =>
        competitor.noc === countryCode &&
        competitor.results.winnerLoserTie === "W"
    );
  };

  const confettiRef = useRef<HTMLCanvasElement>(null);

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
    <div
      ref={ref as React.LegacyRef<HTMLDivElement>}
      className={`border p-4 rounded shadow relative ${getStatusColor()}`}
    >
      {didCountryWinEvent(event, "FRA") && (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Confetti
            ref={confettiRef}
            id={"confetti " + event.id}
            width={width + 32}
            height={height + 32}
            numberOfPieces={20}
          />
        </div>
      )}
      <div className="flex items-center mb-4 justify-between w-full">
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
        {event.statusDescription === EventStatus.Scheduled && <Clock />}
        {event.statusDescription === EventStatus.Finished &&
          (didCountryWinEvent(event, "FRA") ? <PartyPopper /> : <Check />)}
        <Rings
          visible={[
            EventStatus.InProgress,
            EventStatus.Interupted,
            EventStatus.Preparing,
          ].includes(event.statusDescription)}
          height="40"
          width="40"
          color="#ef4444"
          ariaLabel="rings-loading"
        />
      </div>
      <div className="h-28 text-base">
        <strong>
          {new Intl.DateTimeFormat("fr-FR", {
            dateStyle: "medium",
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
