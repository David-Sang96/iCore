"use client";

import formatCurrency from "@/lib/format-currency";
import { ProductsWithVariantsAndImagesAndTags } from "@/lib/infer-types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

type ProductsProps = {
  productsWithVariants: ProductsWithVariantsAndImagesAndTags[];
};

const Products = ({ productsWithVariants }: ProductsProps) => {
  const [filteredProducts, setFilteredProducts] = useState<
    ProductsWithVariantsAndImagesAndTags[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useSearchParams();
  const tagName = params.get("tag") || "accessories";

  useEffect(() => {
    const filteredItems = productsWithVariants.filter((item) =>
      item.variants[0].variantTags.find(
        (v) => v.tag.toLowerCase() === tagName.toLowerCase().replace(/-/g, " ")
      )
    );

    setFilteredProducts(filteredItems);
  }, [tagName]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.map(
        ({ id, price, title, variants }) =>
          variants.length > 0 && (
            <Link
              className="bg-background text-foreground dark:border-b dark:border-white/50 p-3 rounded-md shadow-lg hover:scale-105 duration-300 ease-out"
              href={`/product/${id}?variantId=${variants[0].id}&productId=${id}&type=${variants[0].productType}&image=${variants[0].variantImages[0].image_url}&title=${title}&price=${price}&color=${encodeURIComponent(variants[0].color)}`}
              key={id}
            >
              {isLoading &&
                Array(1)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton
                      key={i}
                      className="rounded-md h-[10rem] sm:h-[16rem]"
                    />
                  ))}
              <Image
                src={variants[0].variantImages[0].image_url}
                alt={title}
                width={600}
                height={400}
                priority
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
                className={cn(
                  "rouned-lg h-auto",
                  isLoading ? "hidden" : "block"
                )}
              />

              <hr className="my-2" />
              <h3 className="font-semibold ">
                {title.length > 20 ? title.substring(0, 20) + "..." : title}
              </h3>
              <p className="font-medium text-sm mt-1">
                {formatCurrency(price)}
              </p>
            </Link>
          )
      )}
    </div>
  );
};

export default Products;
