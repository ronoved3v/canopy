"use client";

const { useSession } = require("next-auth/react");
const { useEffect } = require("react");
const { axiosAuth } = require("../axios");

const useAxiosAuth = () => {
	const { data: session } = useSession();

	useEffect(() => {
		const requestIntercept = axiosAuth.interceptors.request.use((config) => {
			if (!config.headers["Authorization"]) {
				config.headers[
					"Authorization"
				] = `Bearer ${session?.user.access_token}`;
			}
			return config;
		});
		return () => {
			axiosAuth.interceptors.request.eject(requestIntercept);
		};
	}, [session]);
	return axiosAuth;
};

export default useAxiosAuth;
