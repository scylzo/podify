import mongoose from "mongoose";
const URI = process.env.MONGO_URI as string;

mongoose
  .connect(URI)
  .then(() => console.log("db is connected"))
  .catch((error) => console.log("db connetion failed: ", error));
