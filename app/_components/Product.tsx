"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button";
import { AiOutlineShoppingCart } from "react-icons/ai"
import { Product } from "@/types";
import { urlForImage } from "@/lib/image";
import { formatPriceInUSD } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { addProduct, getProductQuanity } from "@/lib/redux/features/cart/cartSlice";

type Props = {
    product: Product
}

const Product = ({ product }: Props) => {

    const dispatch = useAppDispatch()
    const productQuantity = useAppSelector(state => getProductQuanity(state, product._id))

    return (
        <div className="relative flex flex-col gap-y-4 text-base">
            {productQuantity && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white w-8 h-8 flex items-center justify-center rounded-full">
                    <span className="text-sm rounded-full">{productQuantity}</span>
                </div>
            )}
            <Link href={`/${product.productSlug}`} className="aspect-square">
                <Image src={urlForImage(product.productImage)} alt="product image" className="w-full object-cover object-center rounded-lg aspect-square" width={500} height={500} />
            </Link>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold block mb-1">{product.productName}</h4>
                    <p className="inline-block ml-2">{formatPriceInUSD(product.price)}</p>
                </div>
                <Button className="rounded-xl text-base text-slate-100 bg-blue-700 hover:bg-blue-800 hover:text-white" size={'sm'} variant={'secondary'} onClick={() => dispatch(addProduct({ ...product }))}>
                    <AiOutlineShoppingCart />
                </Button>
            </div>
        </div>
    )
}

export default Product