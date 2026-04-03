"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransportation = exports.addTransportations = exports.getTransportation = void 0;
const transportation_1 = require("../logic/transportation");
const getTransportation = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }
        const result = await (0, transportation_1.getTransportationWithEventID)(id);
        res.json(result);
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.getTransportation = getTransportation;
const addTransportations = async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).json({ error: "Request body is required" });
            return;
        }
        const { transportation } = req.body;
        if (!transportation) {
            res
                .status(400)
                .json({ error: "Request body must have field 'transportation'" });
            return;
        }
        const transportationsToAdd = {};
        for (const transportationForEvent of transportation) {
            const { eventID, details } = transportationForEvent;
            /*if (!Array.isArray(events)) {
              res.status(400).json({ error: "'events' must be an array" });
              return;
            }*/
            transportationsToAdd[eventID] = details;
        }
        await (0, transportation_1.addTransportationsToDB)(transportationsToAdd);
        res.status(201).json({ message: "Events inserted successfully" });
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.addTransportations = addTransportations;
const updateTransportation = async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).json({ error: "Request body is required" });
            return;
        }
        const { eventID, details } = req.body;
        if (eventID == null || !details) {
            res
                .status(400)
                .json({ error: "Request body needs fields eventID and details" });
            return;
        }
        await (0, transportation_1.alterTransportation)(eventID, details);
        res.status(201).json({ message: "Events inserted successfully" });
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.updateTransportation = updateTransportation;
