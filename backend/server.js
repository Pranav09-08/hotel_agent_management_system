import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import initDatabase from "./config/db.js";
import authRoute from "./routes/authRoute.js";

initDatabase();

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running...");
});

// Auth routes
app.use("/api/auth", authRoute);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});