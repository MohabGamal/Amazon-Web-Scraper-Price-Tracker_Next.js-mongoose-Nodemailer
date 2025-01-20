import mongoose from "mongoose"
import { IProductDocument } from "../../types"

let isConnectd = false

export const connectDB = async () => {
	try {
		mongoose.set("strict", false)
		if (!process.env.MONGO_URI) return console.error("MONGO_URI is not defined")
		if (isConnectd) return console.log("Already connected to DB")

		const isSuccessfulyConnected = await mongoose.connect(
			process.env.MONGO_URI,
			{}
		)
		if (!isSuccessfulyConnected)
			throw new Error("Server error, please try again later")
		isConnectd = true
		console.log("Connected to DB")
	} catch (error) {
		console.error("Error connecting to DB: ", error)
		throw error as Error
	}
}

const productSchema = new mongoose.Schema<IProductDocument>(
	{
		url: { type: String, required: true, unique: true },
		currency: { type: String, required: true },
		image: { type: String, required: true },
		title: { type: String, required: true },
		currentPrice: { type: Number, required: true },
		originalPrice: { type: Number, required: true },
		priceHistory: [
			{
				price: { type: Number, required: true },
				date: { type: Date, default: Date.now },
			},
		],
		lowestPrice: { type: Number },
		highestPrice: { type: Number },
		averagePrice: { type: Number },
		discountRate: { type: Number },
		description: { type: String },
		category: { type: String },
		reviewsCount: { type: Number },
		isOutOfStock: { type: Boolean, default: false },
		users: [{ email: { type: String, required: true } }],
	},
	{
		timestamps: true,
		toObject: {
			transform(doc, ret) {
				delete ret._id // Remove `_id` field
				ret.id = doc._id?.toString() // Add `id` instead of `_id`
			},
		},
	}
)

export const Product =
	mongoose.models.Product ||
	mongoose.model<IProductDocument>("Product", productSchema)
