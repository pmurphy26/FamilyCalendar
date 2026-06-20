"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFamilyVehicle = exports.deleteFamilyVehicle = exports.createFamilyVehicle = void 0;
const vehicle_1 = require("../logic/vehicle");
const createFamilyVehicle = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }
        if (id < 0) {
            return res
                .status(400)
                .json({ error: `family id must be greater than 0` });
        }
        const { name, numPeopleCanFit } = req.body;
        if (!name || !numPeopleCanFit) {
            throw new Error("must include name and numPeopleCanFit in request body");
        }
        const result = await (0, vehicle_1.createVehicleForFamily)(id, {
            name,
            numPeopleCanFit,
        });
        res.json(result);
    }
    catch (err) {
        console.error("DB ERROR:", err);
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: err });
        }
    }
};
exports.createFamilyVehicle = createFamilyVehicle;
const deleteFamilyVehicle = async (req, res) => {
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
exports.deleteFamilyVehicle = deleteFamilyVehicle;
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
