import { Document } from "mongoose"

type withId<T> = T & { id: string; __v: number }

export type TProduct = {
	url: string
	currency: string
	image: string
	title: string
	description: string
	currentPrice: number
	originalPrice: number | null
	priceHistory: { price: number; date: Date }[]
	discountRate: string | null
	category: string
	reviewsCount: number
	rating: number
	isOutOfStock: boolean
	lowestPrice: number
	averagePrice: number
	highestPrice: number
	users: { email: string }[]
}
export type TProductWithId = withId<TProduct>
export interface IProductDocument extends TProduct, Document {}
export type NotificationType =
  | "WELCOME"
  | "CHANGE_OF_STOCK"
  | "LOWEST_PRICE"
  | "THRESHOLD_MET";

export type EmailContent = {
  subject: string;
  body: string;
};

export type EmailProductInfo = {
  title: string;
  url: string;
};