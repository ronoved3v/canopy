import User from "../../models/User.js";

export const userList = async (req, res) => {
	try {
		const users = await User.find();
		const count = await User.countDocuments();

		return res.status(200).json({ total: count, data: users });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
