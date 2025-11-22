import cors from "cors";
import express from "express";
import matchRoutes from "./routes/matchRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/matches", matchRoutes);

export default app;
