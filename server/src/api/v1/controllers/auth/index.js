import User from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redis from "../../helpers/redis.js";
import logger from "../../../../utils/logger/logger.js";

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
				code: 400,
				message: `Missing required fields: ${!username ? "username" : ""} ${
					!password ? "password" : ""
				} ${!email ? "email" : ""}`.trim(),
			});
		}

		const existingUser = await User.findOne({
			$or: [{ username: username }, { email: email }],
		});

		if (existingUser) {
			return res
				.status(400)
				.json({ code: 400, message: "User already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(password, salt);

		const newUser = await User.create({ username, password: hashed, email });

		const { password: userPassword, ...others } = newUser._doc;

		return res
			.status(201)
			.json({ code: 201, message: "Register successful", data: others });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ code: 500, message: "Internal server error" });
	}
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({
				code: 400,
				message: `Missing required fields: ${
					!username ? "username or email" : ""
				} ${!password ? "password" : ""}`.trim(),
			});
		}

		const user = await User.findOne({
			$or: [{ username: username }, { email: username }],
		});

		if (!user) {
			return res.status(400).json({ code: 400, message: "Account not found" });
		}

		const passwordCompare = await bcrypt.compare(password, user.password);

		if (!passwordCompare)
			return res.status(404).json({ code: 404, message: "Invalid password" });

		const { password: userPassword, accounts, ...others } = user._doc;

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

		return res.status(200).json({
			code: 200,
			message: "Login successful",
			data: { ...others, access_token },
		});
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ code: 500, message: "Internal server error" });
	}
};

export const refresh = async (req, res) => {
	const refresh_token = req.cookies.refresh_token;

	if (!refresh_token) {
		return res
			.status(401)
			.json({ code: 401, message: "You're not authenticated" });
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
			return res
				.status(403)
				.json({ code: 403, message: "Invalid refresh token" });
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
			code: 200,
			message: "Refresh token successful",
			data: { access_token: newAccessToken },
		});
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			// Handle specific JWT errors
			return res.status(403).json({ code: 403, message: "Invalid token." });
		}
		console.error(error);
		return res
			.status(500)
			.json({ code: 500, message: "Internal server error" });
	}
};

export const signout = async (req, res) => {
	// Retrieve the refresh token from cookies
	const refreshToken = req.cookies.refresh_token;

	// If there is no refresh token provided, send a 401 Unauthorized response
	if (!refreshToken) {
		return res.status(401).json({
			code: 401,
			message: "You're not authenticated",
		});
	}

	try {
		// Verify the refresh token to extract the user ID
		const decodedUser = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_SECRET,
		);

		// Retrieve the token from Redis
		const tokenInRedis = await redis.get(
			`canopy_refresh_token:${decodedUser._id}`,
		);

		// Check if the token exists and matches the one from the cookie
		if (!tokenInRedis || tokenInRedis !== refreshToken) {
			return res.status(400).json({
				code: 400,
				message: "Invalid refresh token",
			});
		}

		// Delete the token from Redis
		await redis.del(`canopy_refresh_token:${decodedUser._id}`);

		// Clear the refresh token cookie
		res.clearCookie("refresh_token", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			path: "/",
			sameSite: "strict",
		});

		// Send a successful signout response
		return res.status(200).json({
			code: 200,
			message: "Sign out successful",
		});
	} catch (error) {
		// If the token is invalid or there's another error with the JWT, send a 403 Forbidden response
		if (error instanceof jwt.JsonWebTokenError) {
			return res.status(403).json({
				code: 403,
				message: "Invalid refresh token due to JWT error",
			});
		}

		// Log the general error and send a 500 Internal Server Error response
		logger.error(error);
		return res.status(500).json({
			code: 500,
			message: "Internal server error",
		});
	}
};
