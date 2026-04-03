"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alterComment = exports.deleteComment = exports.addComments = exports.getAllComments = exports.getComment = void 0;
const comments_1 = require("./comments");
const getComment = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }
        const result = await (0, comments_1.getCommentWithID)(id);
        res.json(result);
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.getComment = getComment;
const getAllComments = async (req, res) => {
    try {
        const result = await (0, comments_1.getAllCommentsFromDB)();
        res.json(result);
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.getAllComments = getAllComments;
const addComments = async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).json({ error: "Request body is required" });
            return;
        }
        const { comments } = req.body;
        if (!comments) {
            res
                .status(400)
                .json({ error: "Request body must have field 'comments'" });
            return;
        }
        if (!Array.isArray(comments)) {
            res.status(400).json({ error: "'comments' must be an array" });
            return;
        }
        await (0, comments_1.addCommentsToDB)(comments);
        res.status(201).json({ message: "Comments inserted successfully" });
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.addComments = addComments;
const deleteComment = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }
        const successfulDelete = await (0, comments_1.deleteCommentByID)(id);
        if (successfulDelete) {
            res.status(201).json({ message: "Comment deleted successfully" });
        }
        else {
            throw new Error("Comment with id " +
                id +
                "does not exist or was not deleted successfully.");
        }
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.deleteComment = deleteComment;
const alterComment = async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).json({ error: "Request body is required" });
            return;
        }
        const comment = req.body;
        const successfulAlter = await (0, comments_1.updateCommentInDB)(comment);
        if (successfulAlter) {
            res.status(201).json({ message: "Comment altered successfully" });
        }
        else {
            throw new Error("Comment does not exist or was not altered successfully.");
        }
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.alterComment = alterComment;
