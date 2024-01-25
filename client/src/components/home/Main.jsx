"use client";
import React, { useEffect, useState } from "react";

export default function Main({ children, ...props }) {
	return (
		<main className="h-full flex flex-col justify-center items-center">
			<div>{children}</div>
		</main>
	);
}
