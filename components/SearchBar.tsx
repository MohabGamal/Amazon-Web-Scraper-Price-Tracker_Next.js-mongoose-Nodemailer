"use client"
import { scrapeAndSaveProduct } from "@/lib/actions"
import { FormEvent, useState } from "react"
import { revalidatePath } from "next/cache"
import { validateAmazonUrl } from "@/lib/utils"

function SearchBar() {
	const [searchPrompt, setSearchPrompt] = useState("")
	const [isLoading, setIsLoading] = useState(false)

	const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
		try {
			event.preventDefault()
			setIsLoading(true)
      const productUrl = validateAmazonUrl(searchPrompt)
      if (productUrl instanceof Error) throw new Error("Please enter a valid Amazon URL")

			const product = await scrapeAndSaveProduct(productUrl)
			if (product instanceof Error) return alert(product)
			revalidatePath(`/products/${product.id}`)

		} catch (error: any) {
			console.error(error)
      alert(error.message)
		} finally {
			setIsLoading(false)
		}
	}
	return (
		<form className="flex gap-4 mt-12" onSubmit={handleSearch}>
			<input
				type="text"
				placeholder="Enter product link"
				value={searchPrompt}
				onChange={(e) => setSearchPrompt(e.target.value)}
				className="searchbar-input"
			/>
			<button
				type="submit"
				className="searchbar-btn"
				disabled={searchPrompt == ""}
			>
				{isLoading ? "Loading..." : "Search"}
			</button>
		</form>
	)
}

export default SearchBar
