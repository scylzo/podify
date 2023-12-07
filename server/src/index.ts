import express from "express";
import "dotenv/config";
import "./db";

import authRouter from "./routers/auth";

const app = express();
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/public"));

app.use("/auth", authRouter);

const PORT = process.env.PORT || 8989;

app.listen(PORT, () => console.log("server is listening on port " + PORT));
