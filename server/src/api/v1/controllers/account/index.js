import User from "../../models/User.js";
import Account from "../../models/Account.js";

export const accountList = async (req, res) => {
	try {
		const accounts = await Account.find();
		const count = await Account.countDocuments();
		// Assuming accounts will always be an array; checking length is more appropriate
		if (accounts.length > 0) {
			return res.status(200).json({ total: count, data: accounts });
		} else {
			return res
				.status(404)
				.json({ total: count, data: [], message: "No accounts found" });
		}
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
};

export const addAccount = async (req, res) => {
	try {
		const { username, email, access_token } = req.body;

		// Retrieve user by ID
		const user = await User.findById(req.user._id);

		// Check if user exists
		if (!user) {
			return res.status(403).json({ message: "User not found" });
		}

		// Check for missing fields
		if (!username || !email || !access_token) {
			let missingFields = [];
			if (!username) missingFields.push("username");
			if (!email) missingFields.push("email");
			if (!access_token) missingFields.push("access_token");

			return res.status(400).json({
				message: `Required fields ${missingFields.join(", ")} are missing`,
			});
		}

		// Check for existing account with the same access token
		const existingAccount = await Account.findOne({ access_token });

		if (existingAccount) {
			return res.status(409).json({
				message: "An account with the given access token already exists",
			});
		}

		// Create a new account
		const newAccount = await Account.create({
			user: user._id,
			username,
			email,
			access_token,
		});

		// Push the new account's ID into the user's accounts array
		user.accounts.push(newAccount._id);
		await user.save();

		return res
			.status(201)
			.json({ message: "Account successfully added", result: newAccount });
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
};

export const deleteAccount = async (req, res) => {
	try {
		const { account_id } = req.params;
		const userId = req.user._id;

		// Validate account ID from the request parameters
		if (!account_id) {
			return res.status(400).json({ message: "Account ID is required." });
		}

		// Find the account by its ID
		const account = await Account.findById(account_id);
		if (!account) {
			return res.status(404).json({ message: "Account not found." });
		}

		// Check if the account belongs to the user making the request
		if (account.user.toString() !== userId.toString()) {
			// Assuming the 'user' field in 'Account' schema stores the _id of owning User
			return res
				.status(403)
				.json({ message: "User does not own this account." });
		}

		// Remove the account from the user's list of accounts
		const userUpdateResult = await User.updateOne(
			{ _id: userId },
			{ $pull: { accounts: account_id } }, // Using $pull to remove an item from the array
			{ new: true },
		);

		if (!userUpdateResult.acknowledged) {
			// Check if the User document was found and updated
			return res
				.status(404)
				.json({ message: "User not found or no update needed." });
		}

		// Proceed to delete the account
		await Account.findByIdAndDelete(account_id);

		return res.status(200).json({ message: "Account successfully deleted." });
	} catch (error) {
		// Catch any other errors that occur during the process
		return res
			.status(500)
			.json({ message: "Internal server error.", error: error.message });
	}
};

export const updateAccount = async (req, res) => {
	try {
		const { access_token } = req.params; // Or req.body if you expect the token to be in the request body
		const updateData = req.body; // This should be the data you want to update

		// First, find the account by access_token
		const account = await Account.findOne({ access_token });

		if (!account) {
			// If no account is found, return a 404 Not Found status with a message
			return res.status(404).json({ message: "Account not found" });
		}

		// Update the account with the new data
		const updatedAccount = await Account.findOneAndUpdate(
			{ access_token }, // The filter - how to find the doc
			updateData, // The update
			{ new: true }, // Options - return the modified document rather than the original
		);

		// If the update succeeded, return the updated account information
		return res.status(200).json({
			message: "Account successfully updated",
			result: updatedAccount,
		});
	} catch (error) {
		// In case of an error, respond with a 500 Internal Server Error status and the error message
		return res
			.status(500)
			.json({ message: "Internal server error", error: error.message });
	}
};
