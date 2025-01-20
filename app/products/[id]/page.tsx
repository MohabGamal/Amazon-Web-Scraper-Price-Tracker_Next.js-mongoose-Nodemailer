import Modal from "@/components/Modal"
import PriceInfoCard from "@/components/PriceInfoCard"
import ProductCard from "@/components/ProductCard"
import { getProductById, getProductsSimilar } from "@/lib/actions"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

type ProductDetailsProps = {
	params: { id: string }
}

const ProductDetails = async ({ params }: ProductDetailsProps) => {
	const { id } = await params
	const product = await getProductById(id)
	if (product instanceof Error) {
		alert(product.message)
		redirect("/")
	}
	const similarProducts = await getProductsSimilar(product)

	return (
		<div className="product-container">
			<div className="flex gap-28 xl:flex-row flex-col">
				<div className="product-image">
					<Image
						className="mx-auto"
						src={product.image}
						alt={product.title}
						width={580}
						height={400}
					/>
				</div>
				<div className="flex-1 flex flex-col gap-3 items-center">
					<div className="flex justify-between items-start gap-5 flex-wrap pb-6">
						<div className="flex flex-col gap-3">
							<p className="text-[28px] text-secondary font-semibold">
								{product.title}
							</p>
							<Link
								href={product.url}
								target="_blank"
								className="text-base text-black opacity-50"
							>
								Visit Product
							</Link>
						</div>
						<div className="flex items-center gap-3">
							<div className="product-hearts">
								<Image
									src="/assets/icons/red-heart.svg"
									alt="heart"
									width={20}
									height={20}
								/>
								<p className="text-base font-semibold text-[#D46F77]">
									{product.reviewsCount}
								</p>
							</div>
							<div className="p-2 bg-white-200 rounded-10">
								<Image
									src="/assets/icons/bookmark.svg"
									alt="bookmark"
									width={20}
									height={20}
								/>
							</div>

							<div className="p-2 bg-white-200 rounded-10">
								<Image
									src="/assets/icons/share.svg"
									alt="share"
									width={20}
									height={20}
								/>
							</div>
						</div>
					</div>
					<div className="product-info">
						<div className="flex flex-col gap-2">
							<p className="text-[34px] text-secondary font-bold">
								{product.currency} {product.currentPrice}
							</p>
							{product.currentPrice}{" "}
							<p className="text-[21px] text-black opacity-50 line-through">
								{product.currency} {product.originalPrice}
							</p>
						</div>
						<div className="flex flex-col gap-4">
							<div className="flex gap-3">
								<div className="product-stars">
									<Image
										src="/assets/icons/star.svg"
										alt="star"
										width={16}
										height={16}
									/>
									<p className="text-sm text-primary-orange font-semibold">
										{product.rating || 10}
									</p>
								</div>
								<div className="product-reviews">
									<Image
										src="/assets/icons/comment.svg"
										alt="commment"
										width={16}
										height={16}
									/>
									<p className="text-sm text-secondary font-semibold">
										{product.reviewsCount} reviews
									</p>
								</div>
							</div>
							<p className="text-sm text-black opacity-50">
								<span className="text-primary-green font-semibold">93% </span>{" "}
								of buyers have recommeded this.
							</p>
						</div>
					</div>
					<div className="my-7 flex flex-col gap-5">
						<div className="flex gap-5 flex-wrap">
							<PriceInfoCard
								title="Current Price"
								iconSrc="/assets/icons/price-tag.svg"
								value={`${product.currency} ${product.currentPrice}`}
							/>
							<PriceInfoCard
								title="Average Price"
								iconSrc="/assets/icons/chart.svg"
								value={`${product.currency} ${product.averagePrice}`}
							/>
							<PriceInfoCard
								title="Highest Price"
								iconSrc="/assets/icons/arrow-up.svg"
								value={`${product.currency} ${product.highestPrice}`}
							/>
							<PriceInfoCard
								title="Lowest Price"
								iconSrc="/assets/icons/arrow-down.svg"
								value={`${product.currency} ${product.lowestPrice}`}
							/>
						</div>
					</div>
					<Modal productId={id} />
					<div className="flex flex-col gap-10">
						<div className="flex flex-col gap-5">
							<h3 className="text-2xl text-secondary font-semibold">
								Product Description
							</h3>
							<div className="flex flex-col gap-4">
								{product?.description?.split("\n")}
							</div>
						</div>

						<button className="btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px] flex-g">
							<Image
								src="/assets/icons/bag.svg"
								alt="check"
								width={22}
								height={22}
							/>
							<Link href="/" className="text-base text-center text-white">
								Buy Now
							</Link>
						</button>
					</div>
					{!(similarProducts instanceof Error) && (
						<div className="py-4 flex flex-col gap-2 w-full">
							<div className="section-text">Similar Products</div>
							<div className="flex flex-wrap gap-10 mt-7 w-full"></div>
							{similarProducts.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default ProductDetails
