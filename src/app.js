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


//user ROUTING
import userRouter from "./routes/user.route.js"
app.use("/api/v1/user",userRouter);

//problem routing
import problemRouter from "./routes/problem.route.js"
app.use("/api/v1/problem",problemRouter)

//submission rouitng
import submissionRouter from "./routes/submission.route.js"
app.use("/api/v1/submission",submissionRouter)
export default app;