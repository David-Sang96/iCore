"use client";

import { useCartStore } from "@/store/cart-store";
import { Minus, Plus } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

const AddToCart = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const addToCart = useCartStore((state) => state.addToCart);
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const variantId = searchParams.get("variantId");
  const title = searchParams.get("title");
  const price = searchParams.get("price");
  const image = searchParams.get("image");

  if (!variantId || !productId || !title || !price || !image) {
    return redirect("/");
  }

  const addQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const removeQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const addToCartHandler = () => {
    addToCart({
      id: +productId,
      image,
      price,
      title,
      variant: { variantId: +variantId, quantity },
    });
  };

  return (
    <div className="flex items-center mt-5 justify-between max-sm:flex-col max-sm:gap-5">
      <div className="flex items-center w-2/3 text-center gap-1 max-sm:text-sm max-sm:w-full">
        <Button size={"sm"} onClick={removeQuantity} disabled={quantity === 1}>
          <Minus style={{ width: 15, height: 15 }} />
        </Button>
        <div className="bg-primary text-white py-1.5 rounded-md w-full text-sm">
          Quantity: {quantity}
        </div>
        <Button size={"sm"} onClick={addQuantity}>
          <Plus style={{ width: 15, height: 15 }} />
        </Button>
      </div>
      <Button className="max-sm:w-full sm:mb-1" onClick={addToCartHandler}>
        Add to cart
      </Button>
    </div>
  );
};

export default AddToCart;
