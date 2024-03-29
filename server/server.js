import "./dotenv.js";

import app from "./app.js";
import databaseConnection from "./config/database.js";

import logger from "./src/utils/logger/logger.js";

(async () => {
	try {
		// Connect to MongoDB using the mongodbConnection function
		await databaseConnection();

		// Start the server on the specified port (from environment variables)
		const port = process.env.DEFAULT_PORT || 3000; // Provide a default port if not defined
		app.listen(port, () => {
			logger.info(`Server is running on port ${port}!`);
		});
	} catch (error) {
		// If an error occurs during the setup process, log the error
		console.error(error);
		logger.error(`Error`);
		// Exit the Node.js process with an error code to indicate failure
		process.exit(1);
	}
})();
