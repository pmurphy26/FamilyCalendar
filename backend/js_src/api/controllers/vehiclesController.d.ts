import { Request, Response } from "express";
export declare const createFamilyVehicle: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteFamilyVehicle: (req: Request, res: Response) => Promise<void>;
export declare const updateFamilyVehicle: (req: Request, res: Response) => Promise<void>;
