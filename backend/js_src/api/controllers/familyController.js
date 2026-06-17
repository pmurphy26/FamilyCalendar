"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFamily = exports.getFamily = void 0;
const family_1 = require("../logic/family");
const getFamily = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "Invalid ID" });
            return;
        }
        const result = await (0, family_1.getFamilyForIndividualWithID)(id);
        if (!result) {
            return res.status(400).json({
                error: `unable to get family for individual with id ${id}`,
            });
        }
        res.status(200).json(result);
    }
    catch (err) {
        console.error("DB ERROR:", err);
        res.status(500).json({ error: err });
    }
};
exports.getFamily = getFamily;
const createFamily = async (req, res) => {
    try {
        const family = await (0, family_1.createNewFamily)();
        if (!family || !family.id || !family.code) {
            return res.status(409).json({ error: "failed to create new family" });
        }
        res.status(200).json({ family: family });
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: err });
        }
    }
};
exports.createFamily = createFamily;
