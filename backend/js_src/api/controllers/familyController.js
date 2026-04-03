"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFamily = void 0;
const family_1 = require("../logic/family");
const getFamily = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }
        const result = await (0, family_1.getFamilyForIndividualWithID)(id);
        res.json(result);
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.getFamily = getFamily;
