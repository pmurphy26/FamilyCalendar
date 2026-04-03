import { Request, Response } from "express";
import { controller } from "../../database/db";
import {
  addEventsToDB,
  getEventsForDayWithID,
  getEventWithID,
} from "../logic/events";
import { CalendarEvent } from "@shared/types";
import {
  createDayWithCalendarID,
  getDaysWithCalendarID,
  getDayWithID,
} from "../logic/days";

export const getCalendarDayWithID = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const result = await getDayWithID(id);
    res.json(result);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};

export const getCalendarDaysWithID = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const result = await getDaysWithCalendarID(id);
    res.json(result);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};

export const createCalendarDay = async (req: Request, res: Response) => {
  try {
    const { calendarID, newCalendarDay } = req.body;

    if (isNaN(calendarID)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const result = await createDayWithCalendarID(calendarID, newCalendarDay);
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

const addEvents = async (req: Request, res: Response) => {
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

      calendarEventsToAdd[dayID] = events;
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

const alterComment = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      res.status(400).json({ error: "Request body is required" });
      return;
    }

    const comment = req.body;

    const successfulAlter = false; //await updateCommentInDB(comment);
    if (successfulAlter) {
      res.status(201).json({ message: "Comment altered successfully" });
    } else {
      throw new Error(
        "Comment does not exist or was not altered successfully.",
      );
    }
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};
