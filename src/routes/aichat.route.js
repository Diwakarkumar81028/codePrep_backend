import { Router } from "express";
import solveDoubt from "../controllers/aichat.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

// /api/v1/ai
const router=Router();
//1. create
router.route('/chat').post(verifyJWT,solveDoubt)

export default router;