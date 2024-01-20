import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import routes from "./src/api/v1/routes/index.js";

const app = express();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

const DEFAULT_PROTOCOL = process.env.DEFAULT_PROTOCOL || "http";
const DEFAULT_HOSTNAME = process.env.DEFAULT_HOSTNAME || "localhost";
const DEFAULT_PORT = process.env.DEFAULT_PORT || "4000";
const DEFAULT_HOST = `${DEFAULT_PROTOCOL}://${DEFAULT_HOSTNAME}:${DEFAULT_PORT}`;

const morganFormat = (tokens, req, res) => {
	const method = tokens.method(req, res);
	const url = `${DEFAULT_HOST}${tokens.url(req, res)}`;
	const status = tokens.status(req, res);
	const contentLength = tokens.res(req, res, "content-length");
	const responseTime = tokens["response-time"](req, res);

	return `${method} ${url} ${status} ${contentLength} - ${responseTime} ms`;
};
app.use(morgan(morganFormat));
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
