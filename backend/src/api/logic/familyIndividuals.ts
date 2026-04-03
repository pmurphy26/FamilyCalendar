import { error } from "console";
import { controller } from "../../database/db";
import {
  CalendarDate,
  CalendarEvent,
  FamilyIndividual,
  TransportationForEvent,
  Vehicle,
} from "@shared/types";

export async function getFamilyIndividualWithID(
  id: number,
): Promise<FamilyIndividual> {
  const result = await controller.query(
    `SELECT * FROM familyindividuals WHERE id = $1`,
    [id],
  );

  if (result.rowCount == 0) {
    throw new Error(`No individual found with ID ${id}`);
  }

  const row = result.rows[0];

  const required_fields = ["id", "name"];

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
  } as FamilyIndividual;
}

export async function createIndividualForFamily(
  familyID: number,
  newIndividual: FamilyIndividual,
): Promise<FamilyIndividual> {
  //console.log(newIndividual);

  const result = await controller.query(
    `INSERT INTO familyindividuals 
    (familyid, role, name, candrive, canedit
    ${newIndividual.colorStr && newIndividual.colorStr != "" ? ", colorstr" : ""}) 
    VALUES ($1, $2, $3, $4, $5   
    ${newIndividual.colorStr && newIndividual.colorStr != "" ? ", $6" : ""}) RETURNING id;`,
    [
      familyID,
      newIndividual.role,
      newIndividual.name,
      newIndividual.canDrive,
      newIndividual.canEditCalendar,
      ...(newIndividual.colorStr && newIndividual.colorStr != ""
        ? [newIndividual.colorStr]
        : []),
    ],
  );

  if (result.rowCount == 0) {
    throw new Error(
      `Error inserting new member to family with id: ${familyID}`,
    );
  }

  const row = result.rows[0];

  const required_fields = ["id"];

  for (const r_field of required_fields) {
    if (!(r_field in row)) {
      throw new Error(
        `Individual doesn't contain all fields. ${row} is missing ${r_field}`,
      );
    }
  }
  //console.log(result);

  return { ...newIndividual, id: row.id };
}

export async function deleteIndividualWithID(id: number): Promise<boolean> {
  //console.log(id);

  const result = await controller.query(
    `DELETE FROM familyindividuals WHERE id = $1;`,
    [id],
  );

  /*if (result.rowCount == 0) {
    throw new Error(
      `Error inserting new member to family with id: ${familyID}`,
    );
  }

  const row = result.rows[0];

  const required_fields = ["id"];

  for (const r_field of required_fields) {
    if (!(r_field in row)) {
      throw new Error(
        `Individual doesn't contain all fields. ${row} is missing ${r_field}`,
      );
    }
  }*/
  //console.log(result);
  const rc = result.rowCount ?? 0;

  return rc > 0;
}

export async function updateIndividual(fi: FamilyIndividual): Promise<boolean> {
  const result = await controller.query(
    `UPDATE familyindividuals 
    SET role = $2, name=$3, candrive=$4, canedit=$5, colorstr=$6
    WHERE id=$1 RETURNING *;`,
    [
      fi.id,
      fi.role,
      fi.name,
      fi.canDrive,
      fi.canEditCalendar,
      ...(fi.colorStr && fi.colorStr != "" ? [fi.colorStr] : [null]),
    ],
  );

  /*if (result.rowCount == 0) {
    throw new Error(
      `Error inserting new member to family with id: ${familyID}`,
    );
  }

  const row = result.rows[0];

  const required_fields = ["id"];

  for (const r_field of required_fields) {
    if (!(r_field in row)) {
      throw new Error(
        `Individual doesn't contain all fields. ${row} is missing ${r_field}`,
      );
    }
  }*/
  //console.log(result);
  const rc = result.rowCount ?? 0;

  return rc > 0;
}
