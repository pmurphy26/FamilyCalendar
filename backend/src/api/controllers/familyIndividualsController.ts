import { Request, Response } from "express";
import { controller } from "../../database/db";
import { getFamilyForIndividualWithID } from "../logic/family";
import {
  CalendarEvent,
  FamilyIndividual,
  TransportationForEvent,
} from "@shared/types";
import { createDayWithCalendarID, getCalendarDayIDByDate } from "../logic/days";
import {
  createIndividualForFamily,
  createIndividualForFamilyUsingCode,
  deleteIndividualWithID,
  updateIndividual,
} from "../logic/familyIndividuals";

export const createFamilyIndividual = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const individual = req.body;

    const required_fields = ["role", "name", "canDrive", "canEditCalendar"];

    for (const r_field of required_fields) {
      if (!(r_field in individual)) {
        throw new Error(
          `Individual doesn't contain all fields. ${individual} is missing ${r_field}`,
        );
      }
    }

    const result = await createIndividualForFamily(
      id,
      individual as FamilyIndividual,
    );

    if (!result) {
      return res.status(409).json({ error: "error inserting into databse" });
    }

    res.json(result);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};

export const createFamilyIndividualWithCode = async (
  req: Request,
  res: Response,
) => {
  try {
    const { code, ...individual } = req.body;

    const required_fields = ["role", "name", "canDrive", "canEditCalendar"];

    for (const r_field of required_fields) {
      if (!(r_field in individual)) {
        throw new Error(
          `Individual doesn't contain all fields. ${individual} is missing ${r_field}`,
        );
      }
    }

    if (!code) {
      return res
        .status(400)
        .json({ error: `must include code field in request body` });
    }

    const result = await createIndividualForFamilyUsingCode(
      code,
      individual as FamilyIndividual,
    );

    if (!result) {
      return res.status(409).json({ error: "error inserting into databse" });
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};

export const deleteFamilyIndividual = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const result = await deleteIndividualWithID(id);
    res.json(result);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};

export const updateFamilyIndividual = async (req: Request, res: Response) => {
  try {
    const individual = req.body;

    const required_fields = [
      "id",
      "role",
      "name",
      "canDrive",
      "canEditCalendar",
    ];

    for (const r_field of required_fields) {
      if (!(r_field in individual)) {
        throw new Error(
          `Individual doesn't contain all fields. ${individual} is missing ${r_field}`,
        );
      }
    }

    const result = await updateIndividual(individual as FamilyIndividual);
    res.json(result);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};
