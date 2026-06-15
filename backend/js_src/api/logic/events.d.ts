import { CalendarEvent } from "@shared/types";
export declare function getEventWithID(id: number): Promise<CalendarEvent | null>;
export declare function getEventsForDayWithID(id: number): Promise<CalendarEvent[]>;
export declare function addEventsToDB(events: Record<number, CalendarEvent[]>): Promise<boolean>;
export declare function updateEventInDB(event: CalendarEvent, calendarDayID?: number): Promise<Number>;
