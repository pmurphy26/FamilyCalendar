import { Request, Response } from "express";
export declare const createFamilyIndividual: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteFamilyIndividual: (req: Request, res: Response) => Promise<void>;
export declare const updateFamilyIndividual: (req: Request, res: Response) => Promise<void>;
