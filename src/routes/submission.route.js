
import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
// /api/v1/submission

const router=Router();

//1.submit a problem
// router.route('/submit/:id').post(verifyJWT,submitProblem)


export default router;