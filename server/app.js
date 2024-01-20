import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rfs from "rotating-file-stream";

import routes from "./src/api/v1/routes/index.js";

const app = express();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

const accessLogStream = rfs.createStream("access.log", {
	interval: "1d", // rotate daily
	path: "log/access",
});

app.use(morgan("common", { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use(routes);

// Error handling middleware (example)
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ code: 500, message: "Internal Server Error" });
});

export default app;
