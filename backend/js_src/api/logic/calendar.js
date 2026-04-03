"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalendarWithID = getCalendarWithID;
const db_1 = require("../../database/db");
async function getCalendarWithID(id) {
    const result = await db_1.controller.query(`SELECT * FROM Calendar WHERE id = $1`, [id]);
    if (result.rowCount == 0) {
        throw new Error(`No event found with ID ${id}`);
    }
    const row = result.rows[0];
    const required_fields = ["id", "familyid", "name"];
    for (const r_field of required_fields) {
        if (!(r_field in row)) {
            throw new Error(`Comment doesn't contain all fields. ${row} is missing ${r_field}`);
        }
    }
    const res = {
        calendarID: row.id,
        calendarName: row.name,
    };
    return res;
}
