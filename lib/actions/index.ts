"use server"
import { IProductDocument, TProductWithId } from "@/types"
import { scrapeProduct, upsertProduct } from "@/lib/services"
import { Product, connectDB } from "../services/mongoose"
import { generateEmailBody, sendEmail } from "../services/nodemailer"

type TActionResponse<T> = T | Error

export async function scrapeAndSaveProduct(
	productUrl: string
): Promise<TActionResponse<TProductWithId>> {
	try {
		await connectDB()
		const product = await scrapeProduct(productUrl)
		if (product instanceof Error) throw product
		const savedProduct = await upsertProduct(product)
    if (savedProduct instanceof Error) throw savedProduct
		return savedProduct.toObject() as TProductWithId
	} catch (error: any) {
		console.error(error)
		return new Error(error.message)
	}
}

export async function getProductById(
	produtId: string
): Promise<TActionResponse<TProductWithId>> {
	try {
		await connectDB()
		const product: IProductDocument | null = await Product.findOne({
			_id: produtId,
		})
		if (!product) throw new Error("Product not found")
		const flatProduct = product.toObject() as TProductWithId
		return flatProduct
	} catch (error: any) {
		console.error(error)
		return new Error(error.message)
	}
}

export async function getProducts(): Promise<
	TActionResponse<TProductWithId[]>
> {
	try {
		await connectDB()
		const products: IProductDocument[] = await Product.find()
		if (!products || products.length == 0) throw new Error("Products not found")
		const flatProducts = products.map(
			(product) => product.toObject() as TProductWithId
		)
		return flatProducts
	} catch (error: any) {
		console.error(error)
		return []
	}
}

export async function getProductsSimilar(
	product: TProductWithId
): Promise<TActionResponse<TProductWithId[]>> {
	try {
		await connectDB()
		const cleanedTitle = product.title
			.replace(/[^a-zA-Z0-9]/g, " ")
			.split(" ")
			.filter((word) => word.length > 3)
			.join("|")
		const cleanedDescription = product.description
			.replace(/[^a-zA-Z0-9]/g, " ")
			.split(" ")
			.filter((word) => word.length > 3)
			.join("|")
		const products: IProductDocument[] = await Product.find({
			_id: { $ne: product.id },
			title: { $regex: cleanedTitle, $options: "i" },
			description: { $regex: cleanedDescription, $options: "i" },
		}).limit(3)
		if (!products || products.length == 0) throw new Error("Products not found")
		const flatProducts = products.map(
			(product) => product.toObject() as TProductWithId
		)
		return flatProducts
	} catch (error: any) {
		console.log(error.message)
		return []
	}
}

export async function addUserEmailToProduct(
	productId: string,
	userEmail: string
): Promise<TActionResponse<void>> {
	try {
		await connectDB()
		const product: IProductDocument | null = await Product.findById(productId)
		if (!product) throw new Error("Product not found")
		const isUserExists = product.users.some(
			(user: { email: string }) => user.email === userEmail
		)
		if (!isUserExists) {
			product.users.push({ email: userEmail })
			await product.save()
		}
		const emailContent = generateEmailBody(product, "WELCOME")
		await sendEmail(emailContent, [userEmail])
	} catch (error: any) {
		console.error(error)
		return new Error(error.message)
	}
}
