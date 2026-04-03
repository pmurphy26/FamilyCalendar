"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCalendarDay = exports.getCalendarDaysWithID = exports.getCalendarDayWithID = void 0;
const events_1 = require("../logic/events");
const days_1 = require("../logic/days");
const getCalendarDayWithID = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }
        const result = await (0, days_1.getDayWithID)(id);
        res.json(result);
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.getCalendarDayWithID = getCalendarDayWithID;
const getCalendarDaysWithID = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }
        const result = await (0, days_1.getDaysWithCalendarID)(id);
        res.json(result);
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.getCalendarDaysWithID = getCalendarDaysWithID;
const createCalendarDay = async (req, res) => {
    try {
        const { calendarID, newCalendarDay } = req.body;
        if (isNaN(calendarID)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }
        const result = await (0, days_1.createDayWithCalendarID)(calendarID, newCalendarDay);
        res.json(result);
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.createCalendarDay = createCalendarDay;
const getAllComments = async (req, res) => {
    try {
        const result = {}; //await getAllCommentsFromDB();
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
