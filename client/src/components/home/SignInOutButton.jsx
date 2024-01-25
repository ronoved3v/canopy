import React from "react";
import { useSession } from "next-auth/react";
export default function SignInOutButton() {
	const { data: session } = useSession();
	if (session && session.user) return <div>{session.user}</div>;
}
