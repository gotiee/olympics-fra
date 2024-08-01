import React, { useRef, useState } from "react";
import Confetti from "react-confetti";
import { useMeasure } from "react-use";
import { Event, EventStatus } from "@/interfaces/Event";
import { Competitor } from "@/interfaces/Competitor";

import useDirectLink from "@/hooks/useDirectLink";
import {
  getMedalColor,
  didCountryWinEventMedal,
  didCountryWinEvent,
} from "@/utils/utils";
import { FranceTv } from "@/interfaces/FranceTv";
import EventHeader from "./event-card/EventHeader";
import EventDetails from "./event-card/EventDetails";
import EventCompetitors from "./event-card/EventCompetitors";
import { cn } from "@/lib/utils";

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

    const confettiRef = useRef<HTMLCanvasElement>(null);

    const medals = getMedalColor(
      didCountryWinEventMedal(event, "FRA")?.map(
        (e: Competitor) => e.results?.medalType
      )
    );

    const getStatusColor = (eventStatus: EventStatus): string => {
      console.log(eventStatus);
      switch (eventStatus) {
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

    const statusColor = getStatusColor(event.status);

    return (
      <div
        ref={ref as React.LegacyRef<HTMLDivElement>}
        className={cn(`border p-4 rounded shadow relative ${statusColor}`)}
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
        <EventHeader event={event} getIconUrl={getIconUrl} medals={medals} />
        <EventDetails event={event} direct={direct} />
        <EventCompetitors
          event={event}
          showCompetitors={showCompetitors}
          toggleCompetitors={toggleCompetitors}
        />
      </div>
    );
  }
);

EventCard.displayName = "EventCard";

export { EventCard };
