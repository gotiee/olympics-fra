import { Competitor } from "./Competitor";

export interface Event {
  id: string;
  disciplineName: string;
  eventUnitName: string;
  startDate: string;
  venueDescription: string;
  status: EventStatusV2;
  statusDescription: EventStatus;
  disciplineCode: string;
  competitors: Competitor[];
}

export interface EventsResponse {
  units: Event[];
}

export enum EventStatus {
  All = "All",
  InProgress = "En cours",
  Finished = "Terminée",
  Interupted = "Interruption programmée",
  Scheduled = "Programmée",
  Preparing = "En préparation",
}

export enum EventStatusV2 {
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
