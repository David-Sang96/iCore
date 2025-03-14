import { create } from "zustand";

export type Variant = {
  variantId: number;
  quantity: number;
};

export type CartItem = {
  id: number;
  title: string;
  price: string;
  image: string;
  variant: Variant;
};

export type CartType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  decreaseQuantity: (item: CartItem) => void;
  increaseQuantity: (item: CartItem) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartType>((set) => ({
  cart: [],
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find(
        ({ variant }) => variant.variantId === product.variant.variantId
      );
      if (existingItem) {
        return {
          cart: state.cart.map((udItem) => {
            return udItem.variant.variantId === existingItem.variant.variantId
              ? {
                  ...udItem,
                  variant: {
                    ...udItem.variant,
                    quantity:
                      udItem.variant.quantity + product.variant.quantity,
                  },
                }
              : udItem;
          }),
        };
      }
      return {
        cart: [
          ...state.cart,
          {
            ...product,
            variant: {
              variantId: product.variant.variantId,
              quantity: product.variant.quantity,
            },
          },
        ],
      };
    }),
  removeFromCart: (varinatId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.variant.variantId !== varinatId),
    })),
  increaseQuantity: (product) =>
    set((state) => ({
      cart: state.cart.map((item) => {
        return item.variant.variantId === product.variant.variantId
          ? {
              ...item,
              variant: {
                ...item.variant,
                quantity: item.variant.quantity + 1,
              },
            }
          : item;
      }),
    })),
  decreaseQuantity: (product) =>
    set((state) => ({
      cart: state.cart
        .map((item) => {
          return item.variant.variantId === product.variant.variantId
            ? {
                ...item,
                variant: {
                  ...item.variant,
                  quantity: item.variant.quantity - 1,
                },
              }
            : item;
        })
        .filter((item) => item.variant.quantity > 0),
    })),
  clearCart: () => set({ cart: [] }),
}));
