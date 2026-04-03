"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalendar = void 0;
const events_1 = require("../logic/events");
const calendar_1 = require("../logic/calendar");
const getCalendar = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }
        const result = await (0, calendar_1.getCalendarWithID)(id);
        res.json(result);
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.getCalendar = getCalendar;
const getEventsForDay = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }
        const result = await (0, events_1.getEventsForDayWithID)(id);
        res.json(result);
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
const addEvents = async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).json({ error: "Request body is required" });
            return;
        }
        const { days } = req.body;
        if (!days) {
            res.status(400).json({ error: "Request body must have field 'days'" });
            return;
        }
        const calendarEventsToAdd = {};
        for (const day of days) {
            const { dayID, events } = day;
            if (!Array.isArray(events)) {
                res.status(400).json({ error: "'events' must be an array" });
                return;
            }
            calendarEventsToAdd[dayID] = events;
        }
        await (0, events_1.addEventsToDB)(calendarEventsToAdd);
        res.status(201).json({ message: "Events inserted successfully" });
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
const deleteComment = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }
        const successfulDelete = false; //await deleteCommentByID(id);
        if (successfulDelete) {
            res.status(201).json({ message: "Comment deleted successfully" });
        }
        else {
            throw new Error("Comment with id " +
                id +
                "does not exist or was not deleted successfully.");
        }
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
const alterComment = async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).json({ error: "Request body is required" });
            return;
        }
        const comment = req.body;
        const successfulAlter = false; //await updateCommentInDB(comment);
        if (successfulAlter) {
            res.status(201).json({ message: "Comment altered successfully" });
        }
        else {
            throw new Error("Comment does not exist or was not altered successfully.");
        }
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
