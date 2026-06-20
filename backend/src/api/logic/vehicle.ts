import { controller } from "../../database/db";
import { Vehicle } from "@shared/types";

export async function getVehicleWithID(id: number): Promise<Vehicle> {
  const result = await controller.query(`SELECT * FROM vehicle WHERE id = $1`, [
    id,
  ]);

  if (result.rowCount == 0) {
    throw new Error(`No vehicle found with ID ${id}`);
  }

  const row = result.rows[0];

  const required_fields = ["id", "vehicle_name", "num_people_can_fit"];

  for (const r_field of required_fields) {
    if (!(r_field in row)) {
      throw new Error(
        `Comment doesn't contain all fields. ${row} is missing ${r_field}`,
      );
    }
  }

  return {
    id: row.id,
    name: row.vehicle_name,
    numPeopleCanFit: row.num_people_can_fit,
  };
}

export async function createVehicleForFamily(
  familyID: number,
  newVehicle: Vehicle,
): Promise<Vehicle> {
  const result = await controller.query(
    `INSERT INTO vehicle 
    (vehicle_name, num_people_can_fit, family_id)
    VALUES ($1, $2, $3) RETURNING id;`,
    [newVehicle.name, newVehicle.numPeopleCanFit, familyID],
  );

  if (result.rowCount == 0) {
    throw new Error(
      `Error inserting new vehicle into family with id: ${familyID}`,
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

  return { ...newVehicle, id: row.id };
}

export async function deleteVehicleWithID(id: number): Promise<boolean> {
  const result = await controller.query(`DELETE FROM vehicle WHERE id = $1;`, [
    id,
  ]);

  const rc = result.rowCount ?? 0;

  return rc > 0;
}

export async function updateVehicle(fv: Vehicle): Promise<boolean> {
  const result = await controller.query(
    `UPDATE vehicle 
    SET vehicle_name=$2, num_people_can_fit=$3
    WHERE id=$1 RETURNING *;`,
    [fv.id, fv.name, fv.numPeopleCanFit],
  );

  const rc = result.rowCount ?? 0;

  return rc > 0;
}
