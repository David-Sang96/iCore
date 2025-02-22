import image from "@/public/product-placeholder.jpg";
import { db } from "@/server";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const ProductsPage = async () => {
  const data = await db.query.products.findMany({
    orderBy: (posts, { desc }) => [desc(posts.id)],
  });

  const productData = data.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    price: item.price,
    image: image.src,
    variants: [],
  }));
  return <DataTable columns={columns} data={productData} />;
};

export default ProductsPage;
