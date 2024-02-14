import { groq } from "next-sanity"

export const productListQuery = groq`
*[_type == "product"] {
    _id,
    _createdAt,
    _updatedAt,
    "productName": title,
    "productSlug": slug.current,
    productImage,
    price
  } | order(_updatedAt desc)`

export const productBySlugQuery = groq`
*[_type == "product" && $productSlug == slug.current] {
    _id,
    _createdAt,
    _updatedAt,
    "productName": title,
    "productSlug": slug.current,
    productImage,
    description,
    price
  }[0]`

export const relatedProductListQuery = groq`
*[_type == "product" && $productSlug != slug.current] {
    _id,
    _createdAt,
    _updatedAt,
    "productName": title,
    "productSlug": slug.current,
    productImage,
    price
  } | order(_updatedAt desc)
`