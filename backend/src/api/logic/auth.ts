// api/db/users.ts
import bcrypt from "bcrypt";
import { controller } from "../../database/db";

export type User = {
  id: number;
  username: string;
  passwordHash: string;
  familyIndividualID: number | null;
};

// Create a new user
export async function createUser(
  username: string,
  password: string,
): Promise<User> {
  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await controller.query(
      `INSERT INTO users (username, password_hash)
     VALUES ($1, $2)
     RETURNING id, username, password_hash`,
      [username, passwordHash],
    );

    const row = result.rows[0];
    return {
      id: row.id,
      username: row.username,
      passwordHash: row.password_hash,
      familyIndividualID: null,
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error inserting into database:", err.message);
    } else {
      console.error("Error inserting into database:", err);
    }
  }

  return {} as User;
}

// Find user by username
export async function findUserByUsername(
  username: string,
): Promise<User | null> {
  const result = await controller.query(
    `SELECT id, username, password_hash, family_individual_id
     FROM users
     WHERE username = $1`,
    [username],
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash,
    familyIndividualID: row.family_individual_id,
  };
}

// Find user by ID
export async function findUserById(id: number): Promise<User | null> {
  try {
    const result = await controller.query(
      `SELECT id, username, password_hash, family_individual_id
     FROM users
     WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      id: row.id,
      username: row.username,
      passwordHash: row.password_hash,
      familyIndividualID: row.family_individual_id,
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error inserting into database:", err.message);
    } else {
      console.error("Error inserting into database:", err);
    }
  }

  return {} as User;
}
