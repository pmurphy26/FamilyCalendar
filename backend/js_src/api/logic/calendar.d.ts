import { Calendar } from "@shared/types";
export declare function getCalendarWithID(id: number): Promise<Calendar | null>;
export declare function getCalendarForFamilyWithID(id: number): Promise<Calendar | null>;
export declare function createCalendarWithFamilyID(familyID: number, calendarName?: string): Promise<Calendar | null>;
