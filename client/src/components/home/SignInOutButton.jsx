import React from "react";
import { signOut } from "next-auth/react";

export default function SignInOutButton() {
	return (
		<button
			className="text-destructive"
			variant="link"
			onClick={() => signOut()}
		>
			Sign out
		</button>
	);
}
