import { TransportationForEvent } from "@shared/types";
export declare function getTransportationWithID(id: number): Promise<TransportationForEvent | null>;
export declare function getTransportationWithEventID(id: number): Promise<TransportationForEvent | null>;
export declare function addTransportationsToDB(transportations: Record<number, Record<string, TransportationForEvent>>): Promise<void>;
export declare function alterTransportation(eventID: number, transportationForEvent: TransportationForEvent, isArrival?: boolean): Promise<boolean>;
