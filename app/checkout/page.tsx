
"use client"

import { Button } from "@/components/ui/button"
import { getPaymentIntent, getTotalPrice, setPaymentIntent } from "@/lib/redux/features/cart/cartSlice"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { formatPriceForStripe } from "@/lib/utils"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import axios, { AxiosError } from "axios"
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

    const confirmPaymentIntent = async (
        {
            payment_intent_id,
            payment_method_id
        }: {
            payment_intent_id: string,
            payment_method_id: string

        }) => {

        try {

            await axios.post('/api/confirmPayment', {
                payment_method_id,
                payment_intent_id
            })

            setLoading(false)
            router.push("/success")
            router.refresh()

        } catch (error) {
            if (axios.isAxiosError(error)) {

                if (error.response) {
                    if (error.response.data.type) {
                        // handle all related stripe errors
                        // console.log("STRIPE CONFIRM INTENT ERROR:", error.response.data.message)
                        setMessage(`STRIPE CONFIRM INTENT ERROR: ${error.response.data.message}`)
                    } else {
                        // not a stripe error
                        // console.log("CONFIRM INTENT ERROR:", error.response.data.error)
                        setError(`CONFIRM INTENT ERROR: ${error.response.data.error}`)
                    }
                } else {
                    // handle any other error maybe 400 requests
                    // console.log("AXIOS ERROR:", error.message)
                    setError(`AXIOS ERROR: ${error.message}`)
                }
            } else {
                // console.log("UNKOWN ERROR OCCURED", error)
                setError("UNKOWN ERROR OCCURED")
            }
            setLoading(false)
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!totalPrice || !stripe || !elements) return

        setLoading(true)

        const result = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)!, // we know the element exits

            // billing details should be filled from database user
            billing_details: {
                name: 'Jenny Rosen',
            }
        });

        if (!result) {
            setError(`No result`)
            setLoading(false)
            return
        }

        if (result.error) {

            // Error occured when collecting card details
            setError(result.error.message)
            setLoading(false)
            return
        }

        // send the payment method id to my server
        setMessage(`CREATED PAYMENT METHOD: ${result.paymentMethod.id}`)


        if (!paymentIntent) {

            // CREATE PAYMENT INTENT FIRST WHILE CONFIRMING
            try {
                const intentResponse = await axios.post('/api/paymentIntent', {
                    payment_method_id: result.paymentMethod.id,
                    amount: formatPriceForStripe(totalPrice)
                })

                // Saving payment intent to cart session
                dispatch(setPaymentIntent(intentResponse.data.id))
                // console.log("SET PAYMENT INTENT TO CART SESSION:", paymentIntent)

                await confirmPaymentIntent({
                    payment_intent_id: intentResponse.data.id,
                    payment_method_id: result.paymentMethod.id
                })

            } catch (error) {
                // I CATCH ERRORS THROWN FROM SERVER INCLUDING 500 RANGE
                if (axios.isAxiosError(error)) {

                    if (error.response) {

                        if (error.response.data.type) {
                            // handle all related stripe errors
                            // console.log("STRIPE PAYMENT INTENT ERROR:", error.response.data.message)
                            setMessage(`STRIPE PAYMENT INTENT ERROR: ${error.response.data.message}`)
                        } else {
                            // console.log("PAYMENT INTENT ERROR", error.response.data.error)
                            setError(`PAYMENT INTENT ERROR: ${error.response.data.error}`)
                        }
                    } else {
                        // handle any other error
                        // console.log("AXIOS ERRORS", error.message)
                        setError(`AXIOS ERROR: ${error.message}`)
                    }
                } else {
                    // console.log("UNKOWN ERROR OCCURED", error)
                    setError("UNKOWN ERROR OCCURED")
                }

                setLoading(false)
            }

        } else {
            // console.log("GET PAYMENT INTENT FROM CART SESSION")
            await confirmPaymentIntent({
                payment_intent_id: paymentIntent,
                payment_method_id: result.paymentMethod.id
            })
        }

    }

    const handleCardChange = () => {
        console.log("card change")
    }

    return (
        <main>
            <form onSubmit={handleSubmit} className="mb-6">
                <CardElement onChange={handleCardChange} className="mb-6" />
                <Button type="submit" disabled={!stripe || loading || !totalPrice}>submit payment</Button>
            </form>
            <div>
                {Boolean(error) && <p className="text-red-700 font-medium mb-4">{message}</p>}
                <p className="text-blue-700 font-medium">{message}</p>
            </div>
        </main>
    )
}

export default CheckoutForm