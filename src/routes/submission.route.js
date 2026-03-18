
import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { runCode, submitProblem } from "../controllers/submission.controller.js";
// /api/v1/submission

const router=Router();

//1.submit a problem
 router.route('/submit/:id').post(verifyJWT,submitProblem)
//2.run code;
router.route('/run/:id').post(verifyJWT,runCode)

export default router;