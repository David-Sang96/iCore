import formatCurrency from "@/lib/format-currency";
import { ProductsWithVariantsAndImagesAndTags } from "@/lib/infer-types";
import Image from "next/image";
import Link from "next/link";

type ProductsProps = {
  productsWithVariants: ProductsWithVariantsAndImagesAndTags[];
};

const Products = ({ productsWithVariants }: ProductsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {productsWithVariants.map(
        // prettier-ignore
        ({ id,price,title,variants  }) => (      
          variants.length > 0 &&  <Link
          className="bg-white p-3 rounded-md shadow-lg hover:scale-105 duration-300 ease-out"
           href={`/product/${id}?variantId=${variants[0].id}&productId=${id}&type=${variants[0].productType}&image=${variants[0].variantImages[0].image_url}&title=${title}&price=${price}&color=${encodeURIComponent(variants[0].color) }`}
           key={id}
         >
           <Image
             src={ variants[0].variantImages[0].image_url}
             alt={title}
             width={600}
             height={400}
             priority
           />
           <hr className="my-2" />
           <h3 className="font-semibold ">
             {title.length > 20
               ? title.substring(0, 20) + "..."
               : title}
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
