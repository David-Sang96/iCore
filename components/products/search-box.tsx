"use client";

import { ProductsWithVariantsAndImagesAndTags } from "@/lib/infer-types";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

type SearchBoxProps = {
  productsWithVariants: ProductsWithVariantsAndImagesAndTags[];
};

const SearchBox = ({ productsWithVariants }: SearchBoxProps) => {
  const [searchKey, setSearchKey] = useState("");
  const [searchResult, setSearchResult] = useState<
    ProductsWithVariantsAndImagesAndTags[]
  >([]);

  useEffect(() => {
    if (searchKey) {
      const filteredProduct = productsWithVariants.filter((product) => {
        const searchTerm = searchKey.trim().toLowerCase();
        const title = product.title.toLowerCase();
        return title.includes(searchTerm);
      });
      setSearchResult(filteredProduct);
    } else {
      setSearchResult([]);
    }
  }, [searchKey]);

  return (
    <section className="relative w-full sm:max-w-2xl">
      <div>
        <Input
          type="text"
          placeholder="search products...."
          className="ps-8 text-sm md:text-base"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <Search size={16} className="absolute left-2.5 top-2.5 " />
      </div>
      {searchResult.length > 0 && (
        <div className="absolute bg-white shadow-md rounded-md w-full z-50 mt-0.5 max-h-60 overflow-y-auto no-scrollbar">
          <p className="text-end text-sm text-muted-foreground pb-2 pt-1">
            {searchResult.length} results found.
          </p>
          {searchResult.map((item) => (
            <ul key={item.id}>
              <li>
                <Link
                  href={`/product/${item.id}?variantId=${item.variants[0].id}&productId=${item.id}&type=${item.variants[0].productType}&image=${item.variants[0].variantImages[0].image_url}&title=${item.title}&price=${item.price}&color=${encodeURIComponent(item.variants[0].color)}`}
                  className="flex items-center justify-between hover:bg-primary/50 p-2 max-sm:text-sm border-b"
                >
                  {item.title}
                  <Image
                    src={item.variants[0].variantImages[0].image_url}
                    width={35}
                    height={35}
                    alt={item.title}
                  />
                </Link>
              </li>
            </ul>
          ))}
        </div>
      )}
      {searchKey && searchResult.length === 0 && (
        <p className=" font-medium text-center absolute bg-white shadow-md rounded-md py-8 w-full z-50 mt-0.5">
          No product found with this name
        </p>
      )}
    </section>
  );
};

export default SearchBox;
