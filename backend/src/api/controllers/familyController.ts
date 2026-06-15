import { Request, Response } from "express";
import { controller } from "../../database/db";
import { getFamilyForIndividualWithID } from "../logic/family";
import { CalendarEvent, TransportationForEvent } from "@shared/types";
import { createDayWithCalendarID, getCalendarDayIDByDate } from "../logic/days";

export const getFamily = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const result = await getFamilyForIndividualWithID(id);

    if (!result) {
      return res.status(400).json({
        error: `unable to get family for individual with id ${id}`,
      });
    }

    res.json(result);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};
