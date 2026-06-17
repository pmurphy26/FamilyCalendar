import { Request, Response } from "express";
import { controller } from "../../database/db";
import {
  addEventsToDB,
  getEventsForDayWithID,
  getEventWithID,
} from "../logic/events";
import { CalendarEvent } from "@shared/types";
import { getDayWithID } from "../logic/days";
import {
  getCalendarForFamilyWithID,
  getCalendarWithID,
} from "../logic/calendar";

export const getCalendar = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const result = await getCalendarWithID(id);
    res.json(result);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};

export const getCalendarForFamily = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const result = await getCalendarForFamilyWithID(id);
    res.json(result);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};
