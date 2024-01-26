"use client";
import React, { useEffect } from "react";
import { signOut } from "next-auth/react";
import { signOutCookie } from "@/lib/actions";

export default function SignInOutButton() {
	const handleSignOut = async () => {
		try {
			const { code, message } = await signOutCookie();
			if (code === 200) {
				signOut();
			} else {
				// Toast error message if signOutCookie fails
				console.error("Failed to sign out:", message);
			}
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	useEffect(() => {
		// Cleanup function
		return () => {};
	}, []); // Empty dependency array to run only on mount

	return (
		<button className="text-destructive" variant="link" onClick={handleSignOut}>
			Sign Out
		</button>
	);
}
