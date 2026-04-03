"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransportationWithEventID = getTransportationWithEventID;
exports.addTransportationsToDB = addTransportationsToDB;
exports.alterTransportation = alterTransportation;
const db_1 = require("../../database/db");
const vehicle_1 = require("./vehicle");
const familyIndividuals_1 = require("./familyIndividuals");
async function getTransportationWithEventID(id) {
    const result = await db_1.controller.query(`SELECT * FROM transportationforevent WHERE eventid = $1`, [id]);
    if (result.rowCount == 0) {
        throw new Error(`No transportation found with ID ${id}`);
    }
    const row = result.rows[0];
    const required_fields = ["id", "eventid", "vehicleid"];
    for (const r_field of required_fields) {
        if (!(r_field in row)) {
            throw new Error(`TransportationEvent doesn't contain all fields. ${row} is missing ${r_field}`);
        }
    }
    let vehicleForEvent = {
        id: row.vehicleid,
        name: "Error getting vehicle name",
        numPeopleCanFit: 8,
    };
    try {
        const vehicleWithID = await (0, vehicle_1.getVehicleWithID)(row.vehicleid);
        vehicleForEvent = vehicleWithID;
    }
    catch (error) {
        console.log(`${error}. Couldn't find vehicle with id: ${row.vehicleid}`);
    }
    const returnedEvent = {
        passengers: [],
        vehicle: vehicleForEvent,
        ...(row.leaveathour != null &&
            row.leaveatminute != null &&
            row.leaveatisam != null && {
            leaveAt: {
                hour: row.leaveathour,
                minute: row.leaveatminute,
                isAM: row.leaveatisam,
            },
        }),
    };
    if (row.driverid != null) {
        //console.log(row.driverid);
        try {
            const driver = await (0, familyIndividuals_1.getFamilyIndividualWithID)(row.driverid);
            returnedEvent.driver = { ...driver };
        }
        catch (error) {
            //console.log(error);
        }
    }
    else {
        //console.log("no driver id recieved");
        //console.log(row);
    }
    return returnedEvent;
}
async function addTransportationsToDB(transportations) {
    try {
        await Promise.all(Object.entries(transportations).flatMap(([eventID, transportationForEvent]) => {
            return db_1.controller.query(`INSERT INTO transportationforevent 
            (vehicleid, eventid
            ${transportationForEvent.leaveAt ? ", leaveathour, leaveatminute, leaveatisam" : ""}
            ${transportationForEvent.driver ? ", driverid" : ""})
            VALUES ($1, $2
            ${transportationForEvent.leaveAt ? ", $3, $4, $5" : ""}
            ${transportationForEvent.driver
                ? transportationForEvent.leaveAt
                    ? ", $6"
                    : ", $3"
                : ""});`, [
                transportationForEvent.vehicle.id,
                eventID,
                ...(transportationForEvent.leaveAt
                    ? [
                        transportationForEvent.leaveAt.hour,
                        transportationForEvent.leaveAt.minute,
                        transportationForEvent.leaveAt.isAM,
                    ]
                    : []),
                ...(transportationForEvent.driver
                    ? [transportationForEvent.driver.id]
                    : []),
            ]);
        }));
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(`Error while inserting events: ${err.message}`);
        }
        throw new Error(`Error while inserting events: ${String(err)}`);
    }
}
async function alterTransportation(eventID, transportationForEvent) {
    try {
        await db_1.controller.query(`UPDATE transportationforevent 
            SET vehicleid=$1
            ${transportationForEvent.leaveAt
            ? ", leaveathour=$2, leaveatminute=$3, leaveatisam=$4"
            : ", leaveathour=NULL, leaveatminute=NULL, leaveatisam=NULL"}
            ${transportationForEvent.driver
            ? transportationForEvent.leaveAt
                ? ", driverid=$5"
                : ", driverid=$2"
            : ", driverid=NULL"}
            WHERE eventid=${transportationForEvent.leaveAt
            ? transportationForEvent.driver
                ? "$6"
                : "$5"
            : transportationForEvent.driver
                ? "$3"
                : "$2"};`, [
            transportationForEvent.vehicle.id,
            ...(transportationForEvent.leaveAt
                ? [
                    transportationForEvent.leaveAt.hour,
                    transportationForEvent.leaveAt.minute,
                    transportationForEvent.leaveAt.isAM,
                ]
                : []),
            ...(transportationForEvent.driver
                ? [transportationForEvent.driver.id]
                : []),
            eventID,
        ]);
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(`Error while inserting events: ${err.message}`);
        }
        throw new Error(`Error while inserting events: ${String(err)}`);
    }
}
async function deleteCommentByID(id) {
    const result = await db_1.controller.query(`DELETE FROM public."Comments"
    WHERE id = $1
    RETURNING *;`, [id]);
    if (result.rows.length === 0) {
        return false;
    }
    return true;
}
async function updateEventInDB(event, calendarDayID) {
    const result = await db_1.controller.query(`UPDATE calendarevent
    SET
      eventtitle = $2,
      eventhour = $3,
      eventminute = $4,
      eventisam = $5,
      eventlocation = $6,
      createdbyid = $7
      ${event.notes != "" ? ", eventnotes = $8," : ""}
      ${event.for ? `, forid = ${event.notes == "" ? "$8" : "$9"}` : ""}
      ${calendarDayID != null
        ? `, calendardayid = ${event.notes == ""
            ? event.for
                ? "$9"
                : "$8"
            : event.for
                ? "$10"
                : "$9"}`
        : ""}

    WHERE id = $1
    RETURNING *;`, [
        event.id,
        event.title,
        event.time.hour,
        event.time.minute,
        event.time.isAM,
        event.location,
        event.createdBy.id,
        ...(event.notes ? [event.notes] : []),
        ...(event.for && Object.keys(event.for).length > 0 ? [event.for.id] : []),
        ...(calendarDayID != null ? [calendarDayID] : []),
    ]);
    if (result.rows.length === 0) {
        return false;
    }
    return true;
}
