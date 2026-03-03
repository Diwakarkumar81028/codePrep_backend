// require('dotenv').config({path:'./env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { redisClient } from "./db/redis.js";
import app from "./app.js";
dotenv.config({
    path:'./env'
})
///////////////////////

const InitializeConnection=async ()=>{
    try{
        await Promise.all([connectDB(),redisClient.connect()]);
        console.log("db connected successfully");
        const port=process.env.PORT ||4000
        app.listen(port,()=>{
            console.log(`server is  listening on port ${port}`)
        })
    }
    catch(err){
        console.log("db connection or server starting error");
    }
}

InitializeConnection();

// connectDB()
// .then(()=>{
//     const port=process.env.PORT || 4000
//     app.listen(port, () => {
//     console.log(`server is  listening on port ${port}`)
// })
// })
// .catch((err)=>{
//    console.log("server starting error");
// })









