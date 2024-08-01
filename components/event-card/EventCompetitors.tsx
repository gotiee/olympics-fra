import React from "react";
import { Event, EventStatus } from "@/interfaces/Event";
import { getFlagUrl } from "@/utils/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Competitor } from "@/interfaces/Competitor";

interface EventCompetitorsProps {
  event: Event;
  showCompetitors: boolean;
  toggleCompetitors: () => void;
}

const EventCompetitors: React.FC<EventCompetitorsProps> = ({
  event,
  showCompetitors,
  toggleCompetitors,
}) => {
  const displayDetailedMark = (competitor: Competitor) =>
    competitor?.results?.detailedMark !== undefined &&
    [EventStatus.Running, EventStatus.Interupted].includes(event.status);

  return (
    <Accordion type="single" collapsible onValueChange={toggleCompetitors}>
      <AccordionItem value="item-1 mt-1">
        <AccordionTrigger>
          {showCompetitors ? "Cacher les résultats" : "Afficher les résultats"}
        </AccordionTrigger>
        <AccordionContent>
          {event.competitors.map((competitor) => (
            <div key={competitor?.name} className="mt-2 flex">
              <p className="flex">
                <picture>
                  <img
                    src={getFlagUrl(competitor?.noc)}
                    alt={competitor?.noc}
                    className="h-5 mr-2"
                  />
                </picture>
                {`${
                  competitor?.results?.position !== "" &&
                  competitor?.results?.position !== undefined
                    ? `${competitor?.results?.position} -`
                    : `${competitor?.order + 1} -`
                } ${competitor?.name} ${
                  competitor?.results?.mark !== undefined
                    ? `: ${competitor?.results?.mark}`
                    : ``
                } ${
                  displayDetailedMark(competitor)
                    ? ` | ${
                        competitor?.results?.detailedMark[
                          competitor?.results?.detailedMark.length - 1
                        ][0]
                      }`
                    : ``
                }`}
              </p>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default EventCompetitors;
