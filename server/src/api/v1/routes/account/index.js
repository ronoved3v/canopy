import { Router } from "express";
const router = Router();

import { authenticateToken } from "../../middleware/authMiddleware.js";

import {
	accountList,
	addAccount,
	updateAccount,
	deleteAccount,
} from "../../controllers/account/index.js";

// Account list
router.get("/", accountList);

// Add account
router.post("/add", authenticateToken, addAccount);

// Delete account
router.delete("/:account_id", authenticateToken, deleteAccount);

export default router;
