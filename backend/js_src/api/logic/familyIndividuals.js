"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFamilyIndividualWithID = getFamilyIndividualWithID;
exports.createIndividualForFamily = createIndividualForFamily;
exports.createIndividualForFamilyUsingCode = createIndividualForFamilyUsingCode;
exports.deleteIndividualWithID = deleteIndividualWithID;
exports.updateIndividual = updateIndividual;
exports.attachUserToFamilyIndividual = attachUserToFamilyIndividual;
const db_1 = require("../../database/db");
const family_1 = require("./family");
async function getFamilyIndividualWithID(id) {
    const result = await db_1.controller.query(`SELECT * FROM family_individuals WHERE id = $1`, [id]);
    if (result.rowCount == 0) {
        throw new Error(`No individual found with ID ${id}`);
    }
    const row = result.rows[0];
    const required_fields = ["id", "individual_name"];
    for (const r_field of required_fields) {
        if (!(r_field in row)) {
            throw new Error(`Individual doesn't contain all fields. ${row} is missing ${r_field}`);
        }
    }
    return {
        id: row.id,
        name: row.individual_name,
    };
}
async function createIndividualForFamily(familyID, newIndividual) {
    try {
        const result = await db_1.controller.query(`INSERT INTO family_individuals 
    (family_id, individual_role, individual_name, can_drive, can_edit
    ${newIndividual.colorStr && newIndividual.colorStr != "" ? ", color_str" : ""}) 
    VALUES ($1, $2, $3, $4, $5   
    ${newIndividual.colorStr && newIndividual.colorStr != "" ? ", $6" : ""}) RETURNING id;`, [
            familyID,
            newIndividual.role,
            newIndividual.name,
            newIndividual.canDrive,
            newIndividual.canEditCalendar,
            ...(newIndividual.colorStr && newIndividual.colorStr != ""
                ? [newIndividual.colorStr]
                : []),
        ]);
        if (result.rowCount == 0) {
            throw new Error(`Error inserting new member to family with id: ${familyID}`);
        }
        const row = result.rows[0];
        const required_fields = ["id"];
        for (const r_field of required_fields) {
            if (!(r_field in row)) {
                throw new Error(`Individual doesn't contain all fields. ${row} is missing ${r_field}`);
            }
        }
        //console.log(result);
        return { ...newIndividual, id: row.id };
    }
    catch (err) {
        console.error(err);
        return null;
    }
}
async function createIndividualForFamilyUsingCode(code, newIndividual) {
    try {
        const familyID = await (0, family_1.getFamilyWithCode)(code);
        if (!familyID) {
            throw new Error(`could not retrive family with code ${code}`);
        }
        const result = await db_1.controller.query(`INSERT INTO family_individuals 
    (family_id, individual_role, individual_name, can_drive, can_edit
    ${newIndividual.colorStr && newIndividual.colorStr != "" ? ", color_str" : ""}) 
    VALUES ($1, $2, $3, $4, $5   
    ${newIndividual.colorStr && newIndividual.colorStr != "" ? ", $6" : ""}) RETURNING id;`, [
            familyID,
            newIndividual.role,
            newIndividual.name,
            newIndividual.canDrive,
            newIndividual.canEditCalendar,
            ...(newIndividual.colorStr && newIndividual.colorStr != ""
                ? [newIndividual.colorStr]
                : []),
        ]);
        if (result.rowCount == 0) {
            throw new Error(`Error inserting new member to family with id: ${familyID}`);
        }
        const row = result.rows[0];
        const required_fields = ["id"];
        for (const r_field of required_fields) {
            if (!(r_field in row)) {
                throw new Error(`Individual doesn't contain all fields. ${row} is missing ${r_field}`);
            }
        }
        //console.log(result);
        return { ...newIndividual, id: row.id };
    }
    catch (err) {
        console.error(err);
        return null;
    }
}
async function deleteIndividualWithID(id) {
    try {
        const result = await db_1.controller.query(`DELETE FROM family_individuals WHERE id = $1;`, [id]);
        const rc = result.rowCount ?? 0;
        return rc > 0;
    }
    catch (err) {
        console.error(err);
        return false;
    }
}
async function updateIndividual(fi) {
    try {
        const result = await db_1.controller.query(`UPDATE family_individuals 
    SET individual_role = $2, individual_name=$3, can_drive=$4, can_edit=$5, color_str=$6
    WHERE id=$1 RETURNING *;`, [
            fi.id,
            fi.role,
            fi.name,
            fi.canDrive,
            fi.canEditCalendar,
            ...(fi.colorStr && fi.colorStr != "" ? [fi.colorStr] : [null]),
        ]);
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
    catch (err) {
        console.error(err);
        return false;
    }
}
async function attachUserToFamilyIndividual(userID, familyIndividualID) {
    try {
        const result = await db_1.controller.query(`UPDATE users 
      SET family_individual_id = $1 
      WHERE id=$2;`, [familyIndividualID, userID]);
        if (result.rowCount == 0) {
            return false;
        }
        return true;
    }
    catch (err) {
        console.error(err);
        return false;
    }
}
