import "@/app/globals.css";
import { Fira_Code as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

import { cn } from "@/lib/utils";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";

export const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
	weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
	title: "Canopy",
};

export default function RootLayout({ children, ...props }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable,
				)}
			>
				<Providers>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
						<Toaster />
					</ThemeProvider>
				</Providers>
			</body>
		</html>
	);
}
