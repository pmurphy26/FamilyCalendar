import { controller } from "../../database/db";
import {
  FamilyIndividual,
  TransportationForEvent,
  Vehicle,
} from "@shared/types";
import { getVehicleWithID } from "./vehicle";
import { getFamilyIndividualWithID } from "./familyIndividuals";
import { getPassengersForTransportationWithID } from "./passengers";

export async function getTransportationWithID(
  id: number,
): Promise<TransportationForEvent | null> {
  try {
    const result = await controller.query(
      `SELECT * FROM transportation_for_event WHERE id = $1;`,
      [id],
    );

    if (result.rowCount == 0) {
      throw new Error(`No transportation found with ID ${id}`);
    }

    const row = result.rows[0];

    const required_fields = ["id", "event_id", "vehicle_id"];

    for (const r_field of required_fields) {
      if (!(r_field in row)) {
        throw new Error(
          `TransportationEvent doesn't contain all fields. ${row} is missing ${r_field}`,
        );
      }
    }

    let vehicleForEvent: Vehicle = {
      id: row.vehicle_id,
      name: "Error getting vehicle name",
      numPeopleCanFit: 8,
    };

    try {
      const vehicleWithID = await getVehicleWithID(row.vehicle_id);
      vehicleForEvent = vehicleWithID;
    } catch (error) {
      console.log(`${error}. Couldn't find vehicle with id: ${row.vehicle_id}`);
    }

    let passengers: FamilyIndividual[] = [];

    //TODO try and get passengers
    try {
      //console.log(id);
      const passengersForTransportation =
        await getPassengersForTransportationWithID(row.id);
      passengers = passengersForTransportation;
    } catch (error) {
      console.log(`${error}. Couldn't find vehicle with id: ${row.id}`);
    }

    const returnedEvent: TransportationForEvent = {
      passengers: passengers,
      vehicle: vehicleForEvent,
      ...(row.leave_at_hour != null &&
        row.leave_at_minute != null &&
        row.leave_at_is_am != null && {
          leaveAt: {
            hour: row.leave_at_hour,
            minute: row.leave_at_minute,
            isAM: row.leave_at_is_am,
          },
        }),
    };

    if (row.driver_id != null) {
      //console.log(row.driver_id);
      try {
        const driver = await getFamilyIndividualWithID(row.driver_id);
        returnedEvent.driver = { ...driver };
      } catch (error) {
        //console.log(error);
      }
    } else {
      //console.log("no driver id recieved");
      //console.log(row);
    }

    return returnedEvent;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getTransportationWithEventID(
  id: number,
): Promise<TransportationForEvent | null> {
  try {
    const result = await controller.query(
      `SELECT * FROM transportation_for_event WHERE event_id = $1;`,
      [id],
    );

    if (result.rowCount == 0) {
      throw new Error(`No transportation found with ID ${id}`);
    }

    const row = result.rows[0];

    const required_fields = ["id", "event_id", "vehicle_id"];

    for (const r_field of required_fields) {
      if (!(r_field in row)) {
        throw new Error(
          `TransportationEvent doesn't contain all fields. ${row} is missing ${r_field}`,
        );
      }
    }

    let vehicleForEvent: Vehicle = {
      id: row.vehicle_id,
      name: "Error getting vehicle name",
      numPeopleCanFit: 8,
    };

    try {
      const vehicleWithID = await getVehicleWithID(row.vehicle_id);
      vehicleForEvent = vehicleWithID;
    } catch (error) {
      console.log(`${error}. Couldn't find vehicle with id: ${row.vehicle_id}`);
    }

    const returnedEvent: TransportationForEvent = {
      passengers: [],
      vehicle: vehicleForEvent,
      ...(row.leave_at_hour != null &&
        row.leave_at_minute != null &&
        row.leave_at_is_am != null && {
          leaveAt: {
            hour: row.leave_at_hour,
            minute: row.leave_at_minute,
            isAM: row.leave_at_is_am,
          },
        }),
    };

    if (row.driver_id != null) {
      //console.log(row.driver_id);
      try {
        const driver = await getFamilyIndividualWithID(row.driver_id);
        returnedEvent.driver = { ...driver };
      } catch (error) {
        //console.log(error);
      }
    } else {
      //console.log("no driver id recieved");
      //console.log(row);
    }

    return returnedEvent;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function addTransportationsToDB(
  transportations: Record<number, Record<string, TransportationForEvent>>,
): Promise<void> {
  try {
    //console.log(transportations);

    const rows = Object.entries(transportations).flatMap(
      ([eventID, branches]) =>
        Object.entries(branches).map(([type, tfe]) => ({
          eventID: Number(eventID),
          isArrival: type == "arrival",
          vehicleID: tfe.vehicle.id,
          driverID: tfe.driver?.id ?? null,
          leaveAtHour: tfe.leaveAt?.hour ?? null,
          leaveAtMinute: tfe.leaveAt?.minute ?? null,
          leaveAtIsAM: tfe.leaveAt?.isAM ?? null,
          passengers: tfe.passengers,
        })),
    );

    // Insert each row
    await Promise.all(
      rows.map(async (row) => {
        const res = await controller.query(
          `
          INSERT INTO transportation_for_event
            (event_id, is_arrival, vehicle_id, driver_id, leave_at_hour, leave_at_minute, leave_at_is_am)
          VALUES
            ($1, $2, $3, $4, $5, $6, $7) RETURNING id;
        `,
          [
            row.eventID,
            row.isArrival,
            row.vehicleID,
            row.driverID,
            row.leaveAtHour,
            row.leaveAtMinute,
            row.leaveAtIsAM,
          ],
        );

        if (res.rowCount != 0) {
          const transportationForEventID = res.rows[0].id;
          //console.log(transportationForEventID);
          //console.log(transportationForEvent.passengers);

          const passengerRes = await Promise.all(
            row.passengers.map((p) => {
              return controller.query(
                `
          INSERT INTO transportation_passengers 
            (transportation_id, passenger_id)
          VALUES ($1, $2)
          ON CONFLICT (transportation_id, passenger_id) DO NOTHING;`,
                [transportationForEventID, p.id],
              );
            }),
          );
        }

        return res;
      }),
    );
  } catch (err) {
    console.error("DB ERROR inserting transportations:", err);
    throw err;
  }
}

export async function alterTransportation(
  eventID: number,
  transportationForEvent: TransportationForEvent,
  isArrival: boolean = true,
): Promise<boolean> {
  try {
    const fields: string[] = [];
    const params: any[] = [];
    let idx = 1;

    // Always update vehicle_id
    fields.push(`vehicle_id = $${idx}`);
    params.push(transportationForEvent.vehicle.id);
    idx++;

    // leaveAt fields
    if (transportationForEvent.leaveAt) {
      fields.push(`leave_at_hour = $${idx}`);
      params.push(transportationForEvent.leaveAt.hour);
      idx++;

      fields.push(`leave_at_minute = $${idx}`);
      params.push(transportationForEvent.leaveAt.minute);
      idx++;

      fields.push(`leave_at_is_am = $${idx}`);
      params.push(transportationForEvent.leaveAt.isAM);
      idx++;
    } else {
      fields.push(`leave_at_hour = NULL`);
      fields.push(`leave_at_minute = NULL`);
      fields.push(`leave_at_is_am = NULL`);
    }

    // driver_id
    if (transportationForEvent.driver) {
      fields.push(`driver_id = $${idx}`);
      params.push(transportationForEvent.driver.id);
      idx++;
    } else {
      fields.push(`driver_id = NULL`);
    }

    // WHERE event_id = ?
    fields.push(`event_id = $${idx}`);
    params.push(eventID);
    idx++;

    // AND is_arrival = ?
    fields.push(`is_arrival = $${idx}`);
    params.push(isArrival);
    //idx++;

    const queryStr = `
      UPDATE transportation_for_event
      SET ${fields.slice(0, -2).join(", ")}
      WHERE event_id = $${idx - 1} AND is_arrival = $${idx}
      RETURNING id;
    `;

    const res = await controller.query(queryStr, params);

    if (res.rowCount != 0) {
      const transportationForEventID = res.rows[0].id;
      //console.log(transportationForEventID);
      //console.log(transportationForEvent.passengers);

      //TODO: remove passengers not in passenger list from DB
      const passengerRes = await Promise.all(
        transportationForEvent.passengers.map((p) => {
          return controller.query(
            `
          INSERT INTO transportation_passengers 
          (transportation_id, passenger_id)
          VALUES ($1, $2)
          ON CONFLICT (transportation_id, passenger_id) DO NOTHING;`,
            [transportationForEventID, p.id],
          );
        }),
      );
    }

    return true;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error while inserting events: ${err.message}`);
    }
    console.error(`Error while inserting events: ${String(err)}`);

    return false;
  }
}
