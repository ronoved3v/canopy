"use client";
import React, { useEffect, useState } from "react";

export default function Main({ children, ...props }) {
	return (
		<main className="p-8 grow">
			Hello
			<div>{children}</div>
		</main>
	);
}
