import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rfs from "rotating-file-stream";

import routes from "./src/api/v1/routes/index.js";

const app = express();

// Middleware setup

const allowlist = ["http://localhost:3000"];
const corsOptionsDelegate = function (req, callback) {
	let corsOptions;
	if (allowlist.indexOf(req.header("Origin")) !== -1) {
		corsOptions = {
			origin: true, // Reflect the requested origin in the CORS response
			credentials: true, // Allow credentials (cookies, authorization headers, etc.)
		};
	} else {
		corsOptions = {
			origin: false, // Disable CORS for this request
			credentials: false, // Do not allow credentials
		};
	}
	callback(null, corsOptions); // Callback expects two parameters: error and options
};

app.use(cors(corsOptionsDelegate));

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
