import DashboardNavigationBar from "@/components/navigation/dashboard-nav";
import { auth } from "@/server/auth";
import {
  ChartNoAxesCombined,
  Package,
  PackagePlus,
  Settings,
  Truck,
} from "lucide-react";
import { ReactNode } from "react";

const publicRoutes = [
  {
    name: "Orders",
    path: "/dashboard/orders",
    icon: <Truck aria-hidden="true" size={20} />,
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: <Settings aria-hidden="true" size={19} />,
  },
];

const adminRoutes = [
  {
    name: "Analytics",
    path: "/dashboard/analytics",
    icon: <ChartNoAxesCombined aria-hidden="true" size={20} />,
  },
  {
    name: "Create Product",
    path: "/dashboard/create-product",
    icon: <PackagePlus aria-hidden="true" size={20} />,
  },
  {
    name: "Products",
    path: "/dashboard/products",
    icon: <Package aria-hidden="true" size={20} />,
  },
];

const DashboardLayout = async ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const session = await auth();
  const routes =
    session?.user.role === "admin"
      ? [...adminRoutes, ...publicRoutes]
      : publicRoutes;

  return (
    <>
      <DashboardNavigationBar routes={routes} />
      <section className="max-w-5xl mx-auto">{children}</section>
    </>
  );
};

export default DashboardLayout;
