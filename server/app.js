import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import routes from "./src/api/v1/routes/index.js";

const app = express();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Parse incoming JSON data
app.use(cookieParser()); // Parse incoming cookies

// Routes
app.use(routes);

// Error handling middleware (example)
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ code: 500, message: "Internal Server Error" });
});

export default app;
