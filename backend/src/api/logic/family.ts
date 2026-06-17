import { error } from "console";
import { controller } from "../../database/db";
import { Family, FamilyIndividual, Vehicle } from "@shared/types";
import { createCalendarWithFamilyID } from "./calendar";

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

export async function createNewFamily(): Promise<Family | null> {
  try {
    const code = await generateUniqueFamilyCode();
    const queryRes = await controller.query(
      "INSERT INTO family (code) VALUES ($1) RETURNING *;",
      [code],
    );

    if (queryRes.rowCount == 0) {
      throw new Error("failed to create new family db error");
    }

    const row = queryRes.rows[0];
    const reqFields = ["id", "code"];

    for (const f of reqFields) {
      if (!(f in row)) {
        throw new Error(
          `Individual doesn't contain all fields. ${row} is missing ${f}`,
        );
      }
    }

    await createCalendarWithFamilyID(row.id);

    return {
      id: row.id,
      code: row.code,
      vehicles: [],
      members: [],
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function generateUniqueFamilyCode(): Promise<string> {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  function generateCode() {
    let out = "";
    for (let i = 0; i < 12; i++) {
      out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out.slice(0, 4) + "-" + out.slice(4, 8) + "-" + out.slice(8, 12);
  }

  while (true) {
    const code = generateCode();

    const result = await controller.query(
      "SELECT 1 FROM family WHERE code = $1 LIMIT 1",
      [code],
    );

    if (result.rowCount === 0) {
      return code;
    }
  }
}

export async function getFamilyWithCode(code: string): Promise<number | null> {
  try {
    const res = await controller.query(`SELECT * FROM family WHERE code = $1`, [
      code,
    ]);

    if (res.rowCount == 0) {
      throw new Error(`No family with code ${code} found in DB`);
    }

    return res.rows[0].id;
  } catch (err) {
    console.error(err);
  }
  return null;
}
