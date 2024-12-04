import express from "express";
import "dotenv/config.js";
import cors from "cors";
import router from "./routes/index.js";
import { connectDB } from "./db/connect.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", router);

connectDB();

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
