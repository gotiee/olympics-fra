import { Check, Clock, Medal, PartyPopper } from "lucide-react";
import { Competitor } from "@/interfaces/Competitor";
import { Event, EventStatus } from "@/interfaces/Event";

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function firstLetterToUpperCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getDateFromString(date: string): Date {
  const [day, month, year] = date.split("/");
  return new Date(`${year}-${month}-${day}`);
}

export function cleanChannelName(channel: string): string {
  const tmp = channel.replace(/[^a-zA-Z0-9]/g, " ").toLowerCase();
  return tmp.charAt(0).toUpperCase() + tmp.slice(1);
}

export function didCountryWinEventMedal(
  event: Event,
  countryCode: string
): Competitor[] {
  return event.competitors.filter(
    (competitor) =>
      competitor.noc === countryCode &&
      competitor?.results &&
      competitor.results?.medalType &&
      competitor?.results.medalType !== ""
  );
}

export function didCountryWinEvent(event: Event, countryCode: string): boolean {
  return event.competitors.some(
    (competitor) =>
      competitor.noc === countryCode &&
      competitor?.results?.winnerLoserTie === "W"
  );
}

export const getIconCard = (event: Event, medals: any[]) => {
  // Vérification si l'événement est programmé ou reprogrammé
  if ([EventStatus.Scheduled, EventStatus.Rescheduled].includes(event.status)) {
    return <Clock />;
  }

  // Vérification si l'événement est terminé
  if (event.status === EventStatus.Finished) {
    if (medals.length > 0) {
      return (
        <div className="flex justify-end">
          {medals.map((medal: any) => medal)}
        </div>
      );
    } else if (didCountryWinEvent(event, "FRA")) {
      return <PartyPopper />;
    } else {
      return <Check />;
    }
  }

  return <></>;
};

export function getMedalColor(medalTypes: string[] | undefined): JSX.Element[] {
  if (!medalTypes) return [];

  return medalTypes
    .map((medal) => {
      switch (medal) {
        case "ME_GOLD":
          return <Medal key={medal} className="text-yellow-400 size-10" />;
        case "ME_SILVER":
          return <Medal key={medal} className="text-gray-400 size-10" />;
        case "ME_BRONZE":
          return <Medal key={medal} className="text-amber-900 size-10" />;
        default:
          return null;
      }
    })
    .filter(Boolean) as JSX.Element[];
}

export function getFlagUrl(countryCode: string): string {
  if (!countryCode) return "";
  return process.env.NEXT_PUBLIC_FLAG_API + countryCode.toLowerCase() + ".png";
}
