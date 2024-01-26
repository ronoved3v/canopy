import React from "react";

export default function layout({ children }) {
	return (
		<section className="h-screen max-h-screen w-screen flex flex-row">
			<div className="w-80 h-full border-r border-separate flex flex-col justify-between">
				<div className="font-semibold text-xl border-b border-separate p-6">
					Canopy
				</div>
				<div className="grow font-semibold text-xl border-b border-separate p-6">
					Menu
				</div>
				<div className="font-semibold text-xl border-b border-separate p-6">
					User
				</div>
			</div>
			{children}
		</section>
	);
}
