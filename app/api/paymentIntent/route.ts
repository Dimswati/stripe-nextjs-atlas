// import { stripeSecretKey } from "@/env";
import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(request: NextRequest) {

    const { amount, payment_method_id }: {
        payment_method_id: string,
        amount: number
    } = await request.json()

    console.log(amount, payment_method_id)

    try {

        const intent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            payment_method: payment_method_id,
            // automatic_payment_methods: {
            //     enabled: false
            // },
            // payment_method_types: ["card"],

            // A PaymentIntent can be confirmed some time after creation,
            // but here we want to confirm (collect payment) immediately.
            // confirm: true, // only works if we have a payment method

            // If the payment requires any follow-up actions from the
            // customer, like two-factor authentication, Stripe will error
            // and you will need to prompt them for a new payment method.>
            // error_on_requires_action: true // only works if confirm is set to true BUT I need to use payments not managed from dashboard
        })

        console.log("CREATED PAYMENT INTENT", intent)
        return NextResponse.json(intent)

    } catch (error) {
        if (error instanceof Stripe.errors.StripeError) {
            return NextResponse.json({ type: error.type, message: error.message }, { status: 500 })
        }
        return NextResponse.json({ error: "UNKOWNN ERROR OCCURED" }, { status: 500 })
    }
}
