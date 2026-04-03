import { Request, Response } from "express";
export declare const getComment: (req: Request, res: Response) => Promise<void>;
export declare const getAllComments: (req: Request, res: Response) => Promise<void>;
export declare const addComments: (req: Request, res: Response) => Promise<void>;
export declare const deleteComment: (req: Request, res: Response) => Promise<void>;
export declare const alterComment: (req: Request, res: Response) => Promise<void>;
