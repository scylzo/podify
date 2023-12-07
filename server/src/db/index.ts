import mongoose from "mongoose";
import { MONGO_URI } from "@/utils/variables";

mongoose
  .connect("mongodb://localhost:27017/podify")
  .then(() => console.log("db is connected"))
  .catch((error) => console.log("db connetion failed: ", error));
