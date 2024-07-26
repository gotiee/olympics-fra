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

export enum EventStatus {
  All = "All",
  InProgress = "En cours",
  Finished = "Terminée",
  Interupted = "Interruption programmée",
  Scheduled = "Programmée",
  Preparing = "En préparation",
}

export enum EventStatusV2 {
  Finished = "FINISHED",
  InProgress = "IN_PROGRESS",
  Scheduled = "SCHEDULED",
  Interupted = "INTERUPTED",
  Preparing = "PREPARING",
}
