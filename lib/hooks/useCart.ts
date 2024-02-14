import { create } from "zustand"

interface CartStore {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

const useCart = create<CartStore>((set) => ({
    isOpen: true,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}))

export default useCart
