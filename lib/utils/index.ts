import { IProductDocument, TProduct } from "@/types"
const Notification = {
  WELCOME: 'WELCOME',
  CHANGE_OF_STOCK: 'CHANGE_OF_STOCK',
  LOWEST_PRICE: 'LOWEST_PRICE',
  THRESHOLD_MET: 'THRESHOLD_MET',
} as const
const THRESHOLD_PERCENTAGE = 40;

export const validateAmazonUrl = (searchPrompt: string) => {
	try {
		const url = new URL(searchPrompt)
		if (
			url.hostname?.includes("amazon.com") ||
			url.hostname?.includes("amazon.") ||
			url.hostname?.includes("amazon")
		) {
			// if the url is not in english
			url.pathname = "/-/en" + url.pathname
			return url.href
		} else throw new Error("Please enter a valid Amazon URL")
	} catch (error) {
		console.error(error)
		return error as Error
	}
}

export const scrapeCurrentPrice = (htmlPrice: string | null) => {
	if (!htmlPrice) return { price: null, currency: null, discountRate: null }
	const discountRate = htmlPrice.trim().split(" ")[2] ?? null
	const priceString = htmlPrice.trim().split(" ")[0].replaceAll(",", "")
	const isSpacedString = priceString.includes("&nbsp;")
	if (isSpacedString) {
		// like EGP
		const currency = priceString.split("&nbsp;")[0]
		const price = priceString.split("&nbsp;")[1]
		return { currentPrice: parseFloat(price), currency, discountRate }
	}
	return {
		currentPrice: parseFloat(priceString.substring(1)),
		currency: priceString[0],
		discountRate,
	}
}

export function getHighestPrice(priceList: { price: number }[]) {
	let highestPrice = priceList[0]

	for (let i = 0; i < priceList.length; i++) {
		if (priceList[i].price > highestPrice.price) {
			highestPrice = priceList[i]
		}
	}

	return highestPrice.price
}

export function getLowestPrice(priceList: { price: number }[]) {
	let lowestPrice = priceList[0]

	for (let i = 0; i < priceList.length; i++) {
		if (priceList[i].price < lowestPrice.price) {
			lowestPrice = priceList[i]
		}
	}

	return lowestPrice.price
}

export function getAveragePrice(priceList: { price: number }[]) {
	const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0)
	const averagePrice = sumOfPrices / priceList.length || 0

	return averagePrice
}

export const getEmailNotifType = (
	scrapedProduct: TProduct,
	currentProduct: IProductDocument
) => {
	const lowestPrice = getLowestPrice(currentProduct.priceHistory)

	if (scrapedProduct.currentPrice < lowestPrice) {
		return Notification.LOWEST_PRICE as keyof typeof Notification
	}
	if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
		return Notification.CHANGE_OF_STOCK as keyof typeof Notification
	}
	if (
		scrapedProduct.discountRate &&
		Number(scrapedProduct.discountRate) >= THRESHOLD_PERCENTAGE
	) {
		return Notification.THRESHOLD_MET as keyof typeof Notification
	}

	return null
}
