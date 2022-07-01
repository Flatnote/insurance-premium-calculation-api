import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Pool } from "pg";
import axios from "axios";
import cors from "cors";

const app = express();
dotenv.config(); //Reads .env file and makes it accessible via process.env
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

const connectToDB = async () => {
  try {
    await pool.connect();
  } catch (err) {
    console.log(err);
  }
};

connectToDB();

app.get("/", async (req: Request, res: Response) => {
  // const result = await pool.query("SELECT $1::text as name", ["brianc"]);
  // console.log("result", result);
  res.send("API is working. !!");
});

app.post("/getProduct", async (req: Request, res: Response) => {
  try {
    const serviceURL = process.env.FWD_ECOMMERCE_SERVICE_URL || "";
    const result = await axios.post(serviceURL, req.body);
    res.send(result.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at ${process.env.PORT}`);
});
