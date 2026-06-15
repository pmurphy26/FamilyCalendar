"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVehicleWithID = getVehicleWithID;
exports.createVehicleForFamily = createVehicleForFamily;
exports.deleteVehicleWithID = deleteVehicleWithID;
exports.updateVehicle = updateVehicle;
const db_1 = require("../../database/db");
async function getVehicleWithID(id) {
    const result = await db_1.controller.query(`SELECT * FROM vehicle WHERE id = $1`, [
        id,
    ]);
    if (result.rowCount == 0) {
        throw new Error(`No vehicle found with ID ${id}`);
    }
    const row = result.rows[0];
    const required_fields = ["id", "vehicle_name", "num_people_can_fit"];
    for (const r_field of required_fields) {
        if (!(r_field in row)) {
            throw new Error(`Comment doesn't contain all fields. ${row} is missing ${r_field}`);
        }
    }
    return {
        id: row.id,
        name: row.vehicle_name,
        numPeopleCanFit: row.num_people_can_fit,
    };
}
async function createVehicleForFamily(familyID, newVehicle) {
    //console.log(newIndividual);
    const result = await db_1.controller.query(`INSERT INTO vehicle 
    (vehiclename, numpeoplecanfit, familyid)
    VALUES ($1, $2, $3) RETURNING id;`, [newVehicle.name, newVehicle.numPeopleCanFit, familyID]);
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
    return { ...newVehicle, id: row.id };
}
async function deleteVehicleWithID(id) {
    const result = await db_1.controller.query(`DELETE FROM vehicle WHERE id = $1;`, [
        id,
    ]);
    const rc = result.rowCount ?? 0;
    return rc > 0;
}
async function updateVehicle(fv) {
    const result = await db_1.controller.query(`UPDATE vehicle 
    SET vehiclename=$2, numpeoplecanfit=$3
    WHERE id=$1 RETURNING *;`, [fv.id, fv.name, fv.numPeopleCanFit]);
    const rc = result.rowCount ?? 0;
    return rc > 0;
}
