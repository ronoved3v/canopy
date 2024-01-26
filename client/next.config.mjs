/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "images.pexels.com",
			},
			{
				hostname: "cdn.pixabay.com",
			},
		],
	},
};

export default nextConfig;
