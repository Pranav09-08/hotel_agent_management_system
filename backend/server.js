import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import initDatabase from "./config/db.js";

initDatabase();

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running...");
});


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});