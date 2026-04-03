"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommentWithID = getCommentWithID;
exports.getAllCommentsFromDB = getAllCommentsFromDB;
exports.addCommentsToDB = addCommentsToDB;
exports.deleteCommentByID = deleteCommentByID;
exports.updateCommentInDB = updateCommentInDB;
const db_1 = require("../database/db");
async function getCommentWithID(id) {
    const result = await db_1.controller.query(`SELECT * FROM public."Comments" WHERE id = $1`, [id]);
    if (result.rowCount == 0) {
        throw new Error(`No comment found with ID ${id}`);
    }
    const row = result.rows[0];
    const required_fields = [
        "id",
        "author",
        "date",
        "text",
        "likes",
        "image_url",
    ];
    for (const r_field of required_fields) {
        if (!(r_field in row)) {
            throw new Error(`Comment doesn't contain all fields. ${row} is missing ${r_field}`);
        }
    }
    const returned_comment = {
        id: row?.id ?? -1,
        author: row?.author ?? "Invalid author name",
        text: row.text ?? "",
        date: row.date ?? "",
        likes: row.likes ?? -1,
        image: row.image_url ?? "",
    };
    return returned_comment;
}
async function getAllCommentsFromDB() {
    const result = await db_1.controller.query(`SELECT * FROM public."Comments" ORDER BY id ASC`);
    if (result.rowCount == 0) {
        throw new Error("No comments returned");
    }
    const allResults = result.rows;
    const allComments = allResults.map((row) => {
        const returned_comment = {
            id: Number(row?.id) ?? -1,
            author: row?.author ?? "Invalid author name",
            text: row.text ?? "",
            date: row.date ?? "",
            likes: Number(row.likes) ?? -1,
            image: row.image_url.trim() ?? "",
        };
        return returned_comment;
    });
    return allComments;
}
async function addCommentsToDB(comments) {
    try {
        await Promise.all(comments.map((comment) => {
            return db_1.controller.query(`INSERT INTO public."Comments" VALUES ($1, $2, $3, $4, $5, $6)`, [
                comment.id,
                comment.author,
                comment.text,
                comment.date,
                comment.likes,
                comment.image,
            ]);
        }));
    }
    catch (err) {
        if (err instanceof Error) {
            throw new Error(`Error while inserting comments: ${err.message}`);
        }
        throw new Error(`Error while inserting comments: ${String(err)}`);
    }
}
async function deleteCommentByID(id) {
    const result = await db_1.controller.query(`DELETE FROM public."Comments"
    WHERE id = $1
    RETURNING *;`, [id]);
    if (result.rows.length === 0) {
        return false;
    }
    return true;
}
async function updateCommentInDB(comment) {
    const result = await db_1.controller.query(`UPDATE public."Comments"
    SET
      author = $1,
      date = $2,
      text = $3,
      likes = $4,
      image_url = $5
    WHERE id = $6
    RETURNING *;`, [
        comment.author,
        comment.date,
        comment.text,
        comment.likes,
        comment.image,
        comment.id,
    ]);
    if (result.rows.length === 0) {
        return false;
    }
    return true;
}
