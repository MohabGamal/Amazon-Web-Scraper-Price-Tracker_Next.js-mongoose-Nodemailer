import { TProductWithId } from "@/types"
import Image from "next/image"
import Link from "next/link"

type TProductCardProps = {
	product: TProductWithId
}

const ProductCard = ({ product }: TProductCardProps) => {
	return (
		<div>
			<Link href={`/products/${product.id}`} className="product-card">
				<div className="product-card_img-container">
					<Image
						src={product.image}
						alt={product.title}
						width={200}
						height={200}
						className="product-card_img"
					/>
				</div>
				<div className="flex flex-col gap-3">
					<h3 className="product-title">{product.title}</h3>
					<div className="flex justify-between">
						<p className="text-black opacity-50 text-lg capitalize">
							{product.category}
						</p>
						<p className="text-black text-lg font-semibold">
							<span>{product.currency}</span>
							<span>{product.currentPrice}</span>
						</p>
					</div>
				</div>
			</Link>
		</div>
	)
}

export default ProductCard
