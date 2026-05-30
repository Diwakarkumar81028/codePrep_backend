import { Router } from "express";
import { loginUser, registerUser,logoutUser,registerAdmin,deleteUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/verifyadmin.middleware.js";
const router=Router();
//1.register
// router.route("/register").post(
// //   upload.single("avatar"),
// //   registerUser
// // );

router.route("/register").post(registerUser);

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

//5.delete user account
router.route("/delete").post(verifyJWT,deleteUser)
//6.check_auth
router.route("/check").get(verifyJWT,(req,res)=>{

    const reply={
        fullName:req.user.fullName,
        emailId:req.user.email,
        username:req.user.username,
        _id:req.user._id
        
    }
    // console.log(req.user);
    res.status(200)
    .json({reply,message:"valid user"})
})
export default router;