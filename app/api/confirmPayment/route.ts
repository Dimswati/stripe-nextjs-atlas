import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(request: NextRequest) {

    const {
        payment_method_id,
        payment_intent_id
    }: {
        payment_method_id: string
        payment_intent_id: string
    } = await request.json()

    // const origin = request.headers["origin"]

    // console.log("HEADERS", request.headers)

    try {
        const intent = await stripe.paymentIntents.confirm(payment_intent_id, {
            payment_method: payment_method_id,
            error_on_requires_action: true,
            return_url: "http://localhost:3000"
        })

        // payment intent will error out if authentication is required
        if(intent.status === "succeeded") {
            console.log(`SUCCESSFULL PAYMENT: ${intent}`)
            return NextResponse.json({
                success: true
            })
        }
        // else {
        //     console.log(`FAILED PAYMENT: ${intent.status}`)
        //     throw new Error("CONFIRM INTENT ERROR")
        // }

    } catch (error) {
        if (error instanceof Stripe.errors.StripeError) {
            // switch (error.type) {
            //     case 'StripeCardError':
            //         // A declined card error
            //         console.log("STRIPE CARD ERROR:", error)
            //         return NextResponse.json({ 
            //             message: error.message,
            //             error: error.type
            //         }, { status: 500 })
            //     // => e.g. "Your card's expiration year is invalid."
            //     default:
            //         console.log("STRIPE ERROR:", error)
            //         return NextResponse.json({ 
            //             message: error.message,
            //             error: error.type
            //         }, { status: 500 })
            // }
            console.log("STRIPE ERROR:", error)
            return NextResponse.json({ 
                message: error.message,
                type: error.type
            }, { status: 500 })
        }

        console.log("UNKNOWN CONFIRM ERROR:", error)

        return NextResponse.json({
            error: "UNKNOWN CONFIRM ERROR"
        }, { status: 500 })
    }

}