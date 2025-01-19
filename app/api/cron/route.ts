import { scrapeProduct, upsertProduct } from "@/lib/services"
import { Product, connectDB } from "@/lib/services/mongoose"
import { generateEmailBody, sendEmail } from "@/lib/services/nodemailer"
import { getEmailNotifType } from "@/lib/utils"
import { EmailProductInfo, IProductDocument, TProductWithId } from "@/types"
import { NextResponse } from "next/server"

export const maxDuration = 300 
export const dynamic ='force-dynamic'
export const revalidate = 0

export const GET = async () => {
	try {
		await connectDB()
		const products: IProductDocument[] | null = await Product.find()
		if (!products || products.length == 0) throw new Error("Products not found")
		const updatedProducts = await Promise.all(
			products.map(async (product) => {
				const scrapedProudct = await scrapeProduct(product.url)
				if (scrapedProudct instanceof Error) return product
				const UpdatedProduct = await upsertProduct(scrapedProudct)
        if (UpdatedProduct instanceof Error) return product
        const emailNotifType = getEmailNotifType(scrapedProudct, UpdatedProduct)
        if (!emailNotifType) return product
        const productInfo : EmailProductInfo = {
          title: UpdatedProduct.title,
          url: UpdatedProduct.url,
        }
        const emailContent = generateEmailBody(productInfo,emailNotifType)
        const userEmails = UpdatedProduct.users.map(user => user.email)
        await sendEmail(emailContent, userEmails)
        return UpdatedProduct
			})
		)
    return NextResponse.json({
      message: "OK",
      data: updatedProducts
    })
	} catch (error: any) {
    return NextResponse.json({
      message: "Error",
      error: error.message
    })
  } 
}
