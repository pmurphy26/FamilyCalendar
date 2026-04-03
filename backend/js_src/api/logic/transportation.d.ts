import { TransportationForEvent } from "@shared/types";
export declare function getTransportationWithEventID(id: number): Promise<TransportationForEvent>;
export declare function addTransportationsToDB(transportations: Record<number, TransportationForEvent>): Promise<void>;
export declare function alterTransportation(eventID: number, transportationForEvent: TransportationForEvent): Promise<void>;
