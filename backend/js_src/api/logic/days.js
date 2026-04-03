"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDayWithID = getDayWithID;
exports.getDaysWithCalendarID = getDaysWithCalendarID;
exports.getCalendarDayIDByDate = getCalendarDayIDByDate;
exports.createDayWithCalendarID = createDayWithCalendarID;
const db_1 = require("../../database/db");
const events_1 = require("./events");
async function getDayWithID(id) {
    const result = await db_1.controller.query(`SELECT * FROM CalendarDay WHERE id = $1`, [id]);
    if (result.rowCount == 0) {
        throw new Error(`No event found with ID ${id}`);
    }
    const row = result.rows[0];
    const required_fields = ["id", "calendarid", "dayday", "daymonth", "dayyear"];
    for (const r_field of required_fields) {
        if (!(r_field in row)) {
            throw new Error(`Comment doesn't contain all fields. ${row} is missing ${r_field}`);
        }
    }
    const returnedEvent = {
        date: {
            day: row.dayday,
            month: row.daymonth,
            year: row.dayyear,
        },
        id: row.id,
        events: await (0, events_1.getEventsForDayWithID)(id),
    };
    return returnedEvent;
}
async function getDaysWithCalendarID(id) {
    const result = await db_1.controller.query(`SELECT * FROM CalendarDay WHERE calendarid = $1`, [id]);
    if (result.rowCount == 0) {
        throw new Error(`No event found with ID ${id}`);
    }
    const rows = result.rows;
    const required_fields = ["id", "calendarid", "dayday", "daymonth", "dayyear"];
    for (const row of rows) {
        for (const r_field of required_fields) {
            if (!(r_field in row)) {
                throw new Error(`Comment doesn't contain all fields. ${row} is missing ${r_field}`);
            }
        }
    }
    const returnedEvents = await Promise.all(rows.map(async (row) => {
        return {
            date: {
                day: row.dayday,
                month: row.daymonth,
                year: row.dayyear,
            },
            id: row.id,
            events: await (0, events_1.getEventsForDayWithID)(row.id),
        };
    }));
    return returnedEvents;
}
async function getCalendarDayIDByDate(d, cID) {
    const result = await db_1.controller.query(`SELECT * FROM calendarday WHERE dayday = $1 AND daymonth = $2 AND dayyear = $3;`, [d.day, d.month, d.year]);
    if (result.rowCount == 0) {
        return await createDayWithCalendarID(cID, d);
    }
    else {
        return result.rows[0].id;
    }
}
async function createDayWithCalendarID(calendarID, newCalendarDay) {
    const result = await db_1.controller.query(`INSERT INTO calendarday (calendarid, dayday, daymonth, dayyear) VALUES ($1, $2, $3, $4) RETURNING *`, [calendarID, newCalendarDay.day, newCalendarDay.month, newCalendarDay.year]);
    if (result.rowCount == 0) {
        throw new Error(`Could not create calendar date ${newCalendarDay.month}/${newCalendarDay.day}/${newCalendarDay.year} for calendar with id ${calendarID}`);
    }
    const row = result.rows[0];
    const required_fields = ["id"];
    for (const r_field of required_fields) {
        if (!(r_field in row)) {
            throw new Error(`Comment doesn't contain all fields. ${row} is missing ${r_field}`);
        }
    }
    return row.id;
}
