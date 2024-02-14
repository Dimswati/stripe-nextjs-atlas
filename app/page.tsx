import Image from "next/image";
import Product from "./_components/Product";
import { client } from "@/lib/client";
import { productListQuery } from "@/lib/query";
import { Product as ProductType } from "@/types";

export default async function Home() {

  const products: ProductType[] = await client.fetch(productListQuery, {}, {
    next: {
      revalidate: 3600
    }
  })

  if (products.length < 1) {
    return <main>
      <section className="w-full">
        <h2 className='font-bold text-lg mb-6'>No products found</h2>
      </section>
    </main>
  }

  return (
    <main>
      <section className="w-full">
        <h2 className='font-bold text-lg mb-6'>Shop</h2>
        <div className="flex sm:justify-between justify-start items-center mb-6">
          <span className="text-xs text-neutral-400 hidden sm:inline-flex">Showing 1–12 of 15 results</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <Product key={product._id} product={product}/>
          ))}
        </div>
      </section>
    </main>
  );
}
