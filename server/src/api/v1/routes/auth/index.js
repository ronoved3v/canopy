import { Router } from "express";
const router = Router();

import { register, login } from "../../controllers/auth/index.js";

// Register
router.post("/register", register);
// Login
router.post("/login", login);

export default router;
