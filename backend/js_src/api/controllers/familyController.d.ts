import { Request, Response } from "express";
export declare const getFamily: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createFamily: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
