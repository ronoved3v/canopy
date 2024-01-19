import Users from "../../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redis from "../../helpers/redis.js";

const generateJWT = (payload, secret, expires) => {
	return jwt.sign(
		payload,
		secret,
		expires
			? {
					expiresIn: expires,
			  }
			: {},
	);
};

export const register = async (req, res) => {
	try {
		const { username, password, email } = req.body;

		if (!username || !password || !email) {
			return res.status(400).json({
				message: `Missing required fields: ${!username ? "username" : ""} ${
					!password ? "password" : ""
				} ${!email ? "email" : ""}`.trim(),
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

		const newUser = await Users.create({ username, password: hashed, email });

		const { password: userPassword, ...others } = newUser._doc;

		return res.status(200).json(others);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({
				message: `Missing required fields: ${
					!username ? "username or email" : ""
				} ${!password ? "password" : ""}`.trim(),
			});
		}

		const user = await Users.findOne({
			$or: [{ username: username }, { email: username }],
		});

		if (!user) {
			return res.status(400).json({ message: "Account not found" });
		}

		const passwordCompare = await bcrypt.compare(password, user.password);

		if (!passwordCompare)
			return res.status(404).json({ message: "Invalid password" });

		const { password: userPassword, ...others } = user._doc;

		const access_token = generateJWT(
			{ ...others },
			process.env.JWT_ACCESS_SECRET,
			"1h",
		);
		const refresh_token = generateJWT(
			{ ...others },
			process.env.JWT_REFRESH_SECRET,
		);

		await redis.set(`canopy_refresh_token:${user._id}`, refresh_token);

		res.cookie("refresh_token", refresh_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			path: "/",
			sameSite: "strict",
		});

		return res.status(200).json({ ...others, access_token });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const refresh = async (req, res) => {
	const refresh_token = req.cookies.refresh_token;

	if (!refresh_token) {
		return res.status(401).json({ message: "You're not authenticated" });
	}

	try {
		const decodedUser = jwt.verify(
			refresh_token,
			process.env.JWT_REFRESH_SECRET,
		);

		// Check if the refresh_token is in Redis
		const existingToken = await redis.get(
			`canopy_refresh_token:${decodedUser._id}`,
		);
		if (!existingToken || existingToken !== refresh_token) {
			// If it is not, or does not match, return an error
			return res.status(403).json({ message: "Invalid refresh token" });
		}

		// Extract the non-sensitive fields to include in the new tokens
		const { iat, exp, ...payload } = decodedUser;

		const newAccessToken = generateJWT(
			payload,
			process.env.JWT_ACCESS_SECRET,
			"1h", // Fixed to 1 hour, adjust as per requirement
		);
		const newRefreshToken = generateJWT(
			payload,
			process.env.JWT_REFRESH_SECRET,
		);

		// Overwrite the old refresh token in Redis with the new one
		await redis.set(`canopy_refresh_token:${decodedUser._id}`, newRefreshToken);

		res.cookie("refresh_token", newRefreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production", // Set to true in production
			path: "/",
			sameSite: "strict",
		});

		return res.status(200).json({
			access_token: newAccessToken,
		});
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			// Handle specific JWT errors
			return res.status(403).json({ message: "Invalid token." });
		}
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
};
