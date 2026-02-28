import express from 'express'
import cookieParser from 'cookie-parser';
import cors from "cors"
//
const app = express()
//1.
app.use(cookieParser());
//2.
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
//3.
app.use(express.json());
//4.
app.use(express.urlencoded({extended:true}))
//5.
app.use(express.static("public"))


export default app;