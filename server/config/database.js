import mongoose from "mongoose";

const databaseConnection = async () => {
	try {
		// Use async/await to handle the connection asynchronously.
		await mongoose.connect(process.env.MONGODB_URL);

		// If the connection is successful, this line will be executed.
		console.log("Connection to MongoDB successful!");
	} catch (error) {
		// If an error occurs during the connection, it will be caught here.
		console.error("Failed to connect with MongoDB!");
	}
};

export default databaseConnection;
