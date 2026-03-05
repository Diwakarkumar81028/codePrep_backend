
import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyadmin.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createProblem, deleteProblem, updateProblem } from "../controllers/problem.controller.js";

const router=Router();
//1. create
router.route('/create').post(verifyAdmin,createProblem)

//2.fetch
router.route('/:id').get(verifyJWT,)

//3.fetch all problem
router.route("/").get(verifyJWT);

//4.update
router.route('/update/:id').put(verifyAdmin,updateProblem)

//5.delete
router.route("dalete/:id").delete(verifyAdmin,deleteProblem)

//6.
router.route("/user").get(verifyJWT);

export default router;