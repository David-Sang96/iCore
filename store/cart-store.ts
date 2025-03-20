import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

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

type Status = "Order" | "Checkout" | "Success";

export type CartType = {
  cart: CartItem[];
  cartPosition: Status;
  isOpen: boolean;
};

type Actions = {
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  decreaseQuantity: (variantId: number) => void;
  increaseQuantity: (variantId: number) => void;
  setCartPosition: (status: Status) => void;
  clearCart: () => void;
  setIsOpen: () => void;
};

export const useCartStore = create<CartType & Actions>()(
  persist(
    immer((set) => ({
      cart: [],
      isOpen: false,
      setIsOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      cartPosition: "Order",
      setCartPosition: (posttion) =>
        set((state) => {
          state.cartPosition = posttion;
        }),
      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cart.find(
            (item: CartItem) =>
              item.variant.variantId === product.variant.variantId
          );
          if (existingItem) {
            existingItem.variant.quantity += product.variant.quantity;
          } else {
            state.cart.push({ ...product });
          }
        }),
      removeFromCart: (variantId) =>
        set((state) => {
          state.cart = state.cart.filter(
            (item: CartItem) => item.variant.variantId !== variantId
          );
        }),
      increaseQuantity: (variantId) =>
        set((state) => {
          const item = state.cart.find(
            (item: CartItem) => item.variant.variantId === variantId
          );
          if (item) item.variant.quantity += 1;
        }),
      decreaseQuantity: (variantId) =>
        set((state) => {
          const item = state.cart.find(
            (item: CartItem) => item.variant.variantId === variantId
          );
          if (item) {
            item.variant.quantity -= 1;
            if (item.variant.quantity <= 0) {
              state.cart = state.cart.filter(
                (item: CartItem) => item.variant.variantId !== variantId
              );
            }
          }
        }),
      clearCart: () => set({ cart: [] }),
    })),
    { name: "cart-storage", storage: createJSONStorage(() => sessionStorage) }
  )
);

// export const useCartStore = create<CartType>()( persist(
//   immer ( (set) => ({
//    cart: [],
//    addToCart: (product) =>
//      set((state) => {
//        const existingItem = state.cart.find(
//          ({ variant }) => variant.variantId === product.variant.variantId
//        );
//        if (existingItem) {
//          return {
//            cart: state.cart.map((udItem) => {
//              return udItem.variant.variantId ===
//                existingItem.variant.variantId
//                ? {
//                    ...udItem,
//                    variant: {
//                      ...udItem.variant,
//                      quantity:
//                        udItem.variant.quantity + product.variant.quantity,
//                    },
//                  }
//                : udItem;
//            }),
//          };
//        }
//        return {
//          cart: [
//            ...state.cart,
//            {
//              ...product,
//              variant: {
//                variantId: product.variant.variantId,
//                quantity: product.variant.quantity,
//              },
//            },
//          ],
//        };
//      }),
//    removeFromCart: (varinatId) =>
//      set((state) => ({
//        cart: state.cart.filter(
//          (item) => item.variant.variantId !== varinatId
//        ),
//      })),
//    increaseQuantity: (product) =>
//      set((state) => ({
//        cart: state.cart.map((item) => {
//          return item.variant.variantId === product.variant.variantId
//            ? {
//                ...item,
//                variant: {
//                  ...item.variant,
//                  quantity: item.variant.quantity + 1,
//                },
//              }
//            : item;
//        }),
//      })),
//    decreaseQuantity: (product) =>
//      set((state) => ({
//        cart: state.cart
//          .map((item) => {
//            return item.variant.variantId === product.variant.variantId
//              ? {
//                  ...item,
//                  variant: {
//                    ...item.variant,
//                    quantity: item.variant.quantity - 1,
//                  },
//                }
//              : item;
//          })
//          .filter((item) => item.variant.quantity > 0),
//      })),
//    clearCart: () => set({ cart: [] }),
//  })),
//    { name: "cart-storage", storage: createJSONStorage(() => sessionStorage) }
//  ))

// ;
