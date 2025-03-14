export const revalidate = 0; // Always fetch fresh data

import AddToCart from "@/components/cart/add-to-cart";
import ColorTag from "@/components/products/color-tag";
import ImageSlider from "@/components/products/image-slider";
import VariantPicker from "@/components/products/variant-picker";
import formatCurrency from "@/lib/format-currency";
import { db } from "@/server";
import { products } from "@/server/schema";
import { eq } from "drizzle-orm";

type ProductDetailPageProps = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  const data = await db.query.products.findMany({
    with: {
      variants: {
        with: { variantImages: true, variantTags: true },
      },
    },
  });
  if (data) {
    const ids = data.map((d) => ({ id: d.id.toString() }));
    return ids;
  }
  return [];
}

const ProductDetailPage = async ({ params }: ProductDetailPageProps) => {
  const productWithVariant = await db.query.products.findFirst({
    where: eq(products.id, Number(params.id)),
    with: {
      variants: {
        with: { variantImages: true, variantTags: true },
      },
    },
  });

  return (
    <>
      {productWithVariant && (
        <section className="flex gap-4 max-md:flex-col">
          <div className="flex-1">
            <ImageSlider variant={productWithVariant.variants} />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-xl md:text-2xl">
              {productWithVariant.title}
            </h2>
            <ColorTag
              productType={productWithVariant.variants[0].productType}
            />
            <hr className="h-0.5 bg-primary/20 mb-2" />
            <div
              className="leading-8"
              dangerouslySetInnerHTML={{
                __html: productWithVariant.description,
              }}
            />
            <p className="font-bold text-xl my-2">
              {formatCurrency(productWithVariant.price)}
            </p>
            <div className="flex gap-2 items-center flex-wrap">
              <p className="font-medium text-sm">Colors: </p>{" "}
              {productWithVariant.variants.map((v) => (
                <VariantPicker
                  key={v.id}
                  {...v}
                  title={productWithVariant.title}
                  image={v.variantImages[0].image_url}
                  price={productWithVariant.price}
                />
              ))}
            </div>
            <AddToCart />
          </div>
        </section>
      )}
    </>
  );
};

export default ProductDetailPage;
