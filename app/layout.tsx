import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import Header from '@/components/global/Header'
import Footer from '@/components/global/Footer'
import StoreProvider from '@/lib/redux/StoreProvider'
import Pay from './_components/Pay'
import StripeElementsProvider from '@/lib/stripe/StripeElementsProvider'
// import Menu from '@/components/app/Menu'
// import Cart from '@/components/app/Cart'
// import MenuItemsList from '@/components/app/MenuItemsList'

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Atlas Blog theme',
  description: 'Blog theme for your beautiful saas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(font.className, ' dark:text-white text-black')}>
        {/* <Cart /> */}
        <StoreProvider>
          <StripeElementsProvider>
            <Header />
            <div className='relative max-w-[1070px] mx-auto px-5 xl:px-0'>
              {children}
            </div>
            <Pay />
            <Footer />
          </StripeElementsProvider>
        </StoreProvider>
      </body>
    </html>
  )
}