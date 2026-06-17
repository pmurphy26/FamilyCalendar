"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalendarWithID = getCalendarWithID;
exports.getCalendarForFamilyWithID = getCalendarForFamilyWithID;
exports.createCalendarWithFamilyID = createCalendarWithFamilyID;
const db_1 = require("../../database/db");
async function getCalendarWithID(id) {
    try {
        const result = await db_1.controller.query(`SELECT * FROM Calendar WHERE id = $1`, [id]);
        if (result.rowCount == 0) {
            throw new Error(`No event found with ID ${id}`);
        }
        const row = result.rows[0];
        const required_fields = ["id", "family_id", "calendar_name"];
        for (const r_field of required_fields) {
            if (!(r_field in row)) {
                throw new Error(`Comment doesn't contain all fields. ${row} is missing ${r_field}`);
            }
        }
        const res = {
            calendarID: row.id,
            calendarName: row.calendar_name,
        };
        return res;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}
async function getCalendarForFamilyWithID(id) {
    try {
        const result = await db_1.controller.query(`SELECT * FROM Calendar WHERE family_id = $1`, [id]);
        if (result.rowCount == 0) {
            throw new Error(`No calendar found with ID ${id}`);
        }
        const row = result.rows[0];
        const required_fields = ["id", "family_id", "calendar_name"];
        for (const r_field of required_fields) {
            if (!(r_field in row)) {
                throw new Error(`Comment doesn't contain all fields. ${row} is missing ${r_field}`);
            }
        }
        const res = {
            calendarID: row.id,
            calendarName: row.calendar_name,
        };
        return res;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}
async function createCalendarWithFamilyID(familyID, calendarName = "My calendar") {
    try {
        const res = await db_1.controller.query(`
      INSERT INTO calendar (family_id, calendar_name) VALUES ($1, $2) RETURNING id;`, [familyID, calendarName]);
        if (res.rowCount == 0) {
            throw new Error(`Could not add calendar to DB`);
        }
        return {
            calendarID: res.rows[0].id,
            calendarName,
        };
    }
    catch (err) {
        return null;
    }
}
