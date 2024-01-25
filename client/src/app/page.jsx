import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import Main from "@/components/home/Main";

import { columns } from "@/components/home/columns";
import { DataTable } from "@/components/home/data.table";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function fetchItemList(page, limit) {
	try {
		const data = await fetch(
			process.env.BACKEND_API_URL +
				`/item?page=${page ?? 1}&limit=${limit ?? 8}`,
			{
				method: "GET",
			},
		);
		const dataRevice = await data.json();

		return dataRevice;
	} catch (error) {
		console.log(error);
	}
}

export default async function Home({ ...props }) {
	const session = await getServerSession(authOptions);
	const data = await fetchItemList(props.searchParams.page);

	return (
		<section className="flex flex-col h-screen max-h-screen justify-between">
			<Header user={session.user} />
			<Main>
				<DataTable
					columns={columns}
					data={data.data}
					props={props}
					meta={{ page: data.page, pages: data.pages }}
				/>
			</Main>
			<Footer />
		</section>
	);
}
