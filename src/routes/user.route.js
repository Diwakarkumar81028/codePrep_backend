import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router();
//1.register
router.route("/register").post(
        upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
    ]),
    registerUser)

//2.login
router.route("/login").post(loginUser)

export default router;