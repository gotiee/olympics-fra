import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EventCard } from "@/components/ui/event-card";
import { Event } from "@/interfaces/Event";
import { firstLetterToUpperCase, getDateFromString } from "@/utils/utils";
import { FranceTv } from "@/interfaces/FranceTv";

interface EventListProps {
  readonly filteredEventsByDate: { [key: string]: Event[] };
  readonly toggleDay: (date: string) => void;
  readonly isDayCollapsed: (date: string) => boolean;
  readonly getIconUrl: (disciplineCode: string) => string;
  readonly franceTv: FranceTv | undefined;
}

const EventList: React.FC<EventListProps> = React.memo(
  ({
    filteredEventsByDate,
    toggleDay,
    isDayCollapsed,
    getIconUrl,
    franceTv,
  }) => (
    <>
      {Object.entries(filteredEventsByDate).map(([date, events]) => (
        <div key={date} className="mb-2">
          <Accordion
            type="single"
            collapsible
            onValueChange={() => toggleDay(date)}
            value={!isDayCollapsed(date) ? "item-1" : ""}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg">
                {firstLetterToUpperCase(
                  new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "full",
                  }).format(new Date(getDateFromString(date)))
                )}
              </AccordionTrigger>
              <AccordionContent>
                {!isDayCollapsed(date) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event) => (
                      <EventCard
                        franceTv={franceTv}
                        key={event.id}
                        event={event}
                        getIconUrl={getIconUrl}
                      />
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </>
  )
);

EventList.displayName = "EventList";

export { EventList };
