import * as winston from "winston";
import "winston-daily-rotate-file";

const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf, filter } = format;

// Our custom filter
const ignorePrivate = format((info, opts) => {
	if (info.level === opts.level) {
		return info;
	}
	return false;
});

const infoTransport = new transports.DailyRotateFile({
	level: "info",
	filename: "log/info/info-%DATE%.log",
	datePattern: "YYYY-MM-DD",
	zippedArchive: true,
	maxSize: "20m",
	maxFiles: "14d",
	format: combine(ignorePrivate({ level: "info" })),
});

const errorTransport = new transports.DailyRotateFile({
	level: "error",
	filename: "log/error/error-%DATE%.log",
	datePattern: "YYYY-MM-DD",
	zippedArchive: true,
	maxSize: "20m",
	maxFiles: "14d",
});

const combineTransport = new transports.DailyRotateFile({
	level: "debug",
	filename: "log/combined/combined-%DATE%.log",
	datePattern: "YYYY-MM-DD",
	zippedArchive: true,
	maxSize: "20m",
	maxFiles: "14d",
});

const myFormat = printf(({ level, message, label, timestamp }) => {
	return `${timestamp} [${label}] ${level}: ${message}`;
});

const consoleTransport = new transports.Console({
	format: format.combine(
		format.colorize(),
		myFormat, // This will also format console messages
	),
});

const logger = createLogger({
	format: combine(label({ label: "canopy-server" }), timestamp(), myFormat),
	transports: [
		consoleTransport, // To see logs in the console
		infoTransport,
		errorTransport,
		combineTransport, // This will log all levels to a single file
	],
});

export default logger;
