"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFamilyIndividual = exports.deleteFamilyIndividual = exports.createFamilyIndividual = void 0;
const familyIndividuals_1 = require("../logic/familyIndividuals");
const createFamilyIndividual = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }
        const individual = req.body;
        const required_fields = ["role", "name", "canDrive", "canEditCalendar"];
        for (const r_field of required_fields) {
            if (!(r_field in individual)) {
                throw new Error(`Individual doesn't contain all fields. ${individual} is missing ${r_field}`);
            }
        }
        const result = await (0, familyIndividuals_1.createIndividualForFamily)(id, individual);
        if (!result) {
            return res.status(409).json({ error: "error inserting into databse" });
        }
        res.json(result);
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.createFamilyIndividual = createFamilyIndividual;
const deleteFamilyIndividual = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }
        const result = await (0, familyIndividuals_1.deleteIndividualWithID)(id);
        res.json(result);
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.deleteFamilyIndividual = deleteFamilyIndividual;
const updateFamilyIndividual = async (req, res) => {
    try {
        const individual = req.body;
        const required_fields = [
            "id",
            "role",
            "name",
            "canDrive",
            "canEditCalendar",
        ];
        for (const r_field of required_fields) {
            if (!(r_field in individual)) {
                throw new Error(`Individual doesn't contain all fields. ${individual} is missing ${r_field}`);
            }
        }
        const result = await (0, familyIndividuals_1.updateIndividual)(individual);
        res.json(result);
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.updateFamilyIndividual = updateFamilyIndividual;
