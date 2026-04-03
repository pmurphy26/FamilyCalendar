import { mockEvents } from "./mockData";
import type {
  CalendarDay,
  CalendarDate,
  CalendarEvent,
} from "../../../shared/types";

export const daysInMonthDict = (month: number, year: number): number => {
  switch (month) {
    case 1:
      return 31;
    case 2:
      return year % 4 == 0 ? 29 : 28;
    case 3:
      return 31;
    case 4:
      return 30;
    case 5:
      return 31;
    case 6:
      return 30;
    case 7:
      return 31;
    case 8:
      return 31;
    case 9:
      return 30;
    case 10:
      return 31;
    case 11:
      return 30;
    case 12:
      return 31;
    default:
      console.log(`${month} was inputed as the current month`);
      return 31;
  }
};

export function getPrevMonth(
  month: number,
  year: number,
): { month: number; year: number } {
  return {
    month: month != 1 ? month - 1 : 12,
    year: month != 1 ? year : year - 1,
  };
}

export function getWeekPeriod(
  firstDayOfMonth: number,
  selectedDay: CalendarDate,
): {
  periodStart: CalendarDate;
  periodEnd: CalendarDate;
} {
  if (selectedDay == null) {
    return {
      periodStart: { day: 1, month: 1, year: 2026 },
      periodEnd: { day: 7, month: 1, year: 2026 },
    };
  }

  const ps =
    Math.floor((selectedDay.day - 1 + firstDayOfMonth) / 7) * 7 +
    1 -
    firstDayOfMonth;

  const prevMonth = getPrevMonth(selectedDay.month, selectedDay.year);
  //console.log(prevMonth);
  const periodStart = {
    day: ps > 0 ? ps : ps + daysInMonthDict(prevMonth.month, prevMonth.year),
    month:
      ps > 0
        ? selectedDay.month
        : selectedDay.month == 1
          ? 12
          : selectedDay.month - 1,
    year:
      ps < 0 && selectedDay.month == 0
        ? selectedDay.year - 1
        : selectedDay.year,
  };
  const daysInMonth = daysInMonthDict(selectedDay.month, selectedDay.year);
  const periodEnd = {
    day:
      ps > 0
        ? //period start in same month as selected
          periodStart.day + 6 <= daysInMonth
          ? //period end in same month as start
            periodStart.day + 6
          : //period end in different month as start
            periodStart.day + 6 - daysInMonth
        : //period start in previous month
          periodStart.day +
          6 - //days in prev month
          daysInMonthDict(prevMonth.month, prevMonth.year),
    month:
      ps > 0
        ? //period start in same month as selected
          periodStart.day + 6 <= daysInMonth
          ? //period end in same month as start
            periodStart.month
          : //period end in different month as start
            periodStart.month + 1
        : //period start in previous month
          periodStart.month + 1,
    year: 2026,
  };

  /*console.log(
    `selected new start and end of ${periodStart.month}/${periodStart.day}, ${
      periodEnd.month
    }/${periodEnd.day} for selected day ${selectedDay}.`,
  );*/

  return {
    periodStart: periodStart,
    periodEnd: periodEnd,
  };
}

export function getNextWeek(
  periodStart: CalendarDate,
  selectedDay: CalendarDate,
  periodEnd: CalendarDate,
): {
  newPeriodStart: CalendarDate;
  selectedDay: number;
  newPeriodEnd: CalendarDate;
  month?: number;
  year?: number;
} {
  const daysInMonth = daysInMonthDict(selectedDay.month, selectedDay.year);

  return {
    newPeriodStart: {
      day:
        periodStart.month == selectedDay.month
          ? periodStart.day + 7 <= daysInMonth
            ? periodStart.day + 7
            : periodStart.day + 7 - daysInMonth
          : //period start is in different month from selected day
            periodStart.day +
            7 -
            daysInMonthDict(periodStart.month - 1, periodStart.year),
      month:
        periodStart.month != selectedDay.month //period start is in same month as selected day
          ? periodStart.day + 7 <= daysInMonth
            ? periodStart.month
            : periodStart.month + 1
          : //period start is in different month from selected day
            periodStart.month + 1,
      year: 2026,
    } as CalendarDate,
    newPeriodEnd: {
      day:
        periodEnd.month != selectedDay.month //period end is in same month as selected day
          ? periodEnd.day + 7 <= daysInMonth
            ? periodEnd.day + 7
            : periodEnd.day + 7 - daysInMonth
          : //period start is in different month from selected day
            periodEnd.day + 7,
      month:
        periodEnd.month != selectedDay.month //period end is in same month as selected day
          ? periodEnd.day + 7 <= daysInMonth
            ? periodEnd.month
            : periodEnd.month + 1
          : //period start is in different month from selected day
            periodEnd.month,
      year: 2026,
    } as CalendarDate,
    selectedDay:
      selectedDay.day + 7 > daysInMonth
        ? selectedDay.day + 7 - daysInMonth
        : selectedDay.day + 7,
    ...(selectedDay.day + 7 > daysInMonth && { month: periodStart.month + 1 }),
  };
}

export function getPrevWeek(
  periodStart: CalendarDate,
  selectedDay: CalendarDate,
  periodEnd: CalendarDate,
): {
  newPeriodStart: CalendarDate;
  selectedDay: number;
  newPeriodEnd: CalendarDate;
  month?: number;
  year?: number;
} {
  const prevMonth = getPrevMonth(selectedDay.month, selectedDay.year);
  const daysInPrevMonth = daysInMonthDict(prevMonth.month, prevMonth.year);

  return {
    newPeriodStart: {
      day:
        periodStart.day > 7
          ? periodStart.day - 7
          : periodStart.day - 7 + daysInPrevMonth,
      month:
        periodStart.day > 7
          ? periodStart.month
          : periodStart.month == 1
            ? 12
            : periodStart.month - 1,
      year:
        periodStart.day < 7 && periodStart.month == 1
          ? periodStart.year - 1
          : periodStart.year,
    },
    selectedDay:
      selectedDay.day > 7
        ? selectedDay.day - 7
        : selectedDay.day - 7 + daysInPrevMonth,
    newPeriodEnd: {
      day:
        periodEnd.day > 7
          ? periodEnd.day - 7
          : periodEnd.day - 7 + daysInPrevMonth,
      month: periodEnd.day > 7 ? periodEnd.month : periodEnd.month - 1,
      year:
        periodEnd.day < 7 && periodEnd.month == 1
          ? periodEnd.year - 1
          : periodEnd.year,
    },
    ...(selectedDay.day <= 7 && { month: selectedDay.month - 1 }),
  };
}

export function padNumberWithZeros(num: number, targetLength: number): string {
  return String(num).padStart(targetLength, "0");
}

export const mockPeriod = [
  { date: { day: 22, month: 3, year: 2026 }, events: [] },
  { date: { day: 23, month: 3, year: 2026 }, events: [] },
  { date: { day: 24, month: 3, year: 2026 }, events: [] },
  { date: { day: 25, month: 3, year: 2026 }, events: [] },
  {
    date: { day: 26, month: 3, year: 2026 },
    events: mockEvents,
  } as CalendarDay,
  { date: { day: 27, month: 3, year: 2026 }, events: [] },
  { date: { day: 28, month: 3, year: 2026 }, events: [] },
];

export const monthNumToString: Record<number, string> = {
  1: "January",
  2: " February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

/**
 * Returns 1 if c1 is later, 0 if they equal, -1 if c1 is earlier
 *
 * @param c1
 * @param c2
 * @returns
 */
export function compareDates(c1: CalendarDate, c2: CalendarDate) {
  return c1.year > c2.year
    ? 1
    : c1.year == c2.year
      ? c1.month > c2.month
        ? 1
        : c1.month == c2.month
          ? c1.day > c2.day
            ? 1
            : c1.day == c2.day
              ? 0
              : -1
          : -1
      : -1;
}

export function datesAreEqual(c1: CalendarDate, c2: CalendarDate) {
  return compareDates(c1, c2) == 0;
}

/**
 * Returns -1 if c1 is earlier time, 0 if equal, 1 if c1 is later
 *
 * @param c1
 * @param c2
 * @returns
 */
export function compareTimes(c1: CalendarEvent, c2: CalendarEvent) {
  return c1.time.isAM == c2.time.isAM
    ? c1.time.hour == c2.time.hour
      ? c1.time.minute == c2.time.minute
        ? 0
        : c1.time.minute < c2.time.minute
          ? -1
          : 1
      : c1.time.hour < c2.time.hour
        ? -1
        : 1
    : c1.time.isAM
      ? -1
      : 1;
}

/**
 * Checks if 2 calendar days have the same date
 *
 * @param c1
 * @param c2
 * @returns
 */
export function datesEqual(c1: CalendarDay, c2: CalendarDay): boolean {
  if (
    c1.date.month == c2.date.month &&
    c1.date.year == c2.date.year &&
    c1.date.day == c2.date.day
  ) {
    //console.log("Equal");
    return true;
  }
  return false;
}
