import Link from 'next/link'
import Image from 'next/image'
// import { Button } from '@/components/ui/button'

import productOne from "../../public/images/product-one.jpeg"
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import AddToCart from '../_components/CartAction'
import Product from '../_components/Product'
import { productBySlugQuery, relatedProductListQuery } from '@/lib/query'
import { client } from '@/lib/client'
import { Product as ProductType } from "@/types";
import { urlForImage } from '@/lib/image'
import { formatPriceInUSD } from '@/lib/utils'
import CartAction from '../_components/CartAction'

type Props = {
    params: {
        productSlug: string
    }
}

const ProductPage = async ({ params: { productSlug } }: Props) => {

    const product: ProductType = await client.fetch(
        productBySlugQuery,
        {
            "productSlug": productSlug
        }
    )

    const products: ProductType[] = await client.fetch(
        relatedProductListQuery,
        {
            "productSlug": productSlug
        },
        {
            next: {
                revalidate: 3600
            }
        })

    return (
        <main>
            <section className="w-full flex md:flex-row flex-col gap-x-8 gap-y-8 mb-8">
                <div className='basis-1/2'>
                    <Link href={`/${productSlug}`}>
                        <Image src={urlForImage(product.productImage)} alt="product image" className="w-full aspect-square object-cover object-center rounded-lg" width={500} height={500} />
                    </Link>
                </div>
                <div className='basis-1/2'>
                    <h3 className='text-3xl font-bold mt-2 mb-6'>{product.productName}</h3>
                    <span className='text-blue-700 text-xl mb-6'>{formatPriceInUSD(product.price)}</span>
                    <p className='text-[.9em] leading-6 mb-8'>{product.description}</p>
                    <CartAction product={product} action='add'/>
                </div>
            </section>
            {products.length > 1 && (
                <section>
                    <h3 className='text-2xl font-bold mt-2 mb-6'>Related products</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map(product => (
                            <Product key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            )}
        </main>
    )
}

export default ProductPage