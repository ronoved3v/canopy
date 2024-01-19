import { Router } from "express";
const router = Router();

import { userList } from "../../controllers/users/index.js";

import {
	authenticateToken,
	requireAdmin,
} from "../../middleware/authMiddleware.js";

// User list
router.get("/", authenticateToken, requireAdmin, userList);

export default router;
