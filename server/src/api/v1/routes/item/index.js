import { Router } from "express";
const router = Router();

import {
	itemList,
	aItem,
	itemScan,
	getItemDownloadURL,
} from "../../controllers/item/index.js";

import {
	authenticateToken,
	requireAdmin,
} from "../../middleware/authMiddleware.js";

// Item list
router.get("/", itemList);
// Get a item
router.get("/:itemId", aItem);
// Item scan
router.post("/scan", itemScan);
// Get download link item
router.get("/download/:itemId", getItemDownloadURL);

export default router;
