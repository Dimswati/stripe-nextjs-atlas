import { Product } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface StoreProduct extends Product {
    quantity: number,
    totalPrice: number
}

interface InitialState {
    products: StoreProduct[],
    stripe: {
        paymentIntent: string | null
    }
}

const initialState: InitialState = {
    products: [],
    stripe: {
        // Store payment intent id during creating checkout, also store other order information
        // attempt to store paymentintent to local storage
        paymentIntent: null
    }
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addProduct(state, action: PayloadAction<Product>) {
            const storeProduct = state.products.find(product => product._id === action.payload._id)

            if (!storeProduct) {
                state.products.push({
                    ...action.payload,
                    totalPrice: action.payload.price,
                    quantity: 1
                })
            } else {
                storeProduct.quantity++
                storeProduct.totalPrice += action.payload.price
            }
        },

        decrementProductQuantity(state, action: PayloadAction<string>) {
            const storeProduct = state.products.find(product => product._id === action.payload)

            if (storeProduct) {

                if (storeProduct.quantity < 2) {
                    state.products = state.products.filter(product => product._id !== action.payload)
                } else {
                    storeProduct.quantity--
                    storeProduct.totalPrice -= storeProduct.price
                }
            }
        },

        deleteProduct(state, action: PayloadAction<string>) {
            const product = state.products.find(product => product._id === action.payload)
            
            if(product) {
                state.products = state.products.filter(product => product._id !== action.payload)
            }
        },

        setPaymentIntent(state, action: PayloadAction<string>) {
            state.stripe.paymentIntent = action.payload
        }
    }
})

// export helpers
export const getAllProducts = (state: RootState) => state.cart.products
export const getProductQuanity = (state: RootState, productId: string) =>
    state.cart.products.find(product => product._id === productId)?.quantity
export const getTotalPrice = (state: RootState) => state.cart.products.reduce((acc, product) => acc += product.totalPrice, 0)
export const getPaymentIntent = (state: RootState) => state.cart.stripe.paymentIntent

// export actions
export const { addProduct, decrementProductQuantity, deleteProduct, setPaymentIntent } = cartSlice.actions

export default cartSlice.reducer