import { Router } from "express";
import { loginUser, registerUser,logoutUser,registerAdmin } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/verifyadmin.middleware.js";
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

//3.logout
router.route("/logout").post(verifyJWT,logoutUser)

//4.register admin
router.route("/admin/register").post(
            upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
    ]),
    verifyAdmin,
    registerAdmin
)

//5.
export default router;