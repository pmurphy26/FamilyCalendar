import { Request, Response } from "express";
import { controller } from "../../database/db";
import { createNewFamily, getFamilyForIndividualWithID } from "../logic/family";
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

    res.status(200).json(result);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};

export const createFamily = async (req: Request, res: Response) => {
  try {
    const family = await createNewFamily();

    if (!family || !family.id || !family.code) {
      return res.status(409).json({ error: "failed to create new family" });
    }

    res.status(200).json({ family: family });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: err });
    }
  }
};
