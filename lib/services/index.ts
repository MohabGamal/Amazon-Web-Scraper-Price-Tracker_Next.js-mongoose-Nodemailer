import axios from "axios"
import * as cheerio from "cheerio"
import {
	getAveragePrice,
	getHighestPrice,
	getLowestPrice,
	scrapeCurrentPrice,
} from "@/lib/utils"
import { IProductDocument, TProduct } from "@/types"
import { Product } from "@/lib/services/mongoose"

type TServiceResponse<T> = T | Error

export async function scrapeProduct(
	url: string
): Promise<TServiceResponse<TProduct>> {
	try {
		if (!url) throw new Error("The product URL is required")
		const productPage = await axios.get(url)
		const $ = cheerio.load(productPage.data)

		const title = $("#productTitle").text().trim()
		const isOutOfStock = $("div #outOfStock") ? true : false
		const brand = $("#bylineInfo").text().trim()
		const description = $("#productDescription").text().trim()

		const image = $("#landingImage").attr("src")
		if (!image) throw new Error("Image not found")

		let images = $("[class*='a-spacing-small item'] img")
			.map((i, el) => $(el).attr("src"))
			.get()
		images = images.length > 0 ? images : [image]

		const originalPriceString =
			$("#corePriceDisplay_desktop_feature_div span.a-size-small.aok-offscreen")
				.text()
				.replaceAll(",", "")
				.match(/(\d+).(\d+)/g)?.[0] ?? null
		if (!originalPriceString) throw new Error("Original price not found")
		const originalPrice = parseFloat(originalPriceString)

		const { currentPrice, currency, discountRate } = scrapeCurrentPrice(
			$("#corePriceDisplay_desktop_feature_div .aok-offscreen").html()
		)
		if (!currentPrice || !currency) throw new Error("Current price not found")

		const data: TProduct = {
			url,
			currency,
			image,
			title,
			description,
			currentPrice,
			originalPrice,
			priceHistory: [
				{ price: currentPrice ?? originalPrice, date: new Date() },
			],
			discountRate,
			category: "category",
			reviewsCount: 100,
			rating: 4.5,
			isOutOfStock,
			lowestPrice: currentPrice ?? originalPrice,
			averagePrice: currentPrice ?? originalPrice,
			highestPrice: originalPrice ?? currentPrice,
			users: [],
		}
		return data
	} catch (error: any) {
		console.error("Error scraping product", error)
		return new Error(error.message)
	}
}

export async function upsertProduct(
	product: TProduct
): Promise<TServiceResponse<IProductDocument>> {
	try {
		const existingProduct = await Product.findOne<IProductDocument | null>({
			url: product.url,
		})
		if (!existingProduct) {
			const newProduct: IProductDocument = new Product(product)
			await newProduct.save()
			return newProduct
		} else {
			existingProduct.priceHistory.push({
				price: product.currentPrice,
				date: new Date(),
			})
			existingProduct.lowestPrice = getLowestPrice(existingProduct.priceHistory)
			existingProduct.highestPrice = getHighestPrice(
				existingProduct.priceHistory
			)
			existingProduct.averagePrice = getAveragePrice(
				existingProduct.priceHistory
			)
			await existingProduct.save()
			return existingProduct
		}
	} catch (error: any) {
		console.error(error)
		return new Error(error.message)
	}
}
