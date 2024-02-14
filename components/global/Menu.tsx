"use client"

import Image from "next/image"
import atlas from '../../public/images/atlas.png'
import atlasLight from '../../public/images/atlas-light.png'
import Link from "next/link"
import { Button } from "../ui/button"

import { AiOutlineClose } from "react-icons/ai"
import useMenu from "@/lib/hooks/useCart"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

type MenuProps = {
    children: React.ReactNode
}

const Menu = ({ children }: MenuProps) => {

    const pathname = usePathname()

    const [isClient, setIsclient] = useState(false)

    const { isOpen, onClose } = useMenu()

    useEffect(() => {
        setIsclient(true)
    }, [])

    useEffect(() => {
        if (isOpen) {
            onClose()
        }

    }, [pathname])

    if (!isClient) {
        return null
    }

    return (
        <aside className={cn('h-screen fixed top-0 left-0 z-50 w-[320px] px-5 dark:bg-black bg-white transition duration-500', isOpen ? 'translate-x-0' : '-translate-x-[320px]')}>
            <div className="flex justify-between items-center my-8">
                <Image src={atlas} alt='dark atlas logo' className='w-[80px] h-auto inline-block dark:hidden' />
                <Image src={atlasLight} alt='light atlas logo' className='w-[80px] h-auto dark:inline-block hidden' />
                <Button size={'default'} variant={'ghost'} onClick={() => onClose()} className="px-0 hover:bg-transparent">
                    <AiOutlineClose />
                </Button>
            </div>
            <section className='text-sm font-medium flex flex-col gap-y-4'>
                {children}
                <Link href='/contact' className="hover:text-blue-600 transition-colors duration-500">Contact</Link>
                <Link href='/shop' className="hover:text-blue-600 transition-colors duration-500">Shop</Link>
            </section>
        </aside>
    )
}

export default Menu