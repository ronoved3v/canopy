"use client";

import { ColumnDef } from "@tanstack/react-table";

const formatDate = (currentDate) => {
	const date = new Date(currentDate);
	const now = new Date();

	const seconds = Math.floor((now - date) / 1000);
	let interval = Math.floor(seconds / 31536000);

	if (interval > 1) {
		return `${interval} years ago`;
	}
	interval = Math.floor(seconds / 2592000);
	if (interval > 1) {
		return `${interval} months ago`;
	}
	interval = Math.floor(seconds / 86400);
	if (interval > 1) {
		return `${interval} days ago`;
	}
	interval = Math.floor(seconds / 3600);
	if (interval > 1) {
		return `${interval} hours ago`;
	}
	interval = Math.floor(seconds / 60);
	if (interval > 1) {
		return `${interval} minutes ago`;
	}
	return `${Math.floor(seconds)} seconds ago`;
};

export const columns = [
	{
		accessorKey: "_id",
		header: "ID",
		cell: ({ row }) => {
			const value = row.getValue("_id");

			return <div className="max-w-20 truncate">{value}</div>;
		},
	},
	{
		accessorKey: "item.name",
		header: "Name",
	},
	{
		accessorKey: "amount",
		header: "Amount",
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("amount"));
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(amount);

			return <>{formatted}</>;
		},
	},

	{
		accessorKey: "license",
		header: "License",
	},
	{
		accessorKey: "sold_at",
		header: "Sold at",
		cell: ({ row }) => {
			const value = row.getValue("sold_at");
			const format = formatDate(value);
			return <div>{format}</div>;
		},
	},
	{
		accessorKey: "item.updated_at",
		header: "Updated at",
		cell: ({ row }) => {
			const value = row.original.item.updated_at;
			const format = formatDate(value);
			return <div>{format}</div>;
		},
	},
	{
		accessorKey: "account.username",
		header: "Owner",
	},
	{
		accessorKey: "code",
		header: "License Key",
	},
];
