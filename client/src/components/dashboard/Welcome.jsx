"use client";
import React from "react";
import { signOut } from "next-auth/react";
export default function Welcome({ user }) {
	return (
		<div>
			Welcome {user.username}
			<button onClick={() => signOut()}>Sign out</button>
		</div>
	);
}
