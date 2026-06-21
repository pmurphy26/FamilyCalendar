"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventWithID = getEventWithID;
exports.getEventsForDayWithID = getEventsForDayWithID;
exports.addEventsToDB = addEventsToDB;
exports.updateEventInDB = updateEventInDB;
exports.deleteEventFromDB = deleteEventFromDB;
const db_1 = require("../../database/db");
const transportation_1 = require("./transportation");
async function getEventWithID(id) {
    try {
        const result = await db_1.controller.query(`SELECT * FROM calendar_event WHERE id = $1`, [id]);
        if (result.rowCount == 0) {
            throw new Error(`No event found with ID ${id}`);
        }
        const row = result.rows[0];
        const required_fields = [
            "id",
            "calendar_day_id",
            "event_title",
            "event_start_hour",
            "event_start_minute",
            "event_start_is_am",
            "event_end_hour",
            "event_end_minute",
            "event_end_is_am",
            "event_location",
            "created_by_id",
        ];
        for (const r_field of required_fields) {
            if (!(r_field in row)) {
                throw new Error(`Comment doesn't contain all fields. ${row} is missing ${r_field}`);
            }
        }
        const returnedEvent = {
            id: row?.id ?? -1,
            //"calendardayid",
            title: row.event_title,
            startTime: {
                hour: row.event_start_hour,
                minute: row.event_start_minute,
                isAM: row.event_start_is_am,
            },
            endTime: {
                hour: row.event_end_hour,
                minute: row.event_end_minute,
                isAM: row.event_end_is_am,
            },
            location: row.event_location,
            createdBy: { id: row.created_by_id },
            notes: row.event_notes ?? "",
        };
        if (row.for_id) {
            const forResult = await db_1.controller.query(`SELECT * FROM family_individuals WHERE id = $1`, [row.for_id]);
            if (forResult.rows.length > 0) {
                const r = forResult.rows[0];
                const forIndividual = {
                    id: r.id,
                    role: r.individual_role,
                    name: r.individual_name,
                    canDrive: r.can_drive,
                    canEditCalendar: r.can_edit,
                    ...(r.color_str && { colorStr: r.color_str }),
                };
                returnedEvent.for = { ...forIndividual };
            }
        }
        return returnedEvent;
    }
    catch (err) {
        console.error(err);
    }
    return null;
}
async function getEventsForDayWithID(id) {
    try {
        const result = await db_1.controller.query(`SELECT 
        ce.*,
        jsonb_object_agg(
          tfe.is_arrival,
          tfe.id
        ) FILTER (WHERE tfe.id IS NOT NULL) AS transportation
      FROM calendar_event ce
      LEFT JOIN transportation_for_event tfe
        ON tfe.event_id = ce.id
      WHERE ce.calendar_day_id = $1
      GROUP BY ce.id;`, [id]);
        if (result.rowCount == 0) {
            return [];
        }
        const allResults = result.rows;
        const required_fields = [
            "id",
            "calendar_day_id",
            "event_title",
            "event_start_hour",
            "event_start_minute",
            "event_start_is_am",
            "event_end_hour",
            "event_end_minute",
            "event_end_is_am",
            "event_location",
            "created_by_id",
            "transportation",
        ];
        const allEvents = await Promise.all(allResults.map(async (row) => {
            for (const r_field of required_fields) {
                if (!(r_field in row)) {
                    throw new Error(`Event ${row} doesn't contain all fields. ${row} is missing ${r_field}`);
                }
            }
            const returnedEvent = {
                id: row?.id ?? -1,
                //"calendardayid",
                title: row.event_title,
                startTime: {
                    hour: row.event_start_hour,
                    minute: row.event_start_minute,
                    isAM: row.event_start_is_am,
                },
                endTime: {
                    hour: row.event_end_hour,
                    minute: row.event_end_minute,
                    isAM: row.event_end_is_am,
                },
                location: row.event_location,
                createdBy: { id: row.created_by_id },
                notes: row.event_notes ?? "",
            };
            if (row.for_id) {
                const forResult = await db_1.controller.query(`SELECT * FROM family_individuals WHERE id = $1`, [row.for_id]);
                if (forResult.rows.length > 0) {
                    const r = forResult.rows[0];
                    const forIndividual = {
                        id: r.id,
                        role: r.individual_role,
                        name: r.individual_name,
                        canDrive: r.can_drive,
                        canEditCalendar: r.can_edit,
                        ...(r.color_str && { colorStr: r.color_str }),
                    };
                    returnedEvent.for = { ...forIndividual };
                }
            }
            try {
                /*console.log(
                  `Searching for transportation for calendar event with id ${
                    row.id
                  }, title ${row.event_title}, and vehicle id ${JSON.stringify(row.transportation)}`,
                );*/
                if (row.transportation) {
                    const arrivalID = row.transportation.true ?? -1;
                    const departureID = row.transportation.false ?? -1;
                    if (arrivalID != -1) {
                        const vehicleSituation = await (0, transportation_1.getTransportationWithID)(arrivalID);
                        if (vehicleSituation) {
                            returnedEvent.drivingSituation = {
                                ...returnedEvent.drivingSituation,
                                arrival: { ...vehicleSituation },
                            };
                        }
                    }
                    if (departureID != -1) {
                        const vehicleSituation = await (0, transportation_1.getTransportationWithID)(departureID);
                        if (vehicleSituation) {
                            returnedEvent.drivingSituation = {
                                ...returnedEvent.drivingSituation,
                                departure: { ...vehicleSituation },
                            };
                        }
                    }
                }
            }
            catch (err) {
                console.error(err);
            }
            return returnedEvent;
        }));
        return allEvents;
    }
    catch (err) {
        console.error(err);
        return [];
    }
}
async function addEventsToDB(events) {
    try {
        const addedEvents = {};
        await Promise.all(Object.entries(events).flatMap(async ([dayIDStr, eventsOnDay]) => {
            const dayID = Number(dayIDStr);
            const eod = [];
            await Promise.all(eventsOnDay.map(async (event) => {
                const res = await db_1.controller.query(`INSERT INTO calendar_event 
            (
            calendar_day_id, 
            event_title, 
            event_start_hour, 
            event_start_minute, 
            event_start_is_am,
            event_end_hour, 
            event_end_minute, 
            event_end_is_am, 
            event_location, 
            event_notes, 
            created_by_id
            ${event.for ? ", for_id" : ""}) 
            VALUES (
            $1, $2, $3, $4, $5, $6, $7, 
            $8, $9, $10, $11${event.for ? ", $12" : ""})
            RETURNING id;`, [
                    //event.id,
                    dayID,
                    event.title,
                    event.startTime.hour,
                    event.startTime.minute,
                    event.startTime.isAM,
                    event.endTime.hour,
                    event.endTime.minute,
                    event.endTime.isAM,
                    event.location,
                    event.notes,
                    event.createdBy.id,
                    ...(event.for ? [event.for.id] : []),
                ]);
                if (res.rowCount == 0) {
                    return;
                }
                eod.push({ ...event, id: res.rows[0].id });
            }));
            addedEvents[dayID] = eod;
        }));
        return addedEvents;
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(`Error while inserting events: ${err.message}`);
        }
        else {
            console.error(`Unknown error while inserting events`);
        }
        return {};
    }
}
async function updateEventInDB(event, calendarDayID) {
    try {
        const result = await db_1.controller.query(`UPDATE calendar_event
    SET
      event_title = $2,
      event_start_hour = $3,
      event_start_minute = $4,
      event_start_is_am = $5,
      event_end_hour = $6,
      event_end_minute = $7,
      event_end_is_am = $8,
      event_location = $9,
      created_by_id = $10,
      event_notes = $11
      ${event.for ? `, for_id = $12` : ""}
      ${calendarDayID != null
            ? `, calendar_day_id = ${event.for ? "$13" : "$12"}`
            : ""}
    WHERE id = $1
    RETURNING *;`, [
            event.id,
            event.title,
            event.startTime.hour,
            event.startTime.minute,
            event.startTime.isAM,
            event.endTime.hour,
            event.endTime.minute,
            event.endTime.isAM,
            event.location,
            event.createdBy.id,
            ...(event.notes ? [event.notes] : [null]),
            ...(event.for && Object.keys(event.for).length > 0
                ? [event.for.id]
                : []),
            ...(calendarDayID != null ? [calendarDayID] : []),
        ]);
        if (result.rows.length == 0) {
            return -1;
        }
        return result.rows[0]?.calendar_day_id ?? -1;
    }
    catch (err) {
        console.error(err);
        return -1;
    }
}
async function deleteEventFromDB(eventID) {
    const res = await db_1.controller.query(`DELETE FROM calendar_event WHERE id=$1`, [
        eventID,
    ]);
    if (res.rowCount == 0) {
        throw new Error(`Could not find event to delete with id ${eventID}`);
    }
    return true;
}
