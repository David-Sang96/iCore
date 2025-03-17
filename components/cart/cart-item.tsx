"use client";

import emptyCartImg from "@/public/empty-cart.avif";
import { useCartStore } from "@/store/cart-store";
import Image from "next/image";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import formatCurrency from "@/lib/format-currency";
import { MinusIcon, PlusIcon, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { ClearBtn } from "./clear-btn";

const CartItem = () => {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const setOrderStatus = useCartStore((state) => state.setOrderStatus);

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price) * item.variant.quantity,
    0
  );

  return (
    <>
      {!cart.length ? (
        <div className="flex flex-col items-center justify-center gap-1 ">
          <Image
            src={emptyCartImg}
            alt="cart"
            width={120}
            height={120}
            placeholder="blur"
          />
          <p className="text-center text-lg">
            Your cart is empty. Start shopping!
          </p>
        </div>
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sm:w-[300px]">Name</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-center">Price</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={50}
                      height={50}
                    />
                  </TableCell>
                  <TableCell className="group">
                    <div className="flex items-center gap-1.5 sm:gap-3">
                      <button
                        className=" opacity-0 group-hover:opacity-100 duration-300 transition-opacity"
                        onClick={() => decreaseQuantity(item.variant.variantId)}
                      >
                        <MinusIcon
                          aria-label="remove"
                          style={{ width: 14, height: 14 }}
                        />
                      </button>
                      {item.variant.quantity}
                      <button
                        className=" opacity-0 group-hover:opacity-100 duration-300 transition-opacity"
                        onClick={() => increaseQuantity(item.variant.variantId)}
                      >
                        <PlusIcon
                          aria-label="add"
                          style={{ width: 14, height: 14 }}
                        />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {formatCurrency(+item.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end cursor-pointer">
                      <Trash2
                        style={{ width: 18, height: 18 }}
                        onClick={() => removeFromCart(item.variant.variantId)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-transparent">
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-center">
                  {formatCurrency(totalPrice)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <div className="mt-4 text-end space-y-1.5 md:space-x-3 ">
            <Button
              className="max-md:w-full w-2/12"
              onClick={() => setOrderStatus("Checkout")}
            >
              Place Order
            </Button>
            <ClearBtn>
              <Button variant={"destructive"} className="max-md:w-full w-2/12">
                Clear All
              </Button>
            </ClearBtn>
          </div>
        </div>
      )}
    </>
  );
};

export default CartItem;
