"use client";
import React from "react";

export default function Footer() {
	return (
		<footer>
			<div className="px-8 py-4">
				<p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
					Built by
					<a
						href="#"
						target="_blank"
						rel="noreferrer"
						className="font-medium underline underline-offset-4"
					>
						{" "}
						antiantidev
					</a>
					. The source code is available on
					<a
						href="https://github.com/ronoved3v/canopy"
						target="_blank"
						rel="noreferrer"
						className="font-medium underline underline-offset-4"
					>
						{" "}
						GitHub
					</a>
					.
				</p>
			</div>
		</footer>
	);
}
