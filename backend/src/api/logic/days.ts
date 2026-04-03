import { error } from "console";
import { controller } from "../../database/db";
import { CalendarDate, CalendarDay } from "@shared/types";
import { getEventsForDayWithID } from "./events";

export async function getDayWithID(id: number): Promise<CalendarDay> {
  const result = await controller.query(
    `SELECT * FROM CalendarDay WHERE id = $1`,
    [id],
  );

  if (result.rowCount == 0) {
    throw new Error(`No event found with ID ${id}`);
  }

  const row = result.rows[0];

  const required_fields = ["id", "calendarid", "dayday", "daymonth", "dayyear"];

  for (const r_field of required_fields) {
    if (!(r_field in row)) {
      throw new Error(
        `Comment doesn't contain all fields. ${row} is missing ${r_field}`,
      );
    }
  }

  const returnedEvent: CalendarDay = {
    date: {
      day: row.dayday,
      month: row.daymonth,
      year: row.dayyear,
    } as CalendarDate,
    id: row.id,
    events: await getEventsForDayWithID(id),
  };

  return returnedEvent;
}

export async function getDaysWithCalendarID(
  id: number,
): Promise<CalendarDay[]> {
  const result = await controller.query(
    `SELECT * FROM CalendarDay WHERE calendarid = $1`,
    [id],
  );

  if (result.rowCount == 0) {
    throw new Error(`No event found with ID ${id}`);
  }

  const rows = result.rows;

  const required_fields = ["id", "calendarid", "dayday", "daymonth", "dayyear"];

  for (const row of rows) {
    for (const r_field of required_fields) {
      if (!(r_field in row)) {
        throw new Error(
          `Comment doesn't contain all fields. ${row} is missing ${r_field}`,
        );
      }
    }
  }

  const returnedEvents: CalendarDay[] = await Promise.all(
    rows.map(async (row) => {
      return {
        date: {
          day: row.dayday,
          month: row.daymonth,
          year: row.dayyear,
        } as CalendarDate,
        id: row.id,
        events: await getEventsForDayWithID(row.id),
      };
    }),
  );

  return returnedEvents;
}

export async function getCalendarDayIDByDate(d: CalendarDate, cID: number) {
  const result = await controller.query(
    `SELECT * FROM calendarday WHERE dayday = $1 AND daymonth = $2 AND dayyear = $3;`,
    [d.day, d.month, d.year],
  );

  if (result.rowCount == 0) {
    return await createDayWithCalendarID(cID, d);
  } else {
    return result.rows[0].id;
  }
}

export async function createDayWithCalendarID(
  calendarID: number,
  newCalendarDay: CalendarDate,
): Promise<number> {
  const result = await controller.query(
    `INSERT INTO calendarday (calendarid, dayday, daymonth, dayyear) VALUES ($1, $2, $3, $4) RETURNING *`,
    [calendarID, newCalendarDay.day, newCalendarDay.month, newCalendarDay.year],
  );

  if (result.rowCount == 0) {
    throw new Error(
      `Could not create calendar date ${newCalendarDay.month}/${
        newCalendarDay.day
      }/${newCalendarDay.year} for calendar with id ${calendarID}`,
    );
  }

  const row = result.rows[0];

  const required_fields = ["id"];

  for (const r_field of required_fields) {
    if (!(r_field in row)) {
      throw new Error(
        `Comment doesn't contain all fields. ${row} is missing ${r_field}`,
      );
    }
  }

  return row.id;
}
