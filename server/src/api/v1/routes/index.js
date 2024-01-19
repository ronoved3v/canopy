import { Router } from "express";
const router = Router();

import authRoutes from "./auth/index.js";
import userRoutes from "./users/index.js";

// Auth routes
router.use("/api/v1/auth", authRoutes);
// User routes
router.use("/api/v1/users", userRoutes);

export default router;
