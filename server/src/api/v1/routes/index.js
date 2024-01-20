import { Router } from "express";
const router = Router();

import authRoutes from "./auth/index.js";
import userRoutes from "./user/index.js";
import accountRoutes from "./account/index.js";

// Auth routes
router.use("/api/v1/auth", authRoutes);
// User routes
router.use("/api/v1/user", userRoutes);
// Account routes
router.use("/api/v1/account", accountRoutes);

export default router;
