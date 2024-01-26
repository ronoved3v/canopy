import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

import axios from "axios";
import { cookies } from "next/headers";

// Function to parse a cookie string into an object
function parseCookie(cookieString) {
	// Create an object to store the parts of the cookie
	const cookieObject = {};

	// Split the cookie string into parts
	const cookieParts = cookieString.split(";");

	// Loop through each part of the cookie and add it to the object
	cookieParts.forEach((part) => {
		// Split each part into key and value
		const [key, value] = part.trim().split("=");
		// Add key-value pair to the cookie object
		cookieObject[key] = value;
	});

	// Return the parsed cookie object
	return cookieObject;
}

export const authOptions = {
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async jwt({ token, user, account }) {
			return { ...token, ...user };
		},
		async session({ session, user, token }) {
			if (!session) return;
			return {
				...session,
				user: {
					_id: token._id,
					username: token.username,
					email: token.email,
					role: token.role,
					createdAt: token.createdAt,
					updatedAt: token.updatedAt,
					__v: token.__v,
					access_token: token.access_token,
				},
			};
		},
		async redirect({ url, baseUrl }) {
			// Allows relative callback URLs
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		},
	},
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {},
			async authorize(credentials, req) {
				try {
					const { username, password } = credentials;
					const response = await axios.post(
						process.env.BACKEND_API_URL + "/auth/login",
						{
							username,
							password,
						},
					);
					const result = await response.data;

					if (response.status !== 200) {
						return null;
					}

					// If no error and we have user data, return it
					if (result.code === 200 && result.data) {
						const cookie = parseCookie(response.headers["set-cookie"][0]);

						cookies().set("refresh_token", cookie.refresh_token, {
							httpOnly: cookie.HttpOnly === undefined ? true : false,
							path: cookie.Path,
							sameSite: "Lax",
						});
						return result.data;
					}
					// Return null if user data could not be retrieved
					return null;
				} catch (error) {
					if (error && error.response.data) {
						throw new Error(error.response.data.message);
					}
					return null;
				}
			},
		}),
	],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
