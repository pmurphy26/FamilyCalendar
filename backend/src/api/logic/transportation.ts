import { error } from "console";
import { controller } from "../../database/db";
import {
  CalendarDate,
  CalendarEvent,
  FamilyIndividual,
  TransportationForEvent,
  Vehicle,
} from "@shared/types";
import { getVehicleWithID } from "./vehicle";
import { getFamilyIndividualWithID } from "./familyIndividuals";

export async function getTransportationWithEventID(
  id: number,
): Promise<TransportationForEvent> {
  const result = await controller.query(
    `SELECT * FROM transportationforevent WHERE eventid = $1`,
    [id],
  );

  if (result.rowCount == 0) {
    throw new Error(`No transportation found with ID ${id}`);
  }

  const row = result.rows[0];

  const required_fields = ["id", "eventid", "vehicleid"];

  for (const r_field of required_fields) {
    if (!(r_field in row)) {
      throw new Error(
        `TransportationEvent doesn't contain all fields. ${row} is missing ${r_field}`,
      );
    }
  }

  let vehicleForEvent: Vehicle = {
    id: row.vehicleid,
    name: "Error getting vehicle name",
    numPeopleCanFit: 8,
  };

  try {
    const vehicleWithID = await getVehicleWithID(row.vehicleid);
    vehicleForEvent = vehicleWithID;
  } catch (error) {
    console.log(`${error}. Couldn't find vehicle with id: ${row.vehicleid}`);
  }

  const returnedEvent: TransportationForEvent = {
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
      const driver = await getFamilyIndividualWithID(row.driverid);
      returnedEvent.driver = { ...driver };
    } catch (error) {
      //console.log(error);
    }
  } else {
    //console.log("no driver id recieved");
    //console.log(row);
  }

  return returnedEvent;
}

export async function addTransportationsToDB(
  transportations: Record<number, TransportationForEvent>,
): Promise<void> {
  try {
    await Promise.all(
      Object.entries(transportations).flatMap(
        ([eventID, transportationForEvent]) => {
          return controller.query(
            `INSERT INTO transportationforevent 
            (vehicleid, eventid
            ${transportationForEvent.leaveAt ? ", leaveathour, leaveatminute, leaveatisam" : ""}
            ${transportationForEvent.driver ? ", driverid" : ""})
            VALUES ($1, $2
            ${transportationForEvent.leaveAt ? ", $3, $4, $5" : ""}
            ${
              transportationForEvent.driver
                ? transportationForEvent.leaveAt
                  ? ", $6"
                  : ", $3"
                : ""
            });`,
            [
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
            ],
          );
        },
      ),
    );
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Error while inserting events: ${err.message}`);
    }
    throw new Error(`Error while inserting events: ${String(err)}`);
  }
}

export async function alterTransportation(
  eventID: number,
  transportationForEvent: TransportationForEvent,
): Promise<void> {
  try {
    await controller.query(
      `UPDATE transportationforevent 
            SET vehicleid=$1
            ${
              transportationForEvent.leaveAt
                ? ", leaveathour=$2, leaveatminute=$3, leaveatisam=$4"
                : ", leaveathour=NULL, leaveatminute=NULL, leaveatisam=NULL"
            }
            ${
              transportationForEvent.driver
                ? transportationForEvent.leaveAt
                  ? ", driverid=$5"
                  : ", driverid=$2"
                : ", driverid=NULL"
            }
            WHERE eventid=${
              transportationForEvent.leaveAt
                ? transportationForEvent.driver
                  ? "$6"
                  : "$5"
                : transportationForEvent.driver
                  ? "$3"
                  : "$2"
            };`,
      [
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
      ],
    );
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Error while inserting events: ${err.message}`);
    }
    throw new Error(`Error while inserting events: ${String(err)}`);
  }
}

async function deleteCommentByID(id: number): Promise<boolean> {
  const result = await controller.query(
    `DELETE FROM public."Comments"
    WHERE id = $1
    RETURNING *;`,
    [id],
  );

  if (result.rows.length === 0) {
    return false;
  }

  return true;
}

async function updateEventInDB(
  event: CalendarEvent,
  calendarDayID?: number,
): Promise<boolean> {
  const result = await controller.query(
    `UPDATE calendarevent
    SET
      eventtitle = $2,
      eventhour = $3,
      eventminute = $4,
      eventisam = $5,
      eventlocation = $6,
      createdbyid = $7
      ${event.notes != "" ? ", eventnotes = $8," : ""}
      ${event.for ? `, forid = ${event.notes == "" ? "$8" : "$9"}` : ""}
      ${
        calendarDayID != null
          ? `, calendardayid = ${
              event.notes == ""
                ? event.for
                  ? "$9"
                  : "$8"
                : event.for
                  ? "$10"
                  : "$9"
            }`
          : ""
      }

    WHERE id = $1
    RETURNING *;`,
    [
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
    ],
  );

  if (result.rows.length === 0) {
    return false;
  }

  return true;
}
