"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
// Components ui
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Main({ children, ...props }) {
	return (
		<main className="p-8 grow flex flex-col gap-8">
			<div className="relative w-full h-[600px] rounded-md overflow-hidden">
				<Image
					src="https://images.pexels.com/photos/5209205/pexels-photo-5209205.jpeg"
					fill
					objectFit="cover"
					objectPosition="bottom"
					alt="Picture of the author"
				/>
			</div>
			<Alert>
				<Terminal className="h-4 w-4" />
				<AlertTitle>Heads up!</AlertTitle>
				<AlertDescription>
					You can add components to your app using the cli.
				</AlertDescription>
			</Alert>
			<div>{children}</div>
		</main>
	);
}
