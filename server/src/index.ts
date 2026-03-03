import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db/connection";
import { searchCompanies } from "./routes/gallery";
import { console } from "inspector";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/gallery", searchCompanies);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
