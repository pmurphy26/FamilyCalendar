import { Request, Response } from "express";
import { controller } from "../../database/db";
import { getFamilyForIndividualWithID } from "../logic/family";
import {
  CalendarEvent,
  FamilyIndividual,
  TransportationForEvent,
  Vehicle,
} from "@shared/types";
import { createDayWithCalendarID, getCalendarDayIDByDate } from "../logic/days";

import {
  createVehicleForFamily,
  deleteVehicleWithID,
  updateVehicle,
} from "../logic/vehicle";

export const createFamilyVehicle = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const individual = req.body;

    const required_fields = ["name", "numPeopleCanFit"];

    for (const r_field of required_fields) {
      if (!(r_field in individual)) {
        throw new Error(
          `Vehicle doesn't contain all fields. ${individual} is missing ${r_field}`,
        );
      }
    }

    const result = await createVehicleForFamily(id, individual as Vehicle);
    res.json(result);
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

    const result = await deleteVehicleWithID(id);
    res.json(result);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};

export const updateFamilyVehicle = async (req: Request, res: Response) => {
  try {
    const individual = req.body;

    const required_fields = ["id", "name", "numPeopleCanFit"];

    for (const r_field of required_fields) {
      if (!(r_field in individual)) {
        throw new Error(
          `Individual doesn't contain all fields. ${individual} is missing ${r_field}`,
        );
      }
    }

    const result = await updateVehicle(individual as Vehicle);
    res.json(result);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err });
  }
};
