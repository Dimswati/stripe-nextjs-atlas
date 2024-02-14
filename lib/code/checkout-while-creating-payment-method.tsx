"use client"

import { Button } from "@/components/ui/button"
import { getPaymentIntent, getTotalPrice, setPaymentIntent } from "@/lib/redux/features/cart/cartSlice"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { formatPriceForStripe } from "@/lib/utils"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import axios from "axios"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

type Props = {}

const CheckoutForm = (props: Props) => {

    const router = useRouter()

    const totalPrice = useAppSelector(getTotalPrice)
    const paymentIntent = useAppSelector(getPaymentIntent)

    const dispatch = useAppDispatch()

    const [error, setError] = useState<string>()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string>()

    const stripe = useStripe()
    const elements = useElements()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!totalPrice || !stripe || !elements) return

        setLoading(true)

        const result = await axios.post('/api/paymentIntent', {
            amount: formatPriceForStripe(totalPrice),
            paymentIntent
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        })

        console.log("PAYMENT INTENT", result.data)
        setMessage(`Payment Intent: ${result.data.id}`)

        if (result.data.error) {
            console.log("PAYMENT INTENT ERROR", result.data.error)
            setLoading(false)
        } else {

            setMessage(`Payment Intent (${result.data.id}): ${result.data.status}`)


            if (!paymentIntent) {
                dispatch(setPaymentIntent(result.data.id))
                setMessage(`Store PaymentIntentId to cart`)
            }

            // let paymentEl = elements.getElement(CardElement)!

            // paymentEl.update({
                
            // })

            // confirm the payment intent on client
            // TODO: CONFIRM PAYMENT INTENT ON SERVER
            const intent = await stripe.confirmCardPayment(result.data.client_secret, {
                // If i the payment intent has an existing payment method, I dont need to pass payment method again
                payment_method: {
                    card: elements.getElement(CardElement)!
                },
            })

            if (intent.error) {
                setError(intent.error.message)
            } else {
                router.push("/success")
                // setMessage(`Payment Intent (${intent.paymentIntent.id}): ${intent.paymentIntent.status}`)
            }
            setLoading(false)
        }

    }

    const handleCardChange = () => {
        console.log("card change")
    }

    return (
        <main>
            <form onSubmit={handleSubmit} className="mb-6">
                <CardElement onChange={handleCardChange} className="mb-6" />
                <Button type="submit" disabled={!stripe || loading}>submit payment</Button>
            </form>
            <div>
                {Boolean(error) && <p className="text-red-700 font-medium mb-4">{message}</p>}
                <p className="text-blue-700 font-medium">{message}</p>
            </div>
        </main>
    )
}

export default CheckoutForm