"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const eventsRoutes_1 = __importDefault(require("./api/routes/eventsRoutes"));
const dayRoutes_1 = __importDefault(require("./api/routes/dayRoutes"));
const calendarRoutes_1 = __importDefault(require("./api/routes/calendarRoutes"));
const transportationRoutes_1 = __importDefault(require("./api/routes/transportationRoutes"));
const familyRoutes_1 = __importDefault(require("./api/routes/familyRoutes"));
const familyIndividualRoutes_1 = __importDefault(require("./api/routes/familyIndividualRoutes"));
const vehicleRoutes_1 = __importDefault(require("./api/routes/vehicleRoutes"));
app.use("/api", eventsRoutes_1.default);
app.use("/api", dayRoutes_1.default);
app.use("/api", calendarRoutes_1.default);
app.use("/api", transportationRoutes_1.default);
app.use("/api", familyRoutes_1.default);
app.use("/api", familyIndividualRoutes_1.default);
app.use("/api", vehicleRoutes_1.default);
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log("Loaded PORT:", process.env.PORT);
process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION:", err);
});
process.on("unhandledRejection", (reason) => {
    console.error("UNHANDLED REJECTION:", reason);
});
