"use client";
import React from "react";

// Components ui
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignInOutButton from "./SignInOutButton";

export default function Header({ user }) {
	return (
		<header>
			<div className="px-8 py-6 flex flex-row justify-between">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">
						Welcome back! {user.username}
					</h2>
					<p className="text-muted-foreground">
						Here's a list of item from <strong>Themeforest</strong>!
					</p>
				</div>
				<div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Avatar>
								<AvatarImage
									src={`https://i.pravatar.cc/?u=${user.email}`}
									alt={`@${user.username}`}
								/>
								{/* <AvatarFallback>{user.username.split("")[0]}</AvatarFallback> */}
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent side="bottom" collisionPadding={32}>
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Profile</DropdownMenuItem>
							<DropdownMenuItem>Billing</DropdownMenuItem>
							<DropdownMenuItem>Team</DropdownMenuItem>
							<DropdownMenuItem>
								<SignInOutButton />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
