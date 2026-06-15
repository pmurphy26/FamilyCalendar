import { CalendarDate, CalendarDay } from "@shared/types";
export declare function getDayWithID(id: number): Promise<CalendarDay | null>;
export declare function getDaysWithCalendarID(id: number): Promise<CalendarDay[]>;
export declare function getCalendarDayIDByDate(d: CalendarDate, cID: number): Promise<number>;
export declare function createDayWithCalendarID(calendarID: number, newCalendarDay: CalendarDate): Promise<CalendarDay | null>;
