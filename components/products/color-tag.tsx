"use client";

import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

type ColorTagProps = {
  productType: string;
};

const ColorTag = ({ productType }: ColorTagProps) => {
  const searchParams = useSearchParams();
  const selectedColorType = searchParams.get("type") || productType;
  const selectedColor = decodeURIComponent(searchParams.get("color") || "");

  return (
    <p
      className={cn(
        "text-xs mt-2 mb-3 w-fit p-1.5 rounded-md font-medium text-white",
        selectedColorType === "Gold" && "text-primary"
      )}
      style={{ background: selectedColor }}
    >
      {selectedColorType} Variant
    </p>
  );
};

export default ColorTag;
