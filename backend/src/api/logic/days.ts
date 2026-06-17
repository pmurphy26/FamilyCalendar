import { error } from "console";
import { controller } from "../../database/db";
import { CalendarDate, CalendarDay } from "@shared/types";
import { getEventsForDayWithID } from "./events";

export async function getDayWithID(id: number): Promise<CalendarDay | null> {
  try {
    const result = await controller.query(
      `SELECT * FROM calendar_day WHERE id = $1`,
      [id],
    );

    if (result.rowCount == 0) {
      throw new Error(`No event found with ID ${id}`);
    }

    const row = result.rows[0];

    const required_fields = [
      "id",
      "calendar_id",
      "day_day",
      "day_month",
      "day_year",
    ];

    for (const r_field of required_fields) {
      if (!(r_field in row)) {
        throw new Error(
          `Comment doesn't contain all fields. ${row} is missing ${r_field}`,
        );
      }
    }

    const returnedEvent: CalendarDay = {
      date: {
        day: row.day_day,
        month: row.day_month,
        year: row.day_year,
      },
      id: row.id,
      events: await getEventsForDayWithID(id),
    };

    return returnedEvent;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getDaysWithCalendarID(
  id: number,
): Promise<CalendarDay[]> {
  try {
    const result = await controller.query(
      `SELECT * FROM calendar_day WHERE calendar_id = $1`,
      [id],
    );

    if (result.rowCount == 0) {
      //throw new Error(`No event found with ID ${id}`);
      return [];
    }

    const rows = result.rows;

    const required_fields = [
      "id",
      "calendar_id",
      "day_day",
      "day_month",
      "day_year",
    ];

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
            day: row.day_day,
            month: row.day_month,
            year: row.day_year,
          },
          id: row.id,
          events: await getEventsForDayWithID(row.id),
        };
      }),
    );

    return returnedEvents;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getCalendarDayIDByDate(
  d: CalendarDate,
  cID: number,
): Promise<number> {
  try {
    const result = await controller.query(
      `SELECT * 
      FROM calendar_day 
      WHERE 
        day_day = $1 AND 
        day_month = $2 AND
        day_year = $3 AND
        calendar_id = $4;`,
      [d.day, d.month, d.year, cID],
    );

    if (result.rowCount == 0) {
      const newDay = await createDayWithCalendarID(cID, d);
      return newDay?.id ?? -1;
    } else {
      return result.rows[0].id;
    }
  } catch (err) {
    console.error(err);
    return -1;
  }
}

export async function createDayWithCalendarID(
  calendarID: number,
  newCalendarDay: CalendarDate,
): Promise<CalendarDay | null> {
  try {
    const checkDayDoesNotExist = await controller.query(
      `SELECT * 
      FROM calendar_day 
      WHERE 
        calendar_id = $1 AND
        day_day = $2 AND
        day_month = $3 AND
        day_year = $4;`,
      [
        calendarID,
        newCalendarDay.day,
        newCalendarDay.month,
        newCalendarDay.year,
      ],
    );

    if (checkDayDoesNotExist.rowCount == 0) {
      const result = await controller.query(
        `INSERT INTO calendar_day (
        calendar_id, 
        day_day,
        day_month,
        day_year
      ) VALUES ($1, $2, $3, $4) 
      RETURNING *;`,
        [
          calendarID,
          newCalendarDay.day,
          newCalendarDay.month,
          newCalendarDay.year,
        ],
      );

      if (result.rowCount == 0) {
        throw new Error(
          `Could not create calendar date ${newCalendarDay.month}/${
            newCalendarDay.day
          }/${newCalendarDay.year} for calendar with id ${calendarID}`,
        );
      }

      const row = result.rows[0];

      const required_fields = [
        "id",
        "calendar_id",
        "day_day",
        "day_month",
        "day_year",
      ];

      for (const r_field of required_fields) {
        if (!(r_field in row)) {
          throw new Error(
            `Comment doesn't contain all fields. ${row} is missing ${r_field}`,
          );
        }
      }

      return {
        id: row.id,
        date: newCalendarDay,
        events: [],
      };
    }

    return {
      id: checkDayDoesNotExist.rows[0].id,
      date: newCalendarDay,
      events: [],
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}
