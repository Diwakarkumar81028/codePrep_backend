
import { Router } from "express";
import { verifyAdmin } from "../middlewares/verifyadmin.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createProblem, deleteProblem, updateProblem,getProblemById, getAllProblem, problemSolvedByUser } from "../controllers/problem.controller.js";


// /api/v1/problem
const router=Router();
//1. create
router.route('/create').post(verifyAdmin,createProblem)

//2.update a particular problem
router.route('/update/:id').put(verifyAdmin,updateProblem)

//3.delete problem by id
router.route('/delete/:id').delete(verifyAdmin,deleteProblem)



//4.fetch problem by id
router.route('/get/:id').get(verifyJWT,getProblemById)

//5.fetch all problem
router.route('/getall').get(verifyJWT,getAllProblem);

//6.
router.route("/solvedByUser").get(verifyJWT,problemSolvedByUser);

export default router;