import { Router } from "express";

const router=Router();
//1.register
router.route("/register").post(register)