import Image from "next/image"
import SearchBar from "@/components/SearchBar"
import HeroCarousel from "@/components/HeroCarousel"
import { getProducts } from "@/lib/actions"
import ProductCard from "@/components/ProductCard"

async function Home() {
	const products = await getProducts()
	return (
		<>
			<section className="px-6 py-24 md:px-20">
				<div className="flex gap-16 max-xl:flex-col">
					<div className="flex flex-col justify-center">
						<p className="small-text">
							Smart Price Tracker
							<Image
								src="/assets/icons/arrow-right.svg"
								alt="arrow-right"
								width={16}
								height={16}
							/>
						</p>
						<h1 className="head-text">
							Unleash the power of {""}
							<span className="text-primary">AmazonTracker</span>
						</h1>
						<p className="mt-6">Powerful, easy to use, and secure.</p>
						<SearchBar />
					</div>
					<HeroCarousel />
				</div>
			</section>

			<section className="trending-section">
				<h2 className="section-text">Trending</h2>
				<div className="flex flex-wrap gap-x-8 gap-y-16">
					{!(products instanceof Error) &&
						products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
				</div>
			</section>
		</>
	)
}

export default Home
