import { Router } from "express";
const router = Router();

import { register, login, refresh } from "../../controllers/auth/index.js";
import { authenticateToken } from "../../middleware/authMiddleware.js";

// Register
router.post("/register", register);
// Login
router.post("/login", login);
// Refresh
router.post("/refresh", refresh);

export default router;
