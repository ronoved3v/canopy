import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Token is missing" });
	}

	try {
		jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
			if (err) {
				return res
					.status(403)
					.json({ message: "Token is not valid", error: err });
			}
			req.user = user;
			next();
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: "An error occurred during authentication", error });
	}
};

export const requireAdmin = (req, res, next) => {
	if (req.user && req.user.role === "ADMIN") {
		next();
	} else {
		return res
			.status(403)
			.json({ message: "You need permission to perform this action" });
	}
};
