import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";
import { Card, CardHeader } from "../ui/card";

type AnalyticsCardProps = {
  count: number;
  title: string;
  icon: ReactNode;
  href: string;
};

const AnalyticsCard = ({ count, title, icon, href }: AnalyticsCardProps) => {
  const pending = title.includes("Pending");
  const complete = title.includes("Complete");
  const cancel = title.includes("Cancel");
  const users = title.includes(" Users");
  const products = title.includes(" Products");

  return (
    <Link href={href}>
      <Card
        className={cn(
          pending && "bg-blue-500 ",
          complete && "bg-green-500 ",
          cancel && "bg-red-500 ",
          users && "bg-purple-500 ",
          products && "bg-orange-500 "
        )}
      >
        <CardHeader>
          <div className="flex justify-between text-white">
            <div className="flex md:flex-col max-sm:items-center gap-1">
              {icon}
              <h2 className="text-sm">{title}</h2>
            </div>
            <p className="font-medium text-lg">{count}</p>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default AnalyticsCard;
