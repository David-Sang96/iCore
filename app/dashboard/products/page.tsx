import image from "@/public/product-placeholder.jpg";
import { db } from "@/server";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const ProductsPage = async () => {
  const products = await db.query.products.findMany({
    with: { variants: { with: { variantImages: true, variantTags: true } } },
    orderBy: (posts, { desc }) => [desc(posts.id)],
  });

  const productData = products.map((product) => ({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    image: product.variants[0]?.variantImages[0]?.image_url ?? image.src,
    variants: product.variants,
  }));
  return <DataTable columns={columns} data={productData} />;
};

export default ProductsPage;
