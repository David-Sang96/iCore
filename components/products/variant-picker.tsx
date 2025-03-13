"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type VariantPickerProps = {
  id: number;
  title: string;
  price: number;
  color: string;
  productType: string;
  productId: number;
  image: string;
};

const VariantPicker = ({
  id,
  title,
  price,
  color,
  image,
  productType,
  productId,
}: VariantPickerProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedColor = searchParams.get("type") || productType;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            onClick={() =>
              router.push(
                `/product/${productId}?variantId=${id}&type=${productType}&image=${image}&title=${title}&price=${price}&color=${encodeURIComponent(color)}`,
                { scroll: false }
              )
            }
            style={{ backgroundColor: color }}
            className={cn(
              "size-4 rounded-full cursor-pointer ",
              selectedColor === productType
                ? "border-2 rounded-full border-red-600"
                : ""
            )}
          ></div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{productType}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VariantPicker;
