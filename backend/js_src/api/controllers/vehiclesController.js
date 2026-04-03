"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFamilyVehicle = exports.deleteFamilyIndividual = exports.createFamilyVehicle = void 0;
const vehicle_1 = require("../logic/vehicle");
const createFamilyVehicle = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }
        const individual = req.body;
        const required_fields = ["name", "numPeopleCanFit"];
        for (const r_field of required_fields) {
            if (!(r_field in individual)) {
                throw new Error(`Vehicle doesn't contain all fields. ${individual} is missing ${r_field}`);
            }
        }
        const result = await (0, vehicle_1.createVehicleForFamily)(id, individual);
        res.json(result);
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.createFamilyVehicle = createFamilyVehicle;
const deleteFamilyIndividual = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }
        const result = await (0, vehicle_1.deleteVehicleWithID)(id);
        res.json(result);
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.deleteFamilyIndividual = deleteFamilyIndividual;
const updateFamilyVehicle = async (req, res) => {
    try {
        const individual = req.body;
        const required_fields = ["id", "name", "numPeopleCanFit"];
        for (const r_field of required_fields) {
            if (!(r_field in individual)) {
                throw new Error(`Individual doesn't contain all fields. ${individual} is missing ${r_field}`);
            }
        }
        const result = await (0, vehicle_1.updateVehicle)(individual);
        res.json(result);
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.updateFamilyVehicle = updateFamilyVehicle;
