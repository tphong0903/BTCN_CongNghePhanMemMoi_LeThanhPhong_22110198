import express, { Express } from "express";
import dotenv from "dotenv";
import cors from 'cors';
import viewEngine from "./config/viewEngine";
import initWebRoutes from './route/web';
import apiRoutes from './route/api'; 
import connectDB from "./config/configdb";

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

viewEngine(app);
initWebRoutes(app);
app.use("/v1/api", apiRoutes);

const port = parseInt(process.env.PORT ?? "8888", 10);

const startServer = async () => {
    try {
        await connectDB();
        
        app.listen(port, () => {
            console.log(`✅ Backend Nodejs is running on port: ${port}`);
        });

    } catch (error) {
        console.error("❌ Error connecting to DB or starting server:", error);
        process.exit(1); 
    }
};

startServer();