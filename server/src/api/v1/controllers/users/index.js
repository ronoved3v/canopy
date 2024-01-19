import Users from "../../models/Users.js";

export const userList = async (req, res) => {
	try {
		const users = await Users.find();

		return res.status(200).json(users);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
