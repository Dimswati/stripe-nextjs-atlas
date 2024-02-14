"use client"

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { stripePublishableKey } from "@/env"

type Props = {
    children: React.ReactNode
}

const stripePromise = loadStripe(stripePublishableKey)

const StripeElementsProvider = ({ children }: Props) => {
  return (
    <Elements stripe={stripePromise}>
        {children}
    </Elements>
  )
}

export default StripeElementsProvider