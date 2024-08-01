import React from "react";
import { Event, EventStatus } from "@/interfaces/Event";
import { MapPin, MonitorPlay } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

interface EventDetailsProps {
  event: Event;
  direct: any;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, direct }) => (
  <div className="lg:min-h-24 min-h-8 text-base lg:mb-2 mb-1">
    <div className="lg:mb-2 mb-1 lg:text-lg text-sm">
      <p>{event.eventUnitName}</p>
    </div>
    <p className="flex lg:text-sm text-xs items-center">
      <MapPin className="mr-1 size-3" /> {event.venueDescription}
    </p>
    <div className="flex lg:text-lg text-sm items-center mb-2">
      {direct &&
        [
          EventStatus.Running,
          EventStatus.Interupted,
          EventStatus.GettingReady,
        ].includes(event.status) && (
          <Button variant="outline" asChild className="p-2 h-8 mt-2">
            <Link
              href={direct.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center "
            >
              <div className="lg:size-8 size-5 mr-2">
                <MonitorPlay className=" lg:size-8 size-6" />{" "}
              </div>
              <p className="lg:text-base text-sm hover:underline">
                Regarder en direct sur
              </p>
              <Image
                width={0}
                height={0}
                className="lg:size-12 size-8 ml-2"
                src={
                  direct.channel.includes("france")
                    ? direct.logo.replace("-invert", "")
                    : direct.logo
                }
                alt="logo-chaine"
              />
            </Link>
          </Button>
        )}
    </div>
  </div>
);

export default EventDetails;
