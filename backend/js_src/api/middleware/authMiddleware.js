"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../logic/auth");
const JWT_SECRET = process.env.JWT_SECRET || "invalid-secret";
async function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing token" });
    }
    const token = auth.slice("Bearer ".length);
    //console.log(token);
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await (0, auth_1.findUserById)(payload.userId);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        // Attach user to request
        req.user = {
            id: user.id,
            username: user.username,
        };
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
