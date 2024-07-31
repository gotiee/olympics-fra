import React, { useRef, useState } from "react";
import { Rings } from "react-loader-spinner";
import Confetti from "react-confetti";
import { useMeasure } from "react-use";
import { Event, EventStatus } from "@/interfaces/Event";
import { Competitor } from "@/interfaces/Competitor";
import {
  Check,
  Clock,
  MapPin,
  Medal,
  MonitorPlay,
  PartyPopper,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { FranceTv } from "@/interfaces/FranceTv";
import Link from "next/link";
import useDirectLink from "@/hooks/useDirectLink";
import Image from "next/image";
import { AnyCnameRecord } from "dns";

interface EventCardProps {
  event: Event;
  getIconUrl: (disciplineCode: string) => string | null;
  franceTv: FranceTv | undefined;
}

const EventCard: React.FC<EventCardProps> = React.memo(
  ({ event, getIconUrl, franceTv }) => {
    const [showCompetitors, setShowCompetitors] = useState(false);
    const [ref, { width, height }] = useMeasure();
    const direct = useDirectLink(event, franceTv);

    const toggleCompetitors = () => setShowCompetitors((prev) => !prev);

    const didCountryWinEvent = (event: Event, countryCode: string): boolean => {
      return event.competitors.some(
        (competitor) =>
          competitor.noc === countryCode &&
          competitor?.results?.winnerLoserTie === "W"
      );
    };

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

    const confettiRef = useRef<HTMLCanvasElement>(null);

    const iconUrl = getIconUrl(event.disciplineCode);

    const getStatusColor = () => {
      switch (event.status) {
        case EventStatus.Finished:
          return "border-blue-500 shadow-blue-500";
        case EventStatus.Running:
          return "border-green-500 shadow-green-500";
        case EventStatus.Interupted:
        case EventStatus.GettingReady:
          return "border-yellow-500 shadow-yellow-500";
        default:
          return "border-gray-300";
      }
    };

    const getMedalColor = (medalTypes: string[] | undefined): any[] => {
      if (!medalTypes) return [];
      let returnedValue: any[] = [];
      for (const medal of medalTypes) {
        switch (medal) {
          case "ME_GOLD":
            returnedValue.push(
              <Medal key={medal} className="text-yellow-400 size-10" />
            );
            break;
          case "ME_SILVER":
            returnedValue.push(
              <Medal key={medal} className="text-gray-400 size-10" />
            );
            break;
          case "ME_BRONZE":
            returnedValue.push(
              <Medal key={medal} className="text-amber-900 size-10" />
            );
            break;
          default:
            return returnedValue;
            break;
        }
      }
      return returnedValue;
    };

    const getFlagUrl = (countryCode: string) => {
      if (!countryCode) return "";
      return (
        process.env.NEXT_PUBLIC_FLAG_API + countryCode.toLowerCase() + ".png"
      );
    };

    const medals = getMedalColor(
      didCountryWinEventMedal(event, "FRA")?.map(
        (e: Competitor) => e.results?.medalType
      )
    );

    return (
      <div
        ref={ref as React.LegacyRef<HTMLDivElement>}
        className={`border p-4 rounded shadow relative ${getStatusColor()}`}
        key={event.id}
      >
        {(didCountryWinEvent(event, "FRA") || medals.length > 0) && (
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <Confetti
              ref={confettiRef}
              id={"confetti " + event.id}
              width={width + 32}
              height={height + 32}
              numberOfPieces={8}
            />
          </div>
        )}
        <div className="flex items-center mb-4 justify-between w-full items-center">
          <div className="flex items-center">
            {iconUrl && (
              <Image
                width={0}
                height={0}
                src={iconUrl}
                alt={event.disciplineName}
                className="w-10 h-10 mr-4"
              />
            )}
            <h2 className="text-xl font-semibold">{event.disciplineName}</h2>
          </div>
          {event.status === EventStatus.Scheduled && <Clock />}
          {event.status === EventStatus.Finished &&
            (medals.length > 0 ? (
              <div className="flex justify-end">
                {medals.map((medal: any) => medal)}
              </div>
            ) : didCountryWinEvent(event, "FRA") ? (
              <PartyPopper />
            ) : (
              <Check />
            ))}
          <Rings
            visible={[
              EventStatus.GettingReady,
              EventStatus.Interupted,
              EventStatus.Running,
            ].includes(event.status)}
            height="40"
            width="40"
            color="#ef4444"
            ariaLabel="rings-loading"
          />
        </div>
        <div className="min-h-24 text-base mb-2">
          <div className="mb-2">
            <strong>
              {new Intl.DateTimeFormat("fr-FR", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(event.startDate))}
            </strong>
          </div>
          <div className="mb-2">
            <p>{event.eventUnitName}</p>
          </div>
          <p className="flex text-sm items-center">
            <MapPin className="mr-1 size-3" /> {event.venueDescription}
          </p>
        </div>
        <div className="flex lg:text-lg text-base items-center mb-2">
          {direct &&
            [
              EventStatus.Running,
              EventStatus.Interupted,
              EventStatus.GettingReady,
            ].includes(event.status) && (
              <Link
                href={direct.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-gray-600"
              >
                <MonitorPlay className="mr-2 hover:text-gray-600" />{" "}
                <p className="hover:underline">Regarder en direct sur</p>
                <Image
                  width={0}
                  height={0}
                  className="size-10 ml-2"
                  src={
                    direct.channel.includes("france")
                      ? direct.logo.replace("-invert", "")
                      : direct.logo
                  }
                  alt="logo-chaine"
                />
              </Link>
            )}
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
                <div key={competitor?.name} className="mt-2 flex">
                  <p className="flex">
                    <picture>
                      <img
                        src={getFlagUrl(competitor?.noc)}
                        alt={competitor?.noc}
                        className="h-5 mr-2"
                      />
                    </picture>
                    {index + 1} - {competitor?.name} :{" "}
                    {competitor?.results?.mark}
                  </p>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
);

EventCard.displayName = "EventCard";

export { EventCard };
