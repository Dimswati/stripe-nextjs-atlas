"use client"

import React, { useState } from 'react'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import { Button } from '@/components/ui/button'
import { Product } from "@/types"
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { addProduct, decrementProductQuantity, deleteProduct, getProductQuanity } from '@/lib/redux/features/cart/cartSlice'

type CartAction = "delete" | "add"

type Props = {
    product: Product,
    action?: CartAction
}

const CartAction = ({ product, action }: Props) => {

    const dispatch = useAppDispatch()
    const productQuantity = useAppSelector((state) => getProductQuanity(state, product._id))

    function increment() {
        dispatch(addProduct({
            ...product
        }))
    }

    function decrement() {
        dispatch(decrementProductQuantity(product._id))
    }

    function renderAction(action?: CartAction) {
        switch (action) {
            case "add":
                return (
                    <Button className='bg-blue-700 text-white hover:bg-blue-700 hover:text-white h-11 rounded-xl' onClick={() => increment()}>
                        Add to cart
                    </Button>
                )
            case "delete":
                return (
                    <Button className='bg-red-700 text-white hover:bg-red-700 hover:text-white h-11 rounded-xl' onClick={() => dispatch(deleteProduct(product._id))}>
                        Remove from cart
                    </Button>
                )
            default:
                return
        }
    }

    return (
        <div className='flex gap-x-4'>
            <div className='h-11 px-4 flex items-center gap-x-2 border dark:border-neutral-800 text-[.7em] rounded-xl'>
                <button onClick={decrement}>
                    <AiOutlineMinus />
                </button>
                <span className='p-0 ring-0 border-0 w-8 text-sm focus:outline-none focus:ring-0 focus:border-0 text-black dark:text-white text-center dark:bg-transparent'>{productQuantity || 0}</span>
                <button onClick={increment}>
                    <AiOutlinePlus />
                </button>
            </div>
            {renderAction(action)}
        </div>
    )
}

export default CartAction