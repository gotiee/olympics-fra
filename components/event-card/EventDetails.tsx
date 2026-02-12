import React from "react";
import { Event, EventStatus } from "@/interfaces/Event";
import { MapPin, MonitorPlay } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { TVChannel } from "@/interfaces/TV";
import { DirectLinkResult } from "@/hooks/useDirectLink";

interface EventDetailsProps {
  event: Event;
  directs: DirectLinkResult[];
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, directs }) => (
  <div className="lg:min-h-24 min-h-8 text-base lg:mb-2 mb-1">
    <div className="lg:mb-2 mb-1 lg:text-lg text-sm">
      <p>{event.eventUnitName}</p>
    </div>
    <p className="flex lg:text-sm text-xs items-center">
      <MapPin className="mr-1 size-3" /> {event.venueDescription}
    </p>
    <div className="flex flex-col lg:text-lg text-sm  mb-2">
      {directs &&
        [
          EventStatus.Running,
          EventStatus.Interupted,
          EventStatus.GettingReady,
        ].includes(event.status) &&
        directs.map((direct) => (
          <Button
            variant="outline"
            asChild
            className="p-2 h-8 mt-2"
            key={direct.channelKey}
          >
            <Link
              href={direct.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center py-5"
            >
              <div className="lg:size-8 size-5 mr-2">
                <MonitorPlay className=" lg:size-8 size-6" />{" "}
              </div>
              <p className="lg:text-base text-sm hover:underline">
                Regarder en direct sur
              </p>
              <Image
                width={800}
                height={800}
                className="w-9 ml-2 p-1"
                src={direct.logo}
                alt="logo-chaine"
              />
            </Link>
          </Button>
        ))}
    </div>
  </div>
);

export default EventDetails;
