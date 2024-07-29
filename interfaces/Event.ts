import { Competitor } from "./Competitor";

export interface Event {
  id: string;
  disciplineName: string;
  eventUnitName: string;
  startDate: string;
  venueDescription: string;
  status: EventStatus;
  statusDescription: string;
  disciplineCode: string;
  competitors: Competitor[];
}

export interface EventsResponse {
  units: Event[];
}

export enum EventStatus {
  All = "ALL",
  Cancelled = "CANCELLED",
  Finished = "FINISHED",
  Running = "RUNNING",
  Scheduled = "SCHEDULED",
  Interupted = "SCHEDULED_BREAK",
  GettingReady = "GETTING_READY",
  Rescheduled = "RESCHEDULED",
  Delayed = "DELAYED",
}
