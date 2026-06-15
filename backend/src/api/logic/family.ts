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
): Promise<Family | null> {
  try {
    const result = await controller.query(
      `SELECT * FROM family_individuals WHERE id = $1`,
      [id],
    );

    if (result.rowCount == 0) {
      throw new Error(`No individual found with ID ${id}`);
    }

    const row = result.rows[0];

    const required_fields = ["family_id"];

    for (const r_field of required_fields) {
      if (!(r_field in row)) {
        throw new Error(
          `Family individual doesn't contain all fields. ${row} is missing ${r_field}`,
        );
      }
    }

    const familyVehicles = await getAllFamilyVehiclesWithID(row.family_id);
    return {
      id: row.family_id,
      members: await getAllFamilyMembersWithID(row.family_id),
      ...(familyVehicles.length && { vehicles: familyVehicles }),
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getAllFamilyVehiclesWithID(
  id: number,
): Promise<Vehicle[]> {
  const result = await controller.query(
    `SELECT * FROM vehicle WHERE family_id = $1`,
    [id],
  );

  if (result.rowCount == 0) {
    return [];
    //throw new Error(`No individuals found with family ID ${id}`);
  }

  const rows = result.rows;

  const required_fields = ["id", "vehicle_name", "num_people_can_fit"];

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
      name: row.vehicle_name,
      numPeopleCanFit: row.num_people_can_fit,
    };
  });

  return familyVehicles;
}

export async function getAllFamilyMembersWithID(
  id: number,
): Promise<FamilyIndividual[]> {
  try {
    const result = await controller.query(
      `SELECT * FROM family_individuals WHERE family_id = $1`,
      [id],
    );

    if (result.rowCount == 0) {
      return [];
      //throw new Error(`No individuals found with family ID ${id}`);
    }

    const rows = result.rows;

    const required_fields = [
      "id",
      "individual_name",
      "individual_role",
      "can_drive",
      "can_edit",
    ];

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
        name: row.individual_name,
        role: row.individual_role,
        canDrive: row.can_drive,
        canEditCalendar: row.can_edit,
        ...(row.color_str && { colorStr: row.color_str }),
      };
    });

    return familyMembers;
  } catch (err) {
    console.error(err);
    return [];
  }
}
