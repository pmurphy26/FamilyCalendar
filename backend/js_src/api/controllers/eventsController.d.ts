import { Request, Response } from "express";
export declare const getEvent: (req: Request, res: Response) => Promise<void>;
export declare const getEventsForDay: (req: Request, res: Response) => Promise<void>;
export declare const addEvents: (req: Request, res: Response) => Promise<void>;
export declare const updateEvent: (req: Request, res: Response) => Promise<void>;
