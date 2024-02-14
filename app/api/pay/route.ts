import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(request: NextRequest) {

    const data = await request.json()

    if (data.paymentIntent) {

        // Retrieve payment intent if exists
        try {

            const intent = await stripe.paymentIntents.retrieve(data.paymentIntent)

            // return the payment intent intent object
            console.log("RETRIEVED PAYMENT INTENT", intent)
            return NextResponse.json(intent)

        } catch (error) {
            console.log("UNEXPECTED", error)
        }
    }

    try {

        const intent = await stripe.paymentIntents.create({
            amount: data.amount,
            currency: "usd",
            payment_method_types: ["card"],
            automatic_payment_methods: {
                enabled: false,
            },
            payment_method_options: {
                card: {
                    // preference to frictionless flow
                    request_three_d_secure: "any"
                }
            }
        })

        console.log("INTENT", intent)

        if (intent.status === "requires_payment_method") {

            return NextResponse.json(intent)
        }

        return NextResponse.json({ error: "Unexpected status" }, { status: 500 })

    } catch (error) {
        console.log("UNEXPECTED", error)
        // if (error.type === 'StripeCardError') {
        //     // Display error on client
        //     return response.send({ error: e.message });
        //   } else {
        //     // Something else happened
        //     return response.status(500).send({ error: e.type });
        //   }
        return NextResponse.json({ error: error }, { status: 500 })
    }
}