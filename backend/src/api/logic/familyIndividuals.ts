import { error } from "console";
import { controller } from "../../database/db";
import { FamilyIndividual } from "@shared/types";

export async function getFamilyIndividualWithID(
  id: number,
): Promise<FamilyIndividual> {
  const result = await controller.query(
    `SELECT * FROM family_individuals WHERE id = $1`,
    [id],
  );

  if (result.rowCount == 0) {
    throw new Error(`No individual found with ID ${id}`);
  }

  const row = result.rows[0];

  const required_fields = ["id", "individual_name"];

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
  } as FamilyIndividual;
}

export async function createIndividualForFamily(
  familyID: number,
  newIndividual: FamilyIndividual,
): Promise<FamilyIndividual | null> {
  try {
    const result = await controller.query(
      `INSERT INTO family_individuals 
    (family_id, individual_role, individual_name, can_drive, can_edit
    ${newIndividual.colorStr && newIndividual.colorStr != "" ? ", color_str" : ""}) 
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
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function deleteIndividualWithID(id: number): Promise<boolean> {
  try {
    const result = await controller.query(
      `DELETE FROM family_individuals WHERE id = $1;`,
      [id],
    );

    const rc = result.rowCount ?? 0;

    return rc > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function updateIndividual(fi: FamilyIndividual): Promise<boolean> {
  try {
    const result = await controller.query(
      `UPDATE family_individuals 
    SET individual_role = $2, individual_name=$3, can_drive=$4, can_edit=$5, color_str=$6
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
  } catch (err) {
    console.error(err);
    return false;
  }
}
