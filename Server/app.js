import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connect } from "./config/connectDb.js";
import userRoutes from './routes/userRoutes.js'

const app = express();
const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;

app.use(cors());
connect(DATABASE_URL);
app.use(express.json());
app.use('/user', userRoutes)

app.listen(PORT, () => {
    console.log(`Server is Started In the 'http://LocalHost:${PORT}'`);
});
