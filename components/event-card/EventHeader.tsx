import React from "react";
import { Event, EventStatus } from "@/interfaces/Event";
import Image from "next/image";
import { getIconCard } from "@/utils/utils";
import { Rings } from "react-loader-spinner";

interface EventHeaderProps {
  event: Event;
  getIconUrl: (disciplineCode: string) => string | null;
  medals: JSX.Element[];
}

const EventHeader: React.FC<EventHeaderProps> = ({
  event,
  getIconUrl,
  medals,
}) => {
  const iconUrl = getIconUrl(event.disciplineCode);

  return (
    <div className="flex items-center lg:mb-4 mb-2 justify-between w-full">
      <div className="flex items-center">
        {iconUrl && (
          <Image
            width={0}
            height={0}
            src={iconUrl}
            alt={event.disciplineName}
            className="lg:size-10 size-8 lg:mr-4 mr-2"
          />
        )}
        <h2 className="lg:text-xl text-lg font-semibold">
          {event.disciplineName}
        </h2>
      </div>
      {getIconCard(event, medals)}
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
  );
};

export default EventHeader;
