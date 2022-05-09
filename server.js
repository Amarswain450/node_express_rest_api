import express from "express";
import { APP_PORT, MONGODB_URL } from "./config";
import errorHandler from "./middlewares/errorHandler";
import mongoose from "mongoose";
import path from "path";
const app = express();

//databse config
mongoose.connect(MONGODB_URL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Database not connected..."));
db.once("open", () => {
  console.log("Database connected...");
});

//config global variable
global.appRoot = path.resolve(__dirname);

//config static files
app.use("/uploads", express.static("uploads"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//config routing
import router from "./routes/index";
app.use("/api", router);

app.use(errorHandler);

app.listen(APP_PORT, () => {
  console.log(`server running on port number : ${APP_PORT}`);
});
