import Navbar from "@/components/Navbar"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })
const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
	title: "Amazon Price Tracker",
	description: "Track product prices effortlessly.",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Navbar />
				<main className="max-w-10xl mx-auto">{children}</main>
			</body>
		</html>
	)
}
