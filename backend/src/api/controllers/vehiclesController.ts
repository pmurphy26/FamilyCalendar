import { Request, Response } from "express";
import { Vehicle } from "@shared/types";

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

    if (id < 0) {
      return res
        .status(400)
        .json({ error: `family id must be greater than 0` });
    }

    const { name, numPeopleCanFit } = req.body;

    if (!name || !numPeopleCanFit) {
      throw new Error("must include name and numPeopleCanFit in request body");
    }

    const result = await createVehicleForFamily(id, {
      name,
      numPeopleCanFit,
    } as Vehicle);
    res.json(result);
  } catch (err) {
    console.error("DB ERROR:", err);
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: err });
    }
  }
};

export const deleteFamilyVehicle = async (req: Request, res: Response) => {
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
