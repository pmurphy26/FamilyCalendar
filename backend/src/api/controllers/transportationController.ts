import { Request, Response } from "express";
import { controller } from "../../database/db";
import {
  addTransportationsToDB,
  alterTransportation,
  getTransportationWithEventID,
} from "../logic/transportation";
import { CalendarEvent, TransportationForEvent } from "@shared/types";
import { createDayWithCalendarID, getCalendarDayIDByDate } from "../logic/days";

export const getTransportation = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const result = await getTransportationWithEventID(id);
    res.json(result);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};

export const addTransportations = async (req: Request, res: Response) => {
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

    const transportationsToAdd: Record<number, TransportationForEvent> = {};
    for (const transportationForEvent of transportation) {
      const { eventID, details } = transportationForEvent;

      /*if (!Array.isArray(events)) {
        res.status(400).json({ error: "'events' must be an array" });
        return;
      }*/

      transportationsToAdd[eventID] = details;
    }
    await addTransportationsToDB(transportationsToAdd);

    res.status(201).json({ message: "Events inserted successfully" });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};

export const updateTransportation = async (req: Request, res: Response) => {
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

    await alterTransportation(eventID, details);

    res.status(201).json({ message: "Events inserted successfully" });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};
