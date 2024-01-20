import { Router } from "express";
const router = Router();

import authRoutes from "./auth/index.js";
import userRoutes from "./user/index.js";
import accountRoutes from "./account/index.js";
import itemRoutes from "./item/index.js";

// Auth routes
router.use("/api/v1/auth", authRoutes);
// User routes
router.use("/api/v1/user", userRoutes);
// Account routes
router.use("/api/v1/account", accountRoutes);
// Item routes
router.use("/api/v1/item", itemRoutes);

export default router;
