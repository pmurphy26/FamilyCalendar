"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEvent = exports.addEvents = exports.getEventsForDay = exports.getEvent = void 0;
const events_1 = require("../logic/events");
const days_1 = require("../logic/days");
const getEvent = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }
        const result = await (0, events_1.getEventWithID)(id);
        if (!result) {
            return res
                .status(404)
                .json({ error: `Unable to get event with ${id} from database` });
        }
        res.json(result);
    }
    catch (err) {
        //console.error("DB ERROR:", err);
        if (err instanceof Error) {
            res.status(500).json({ error: err?.message ?? "unknown error" });
        }
        else {
            res.status(500).json({ error: "unknown error occured" });
        }
    }
};
exports.getEvent = getEvent;
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
exports.getEventsForDay = getEventsForDay;
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
            res.status(422).json({ error: "Request body must have field 'days'" });
            return;
        }
        //key=dayID, value=events being added to day
        const calendarEventsToAdd = {};
        for (const day of days) {
            const { dayID, events } = day;
            if (!Array.isArray(events)) {
                res.status(400).json({ error: "'events' must be an array" });
                return;
            }
            //TODO: verify contents of events are valid
            if (dayID == -1) {
                /* Calendar day doesn't exist in DB, need to create one */
                if (day.calendarInfo) {
                    const calendarInfo = day.calendarInfo;
                    const { calendarID, calendarDate } = calendarInfo;
                    if (calendarID == null || !calendarDate) {
                        res.status(400).json({
                            error: `calendar info must have calendarID and calendarDate fields ${calendarInfo}`,
                        });
                    }
                    else {
                        /* API call to create new calendar day */
                        const newCalendarDay = await (0, days_1.createDayWithCalendarID)(calendarID, calendarDate);
                        /* Verify creation was successful and add it to calendarEventsToAdd*/
                        if (!newCalendarDay || !newCalendarDay.id) {
                            throw new Error(`error creating new calendar day for 
                ${JSON.stringify(calendarDate)} on calendar with id ${calendarID}`);
                        }
                        calendarEventsToAdd[newCalendarDay.id] = events;
                    }
                }
                else {
                    res
                        .status(400)
                        .json({ error: "events must have valid id or calendar info" });
                    return;
                }
            }
            else {
                calendarEventsToAdd[dayID] = events;
            }
        }
        const addedEvents = await (0, events_1.addEventsToDB)(calendarEventsToAdd);
        if (Object.keys(addedEvents).length == 0) {
            return res
                .status(404)
                .json({ error: "unable to add events to database" });
        }
        res.status(201).json({ events: addedEvents });
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: err });
        }
    }
};
exports.addEvents = addEvents;
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
const updateEvent = async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).json({ error: "Request body is required" });
            return;
        }
        const event = req.body;
        if (event.calendarInfo) {
            const { newCalendarDayID, newDate } = event.calendarInfo;
            if (newCalendarDayID > -1) {
                const eventDayID = await (0, events_1.updateEventInDB)(event, newCalendarDayID);
                if (eventDayID != -1) {
                    res.status(201).json({
                        result: eventDayID,
                        message: "Event altered successfully for",
                    });
                    return;
                }
                else {
                    throw new Error("Event does not exist or was not altered successfully.");
                }
            }
            else {
                if (!newDate) {
                    res.status(400).json({
                        error: `calendar info must have calendarID and calendarDate fields ${event.calendarInfo}`,
                    });
                    return;
                }
                else {
                    const newID = await (0, days_1.getCalendarDayIDByDate)(newDate, 0);
                    const eventDayID = await (0, events_1.updateEventInDB)(event, newID);
                    //console.log(successfulAlter);
                    if (eventDayID != -1) {
                        res.status(201).json({
                            result: eventDayID,
                            message: "Event altered successfully",
                        });
                        return;
                    }
                    else {
                        throw new Error("Event does not exist or was not altered successfully.");
                    }
                }
            }
        }
        else {
            const eventDayID = await (0, events_1.updateEventInDB)(event);
            if (eventDayID != -1) {
                res
                    .status(201)
                    .json({ result: eventDayID, message: "Event altered successfully" });
                return;
            }
            else {
                throw new Error("Event does not exist or was not altered successfully.");
            }
        }
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.updateEvent = updateEvent;
