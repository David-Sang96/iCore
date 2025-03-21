import Products from "@/components/products";
import SearchBox from "@/components/products/search-box";
import TagFilter from "@/components/products/tag-filter";
import { db } from "@/server";

export default async function Home() {
  const productsWithVariants = await db.query.products.findMany({
    with: { variants: { with: { variantImages: true, variantTags: true } } },
    // orderBy: (variants, { asc }) => [asc(variants.id)],
  });
  // Use console.dir() with depth: null to fully display the nested objects:
  // console.dir(productsWithVariants, { depth: null });

  return (
    <main className="space-y-6">
      <SearchBox productsWithVariants={productsWithVariants} />
      <TagFilter />
      <Products productsWithVariants={productsWithVariants} />
    </main>
  );
}
