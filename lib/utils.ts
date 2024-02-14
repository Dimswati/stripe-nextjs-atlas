import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPriceInUSD(price: number) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  return formatter.format(price);
}

export function formatPriceForStripe(amount: number) {
  const numberFormart = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol'
  })

  const parts = numberFormart.formatToParts(amount)
  let zeroDecimalCurrency: boolean = true

  for (let part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false
    }
  }

  return zeroDecimalCurrency ? amount : Math.round(amount * 100)
}