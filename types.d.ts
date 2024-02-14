import type { Image } from 'sanity'

type Product = {
    _id: string
    _createdAt: string
    _updatedAt: string
    productName: string
    productSlug: string
    productImage: Image
    price: number
    description: string
}