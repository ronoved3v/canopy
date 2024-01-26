"use server";

import { cookies } from "next/headers";
import axios from "axios";

export const signOutCookie = async () => {
	try {
		const refresh_token = await cookies().get("refresh_token")?.value;
		if (!refresh_token)
			return { code: 401, message: "You're not authenticated" };
		const response = await axios.post(
			"http://localhost:4000/api/v1/auth/signout",
			{},
			{
				withCredentials: true,
				headers: {
					Cookie: `refresh_token=${refresh_token}`,
				},
			},
		);
		if (response.data && response.data.code === 200) {
			cookies().delete("refresh_token");
			return response.data;
		}
	} catch (error) {
		return {
			code: 500,
			message: "Internal server error",
		};
	}
};
