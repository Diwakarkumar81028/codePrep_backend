
import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyadmin.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware";

const router=Router();
//1. create
router.route('/create').post(verifyAdmin)

//2.fetch
router.route('/:id').get(verifyJWT,)

//3.fetch all problem
router.route("/").get(verifyJWT);

//4.update
router.route('/:id').patch(verifyAdmin)

//5.delete
router.route("/:id").delete(verifyAdmin)

//6.
router.route("/user").get(verifyJWT);

export default router;