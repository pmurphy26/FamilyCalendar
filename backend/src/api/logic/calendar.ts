import { error } from "console";
import { controller } from "../../database/db";
import { Calendar, CalendarDate, CalendarDay } from "@shared/types";
import { getEventsForDayWithID } from "./events";

export async function getCalendarWithID(id: number): Promise<Calendar> {
  const result = await controller.query(
    `SELECT * FROM Calendar WHERE id = $1`,
    [id],
  );

  if (result.rowCount == 0) {
    throw new Error(`No event found with ID ${id}`);
  }

  const row = result.rows[0];

  const required_fields = ["id", "familyid", "name"];

  for (const r_field of required_fields) {
    if (!(r_field in row)) {
      throw new Error(
        `Comment doesn't contain all fields. ${row} is missing ${r_field}`,
      );
    }
  }

  const res: Calendar = {
    calendarID: row.id,
    calendarName: row.name,
  };

  return res;
}
