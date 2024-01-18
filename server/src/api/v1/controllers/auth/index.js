import Users from "../../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import redis from "../../helpers/redis.js";

const generateToken = (payload, secret, expired) => {
	return jwt.sign(payload, secret, expired ? { expiresIn: expired } : {});
};

export const register = async (req, res) => {
	try {
		const { username, password, email } = req.body;

		if (!username || !password || !email) {
			const missingFields = [];

			if (!username) {
				missingFields.push("username");
			}

			if (!password) {
				missingFields.push("password");
			}

			if (!email) {
				missingFields.push("email");
			}

			return res.status(400).json({
				message: `Missing required fields: ${missingFields.join(", ")}`,
			});
		}

		const existingUser = await Users.findOne({
			$or: [{ username: username }, { email: email }],
		});

		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(password, salt);

		await Users.create({ username, password: hashed, email });

		return res.status(200).json({ username, password, email });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			const missingFields = [];

			if (!username) {
				missingFields.push("username or email");
			}

			if (!password) {
				missingFields.push("password");
			}

			return res.status(400).json({
				message: `Missing required fields: ${missingFields.join(", ")}`,
			});
		}

		const user = await Users.findOne({
			$or: [{ username: username }, { email: username }],
		});

		if (!user) {
			return res.status(400).json({ message: "Tai khoan khong ton tai" });
		}

		const passwordCheck = await bcrypt.compare(password, user.password);

		if (!passwordCheck)
			return res.status(404).json({ message: "Invalid password" });

		const { password: userPassword, ...others } = user._doc;

		const access_token = generateToken(
			others,
			process.env.JWT_ACCESS_SECRET,
			"30s",
		);
		const refresh_token = generateToken(others, process.env.JWT_REFRESH_SECRET);

		await redis.set(`canopy_refresh_token:${user._id}`, refresh_token);

		res.cookie("refresh_token", refresh_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production" ? true : false,
			path: "/",
			sameSite: "strict",
		});

		return res.status(200).json({ ...others, access_token });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
