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
        for (const { eventID, details } of transportation) {
            if (!transportationsToAdd[eventID]) {
                transportationsToAdd[eventID] = {};
            }
            for (const [type, transportationForEvent] of Object.entries(details)) {
                //TODO: check transportationForEvent has all req fields
                transportationsToAdd[eventID][type] =
                    transportationForEvent;
            }
        }
        //console.log(transportationsToAdd);
        await (0, transportation_1.addTransportationsToDB)(transportationsToAdd);
        res.status(201).json({ message: "Transportation inserted successfully" });
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
        //console.log(`Passing details as ${JSON.stringify(details)}`);
        const { arrival, departure } = details;
        //console.log(`Passing details as ${JSON.stringify(arrival)}`);
        //console.log(`Passing details as ${JSON.stringify(departure)}`);
        if (arrival) {
            const successfulAlter = await (0, transportation_1.alterTransportation)(eventID, arrival, true);
            if (!successfulAlter) {
                throw new Error(`Failed to successfully alter arrival in database`);
            }
        }
        if (departure) {
            const successfulAlter = await (0, transportation_1.alterTransportation)(eventID, departure, false);
            if (!successfulAlter) {
                throw new Error(`Failed to successfully alter depature in database`);
            }
        }
        res.status(201).json({ message: "Transportation updated successfully" });
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
exports.updateTransportation = updateTransportation;
