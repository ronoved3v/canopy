"use client";

import { useSession } from "next-auth/react";
import axios from "../axios";

export const useRefreshAuth = () => {
	const { data: session } = useSession();

	const refreshToken = async () => {
		const res = await axios.post("/api/v1/auth/refresh");
	};
};
