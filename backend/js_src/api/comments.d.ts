import { Comment } from "@shared/types";
export declare function getCommentWithID(id: number): Promise<Comment>;
export declare function getAllCommentsFromDB(): Promise<Comment[]>;
export declare function addCommentsToDB(comments: Comment[]): Promise<void>;
export declare function deleteCommentByID(id: number): Promise<boolean>;
export declare function updateCommentInDB(comment: Comment): Promise<boolean>;
