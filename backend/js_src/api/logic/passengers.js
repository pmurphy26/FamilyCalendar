"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPassengersForTransportationWithID = getPassengersForTransportationWithID;
const db_1 = require("../../database/db");
async function getPassengersForTransportationWithID(transportationID) {
    try {
        const result = await db_1.controller.query(`SELECT tp.*, fi.individual_name
        FROM transportation_passengers AS tp 
        LEFT JOIN family_individuals AS fi 
            ON fi.id = tp.passenger_id
        WHERE transportation_id = $1;`, [transportationID]);
        if (result.rowCount == 0) {
            //console.log(`No transportation found with ID ${transportationID}`);
            return [];
        }
        for (const row of result.rows) {
            const required_fields = [
                "transportation_id",
                "passenger_id",
                "individual_name",
            ];
            for (const r_field of required_fields) {
                if (!(r_field in row)) {
                    throw new Error(`TransportationEvent doesn't contain all fields. ${row} is missing ${r_field}`);
                }
            }
        }
        const res = result.rows.map((r) => {
            return {
                id: r.passenger_id,
                name: r.individual_name,
            };
        });
        return res;
    }
    catch (err) {
        console.error(err);
    }
    return [];
}
