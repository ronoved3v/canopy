import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Components
import Welcome from "@/components/dashboard/Welcome";

// Server components function

export default async function Page() {
	const session = await getServerSession(authOptions);

	return (
		<section className="w-full h-screen">
			<div className="p-6">
				<Welcome user={session.user} />
			</div>
			<div className="p-6">Dashboard Page</div>
		</section>
	);
}
