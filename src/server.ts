import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from './route/web';
import connectDB from "./config/configdb";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
viewEngine(app);
initWebRoutes(app);
connectDB();

const port = parseInt(process.env.PORT ?? "6969", 10);

app.listen(port, () => {
  console.log("Backend Nodejs is running on port:", port);
});