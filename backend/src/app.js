import { configDotenv } from "dotenv";
configDotenv();
import express from "express"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from './routes/message.route.js'
import cookieParser from "cookie-parser"
import cors from 'cors'
import path from 'path'
import { apiLimiter } from "./middlewares/rateLimiter.js";
import connectDb from "./db/db.js"
import { app } from "./lib/socket.js";
connectDb();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.use(cookieParser());
app.use("/api", apiLimiter);

const __dirname=path.resolve();

app.use("/api/auth",authRoutes)

app.use('/api/messages',messageRoutes)


// make ready for deployment

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../frontend/dist')))

    app.get("*", (req,res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
    })
    
}





export {app}