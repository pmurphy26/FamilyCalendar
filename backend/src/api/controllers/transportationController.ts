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

    const transportationsToAdd: Record<
      number,
      Record<string, TransportationForEvent>
    > = {};
    for (const { eventID, details } of transportation) {
      if (!transportationsToAdd[eventID]) {
        transportationsToAdd[eventID] = {};
      }

      for (const [type, transportationForEvent] of Object.entries(details)) {
        //TODO: check transportationForEvent has all req fields
        transportationsToAdd[eventID][type] =
          transportationForEvent as TransportationForEvent;
      }
    }

    //console.log(transportationsToAdd);
    await addTransportationsToDB(transportationsToAdd);

    res.status(201).json({ message: "Transportation inserted successfully" });
  } catch (err) {
    console.error("DB ERROR:", err);
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: err });
    }
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

    //console.log(`Passing details as ${JSON.stringify(details)}`);
    const { arrival, departure } = details;
    //console.log(`Passing details as ${JSON.stringify(arrival)}`);
    //console.log(`Passing details as ${JSON.stringify(departure)}`);

    if (arrival) {
      const successfulAlter = await alterTransportation(eventID, arrival);

      if (!successfulAlter) {
        throw new Error(`Failed to successfully alter arrival in database`);
      }
    }
    if (departure) {
      const successfulAlter = await alterTransportation(eventID, departure);

      if (!successfulAlter) {
        throw new Error(`Failed to successfully alter depature in database`);
      }
    }

    res.status(201).json({ message: "Transportation updated successfully" });
  } catch (err) {
    console.error("DB ERROR:", err);
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: err });
    }
  }
};
