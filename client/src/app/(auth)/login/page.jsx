"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, redirect } from "next/navigation";
import { useSession } from "next-auth/react";
// Components ui
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function LoginPage() {
	const { push } = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [pending, setPending] = useState(false);
	const { data: session, status } = useSession();
	if (status === "authenticated") {
		redirect("/dashboard");
	}
	const loginController = async (e) => {
		e.preventDefault();
		let toastLogin = toast.loading("Loading...", { position: "top-center" });
		try {
			setPending(true);

			const res = await signIn("credentials", {
				username: username,
				password: password,
				redirect: false,
			});

			if (res.ok) {
				setTimeout(() => {
					toast.success("Logged in successfully", { id: toastLogin });
					setPending(false);
					push("/dashboard");
				}, 500);
			} else {
				setTimeout(() => {
					toast.error(res.error, { id: toastLogin });
					setPending(false);
				}, 500);
			}
		} catch (error) {
			setTimeout(() => {
				toast.error("Login fail", { id: toastLogin });
				setError("Internal server error");
			}, 500);
		}
	};

	return (
		<section className="h-screen flex flex-col justify-between items-center lg:flex-row">
			<div className="grow w-full bg-[url('https://images.pexels.com/photos/19049834/pexels-photo-19049834/free-photo-of-surface-of-a-sandstone-wall.jpeg')] bg-cover lg:h-screen lg:flex-[0_0_50%] flex flex-col justify-between">
				<div className="p-6 text-white font-bold text-6xl">Anti-Anti Dev</div>
				<div className="p-6 text-white font-light text-lg">
					"Beyond Boundaries, Beyond Defenses: Anti-Anti Dev - Unleashing the
					Future of Code and Cyber Warfare."
				</div>
			</div>
			<div className="py-6 lg:flex-[0_0_50%] flex justify-center items-center">
				<Card className="lg:w-[80%] xl:w-96 max-w-sm">
					<CardHeader>
						<CardTitle>Login</CardTitle>
					</CardHeader>
					<CardContent>
						<form
							className="flex flex-col gap-4 w-80 bg-background lg:w-auto"
							onSubmit={loginController}
						>
							<div className="grid w-full max-w-sm items-center gap-1.5">
								<Label htmlFor="username">Username</Label>
								<Input
									type="username"
									id="username"
									placeholder="Username"
									onChange={(e) => setUsername(e.target.value)}
								/>
							</div>
							<div className="grid w-full max-w-sm items-center gap-1.5">
								<Label htmlFor="password">Password</Label>
								<Input
									type="password"
									id="password"
									placeholder="Password"
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							{pending ? (
								<Button disabled>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Please wait
								</Button>
							) : (
								<Button type="submit">Login</Button>
							)}
						</form>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}

export default LoginPage;
