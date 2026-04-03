import { Request, Response } from "express";
import { controller } from "../../database/db";
import {
  addEventsToDB,
  getEventsForDayWithID,
  getEventWithID,
  updateEventInDB,
} from "../logic/events";
import { CalendarEvent } from "@shared/types";
import { createDayWithCalendarID, getCalendarDayIDByDate } from "../logic/days";

export const getEvent = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const result = await getEventWithID(id);
    res.json(result);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};

export const getEventsForDay = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const result = await getEventsForDayWithID(id);
    res.json(result);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};

const getAllComments = async (req: Request, res: Response) => {
  try {
    const result = {}; //await getAllCommentsFromDB();
    res.json(result);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};

export const addEvents = async (req: Request, res: Response) => {
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

    const calendarEventsToAdd: Record<number, CalendarEvent[]> = {};
    for (const day of days) {
      const { dayID, events } = day;

      if (!Array.isArray(events)) {
        res.status(400).json({ error: "'events' must be an array" });
        return;
      }

      if (dayID == -1) {
        if (day.calendarInfo) {
          const calendarInfo = day.calendarInfo;
          const { calendarID, calendarDate } = calendarInfo;

          if (calendarID == null || !calendarDate) {
            res.status(400).json({
              error: `calendar info must have calendarID and calendarDate fields ${calendarInfo}`,
            });
          } else {
            const newID = await createDayWithCalendarID(
              calendarID,
              calendarDate,
            );
            calendarEventsToAdd[newID] = events;
          }
        } else {
          res
            .status(400)
            .json({ error: "events must have valid id or calendar info" });
          return;
        }
      } else {
        calendarEventsToAdd[dayID] = events;
      }
    }
    await addEventsToDB(calendarEventsToAdd);

    res.status(201).json({ message: "Events inserted successfully" });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const successfulDelete = false; //await deleteCommentByID(id);
    if (successfulDelete) {
      res.status(201).json({ message: "Comment deleted successfully" });
    } else {
      throw new Error(
        "Comment with id " +
          id +
          "does not exist or was not deleted successfully.",
      );
    }
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      res.status(400).json({ error: "Request body is required" });
      return;
    }

    const event = req.body;

    if (event.calendarInfo) {
      const { newCalendarDayID, newDate } = event.calendarInfo;

      if (newCalendarDayID > -1) {
        const successfulAlter = await updateEventInDB(event, newCalendarDayID);

        if (successfulAlter) {
          res.status(201).json({ message: "Event altered successfully" });
          return;
        } else {
          throw new Error(
            "Event does not exist or was not altered successfully.",
          );
        }
      } else {
        if (!newDate) {
          res.status(400).json({
            error: `calendar info must have calendarID and calendarDate fields ${event.calendarInfo}`,
          });
          return;
        } else {
          const newID = await getCalendarDayIDByDate(newDate, 0);
          const successfulAlter = await updateEventInDB(event, newID);
          //console.log(successfulAlter);
          if (successfulAlter) {
            res.status(201).json({ message: "Event altered successfully" });
            return;
          } else {
            throw new Error(
              "Event does not exist or was not altered successfully.",
            );
          }
        }
      }
    } else {
      const successfulAlter = await updateEventInDB(event);
      if (successfulAlter) {
        res.status(201).json({ message: "Event altered successfully" });
        return;
      } else {
        throw new Error(
          "Event does not exist or was not altered successfully.",
        );
      }
    }
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};
