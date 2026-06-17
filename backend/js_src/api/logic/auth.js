"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findUserByUsername = findUserByUsername;
exports.findUserById = findUserById;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../../database/db");
// Create a new user
async function createUser(username, password) {
    try {
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const result = await db_1.controller.query(`INSERT INTO users (username, password_hash)
     VALUES ($1, $2)
     RETURNING id, username, password_hash`, [username, passwordHash]);
        const row = result.rows[0];
        return {
            id: row.id,
            username: row.username,
            passwordHash: row.password_hash,
            familyIndividualID: null,
        };
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("Error inserting into database:", err.message);
        }
        else {
            console.error("Error inserting into database:", err);
        }
    }
    return {};
}
// Find user by username
async function findUserByUsername(username) {
    const result = await db_1.controller.query(`SELECT id, username, password_hash, family_individual_id
     FROM users
     WHERE username = $1`, [username]);
    if (result.rows.length === 0)
        return null;
    const row = result.rows[0];
    return {
        id: row.id,
        username: row.username,
        passwordHash: row.password_hash,
        familyIndividualID: row.family_individual_id,
    };
}
// Find user by ID
async function findUserById(id) {
    try {
        const result = await db_1.controller.query(`SELECT id, username, password_hash, family_individual_id
     FROM users
     WHERE id = $1`, [id]);
        if (result.rows.length === 0)
            return null;
        const row = result.rows[0];
        return {
            id: row.id,
            username: row.username,
            passwordHash: row.password_hash,
            familyIndividualID: row.family_individual_id,
        };
    }
    catch (err) {
        if (err instanceof Error) {
            console.error("Error inserting into database:", err.message);
        }
        else {
            console.error("Error inserting into database:", err);
        }
    }
    return {};
}
