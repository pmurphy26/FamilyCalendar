import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

import eventRoutes from "./api/routes/eventsRoutes";
import dayRoutes from "./api/routes/dayRoutes";
import calendarRoutes from "./api/routes/calendarRoutes";
import transportationRoutes from "./api/routes/transportationRoutes";
import familyRoutes from "./api/routes/familyRoutes";
import familyIndividualRoutes from "./api/routes/familyIndividualRoutes";
import vehicleRoutes from "./api/routes/vehicleRoutes";
app.use("/api", eventRoutes);
app.use("/api", dayRoutes);
app.use("/api", calendarRoutes);
app.use("/api", transportationRoutes);
app.use("/api", familyRoutes);
app.use("/api", familyIndividualRoutes);
app.use("/api", vehicleRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log("Loaded PORT:", process.env.PORT);

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
});
