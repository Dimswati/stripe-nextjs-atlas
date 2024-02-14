"use client"

import Link from 'next/link'
import { BiSearch, BiLogoFacebookCircle, BiLogoDiscordAlt } from 'react-icons/bi'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'

import Image from 'next/image'
import atlas from '../../public/images/atlas.png'
import { ShoppingCart } from 'lucide-react';
import useCart from '@/lib/hooks/useCart'
import { getAllProducts } from '@/lib/redux/features/cart/cartSlice'
import { useAppSelector } from '@/lib/redux/hooks'

const Header = () => {

    const products = useAppSelector(getAllProducts)

    return (
        <header className='my-[15px] lg:max-w-[1070px] mx-auto px-5 xl:px-0'>
            <div className='flex justify-between md:justify-normal gap-x-6 items-center w-full min-h-[80px]'>
                <Link href="/cart" className='relative text-white bg-blue-700 w-8 h-8 flex items-center justify-center rounded-full'>
                    {products.length > 0 && (<span className='absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-sm flex items-center justify-center rounded-full'>
                        {products.length}
                    </span>)}
                    <ShoppingCart size={16} />
                </Link>
                <Image src={atlas} alt='dark atlas logo' className='w-[80px] h-auto inline-block' />
                <div className='text-sm font-medium md:flex gap-x-4 hidden ml-3'>
                    <Link href='/contact'>Contact</Link>
                    <Link href='/'>Shop</Link>
                </div>
                <div className='flex gap-x-4 md:ml-auto'>
                    <span className='text-sm hidden md:flex items-center gap-x-1 text-black hover:text-blue-600 '><BiLogoFacebookCircle />43k</span>
                    <span className='text-sm hidden md:flex items-center gap-x-1 text-black hover:text-blue-600'><BiLogoDiscordAlt />23k</span>
                    <span className='text-[18px] text-black hover:text-blue-600'><BiSearch /></span>
                </div>
            </div>
        </header>
    )
}

export default Header