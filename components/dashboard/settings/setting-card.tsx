import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";

type SettingsCardProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

const SettingsCard = ({ children, title, description }: SettingsCardProps) => {
  return (
    <Card>
      <CardHeader className="max-sm:p-3">
        {title && description && (
          <div className="mb-4">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        )}
        {children}
      </CardHeader>
    </Card>
  );
};

export default SettingsCard;
