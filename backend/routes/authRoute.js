import express from "express";
import { login } from "../controllers/authController.js";
import { verifyToken, isAdmin, isSalesManager } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route - POST /api/auth/login
router.post("/login", login);

export default router;
