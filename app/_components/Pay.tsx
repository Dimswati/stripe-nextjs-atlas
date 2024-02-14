"use client"

import { getTotalPrice } from '@/lib/redux/features/cart/cartSlice'
import { useAppSelector } from '@/lib/redux/hooks'
import { cn, formatPriceInUSD } from '@/lib/utils'
import { Button, buttonVariants } from "@/components/ui/button";
import { usePathname } from 'next/navigation';
import React from 'react'
import Link from 'next/link';

type Props = {}

const Pay = (props: Props) => {
    const pathname = usePathname()
    const totalPrice = useAppSelector(getTotalPrice)

    if(!totalPrice) return

    return (
        <section className="fixed container bottom-0 w-full bg-white flex flex-col items-start py-3 z-20">
            <p className="mb-3">Total Amount: <span className="font-bold">{formatPriceInUSD(totalPrice)}</span></p>
           {pathname.includes("cart") ? ( <Link href="/checkout" className={cn(buttonVariants({ variant: "default" }), "bg-red-700 hover:bg-red-500 w-full")}>Checkout</Link>) : <Link href="/cart" className={cn(buttonVariants({ variant: "default" }), "bg-blue-700 hover:bg-blue-500 w-full")}>Cart</Link>}
        </section>
    )
}

export default Pay