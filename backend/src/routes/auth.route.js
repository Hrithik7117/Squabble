import { json, Router } from "express";
import { login, signup,logout,updateProfile } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";



const router=Router()


router.post("/signup",authLimiter,signup)

router.post("/login",authLimiter,login)

router.post("/logout",logout)

router.put("/update-profile",requireAuth,updateProfile)

router.get('/check',requireAuth, (req,res) => res.status(200).json(req.user));

export default router