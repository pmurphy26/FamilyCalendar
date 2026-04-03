import { error } from "console";
import { controller } from "../../database/db";
import {
  CalendarDate,
  CalendarEvent,
  Family,
  FamilyIndividual,
  TransportationForEvent,
  Vehicle,
} from "@shared/types";

export async function getFamilyForIndividualWithID(
  id: number,
): Promise<Family> {
  const result = await controller.query(
    `SELECT * FROM familyindividuals WHERE id = $1`,
    [id],
  );

  if (result.rowCount == 0) {
    throw new Error(`No vehicle found with ID ${id}`);
  }

  const row = result.rows[0];

  const required_fields = ["familyid"];

  for (const r_field of required_fields) {
    if (!(r_field in row)) {
      throw new Error(
        `Family individual doesn't contain all fields. ${row} is missing ${r_field}`,
      );
    }
  }

  const familyVehicles = await getAllFamilyVehiclesWithID(row.familyid);
  return {
    id: row.familyid,
    members: await getAllFamilyMembersWithID(row.familyid),
    ...(familyVehicles.length && { vehicles: familyVehicles }),
  };
}

export async function getAllFamilyVehiclesWithID(
  id: number,
): Promise<Vehicle[]> {
  const result = await controller.query(
    `SELECT * FROM vehicle WHERE familyid = $1`,
    [id],
  );

  if (result.rowCount == 0) {
    return [];
    //throw new Error(`No individuals found with family ID ${id}`);
  }

  const rows = result.rows;

  const required_fields = ["id", "vehiclename", "numpeoplecanfit"];

  const familyVehicles: Vehicle[] = rows.map((row) => {
    for (const r_field of required_fields) {
      if (!(r_field in row)) {
        throw new Error(
          `Individual doesn't contain all fields. ${row} is missing ${r_field}`,
        );
      }
    }

    return {
      id: row.id,
      name: row.vehiclename,
      numPeopleCanFit: row.numpeoplecanfit,
    };
  });

  return familyVehicles;
}

export async function getAllFamilyMembersWithID(
  id: number,
): Promise<FamilyIndividual[]> {
  const result = await controller.query(
    `SELECT * FROM familyindividuals WHERE familyid = $1`,
    [id],
  );

  if (result.rowCount == 0) {
    return [];
    //throw new Error(`No individuals found with family ID ${id}`);
  }

  const rows = result.rows;

  const required_fields = ["id", "name", "role", "candrive", "canedit"];

  const familyMembers: FamilyIndividual[] = rows.map((row) => {
    for (const r_field of required_fields) {
      if (!(r_field in row)) {
        throw new Error(
          `Individual doesn't contain all fields. ${row} is missing ${r_field}`,
        );
      }
    }

    return {
      id: row.id,
      name: row.name,
      role: row.role,
      canDrive: row.candrive,
      canEditCalendar: row.canedit,
      ...(row.colorstr && { colorStr: row.colorstr }),
    };
  });

  return familyMembers;
}
