"use client"

import { urlForImage } from "@/lib/image";
import { getAllProducts, getTotalPrice } from "@/lib/redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { formatPriceInUSD } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import AddToCart from "../_components/CartAction";
import CartAction from "../_components/CartAction";

type Props = {}

const Cart = (props: Props) => {

    const products = useAppSelector(getAllProducts)

    return (
        <main className="relative">
            {products.length < 1 ? (
                <section>
                    <h3 className='text-2xl font-bold mt-2 mb-6'>Your cart is empty</h3>
                    <Link href="/">Continue Shopping</Link>
                </section>
            ) : (
                <section className="w-full flex flex-col gap-y-6">
                    {products.map(product => (
                        <div className="flex md:flex-row flex-col gap-y-4 gap-x-4">
                            <Link href={`/${product.productSlug}`} className="aspect-square md:w-4/12 md:basis-4/12 w-full basis-full">
                                <Image src={urlForImage(product.productImage)} alt="product image" className="w-full object-cover object-center rounded-lg aspect-square" width={500} height={500} />
                            </Link>
                            <div className="md:w-8/12 md:basis-8/12 w-full basis-full">
                                <h3 className='text-2xl font-bold mt-2 mb-6'>{product.productName}</h3>
                                <span className='text-blue-700 text-xl mb-6'>{formatPriceInUSD(product.price)}</span>
                                <p className='text-[.9em] leading-6 mb-8'>{product.description}</p>
                                <CartAction product={product} action="delete"/>
                            </div>
                        </div>
                    ))}
                </section>
            )}
        </main>
    )
}

export default Cart