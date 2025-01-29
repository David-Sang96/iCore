import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import FormFooter from "./form-footer";
import ProviderLogin from "./provider-login";

type AuthFormProps = {
  children: ReactNode;
  formTitle: string;
  showProvider: boolean;
  footerLabel: string;
  footerHref: string;
};

const AuthForm = ({
  children,
  formTitle,
  showProvider,
  footerLabel,
  footerHref,
}: AuthFormProps) => {
  return (
    <Card className=" mt-10">
      <CardHeader className="px-3 py-5">
        <CardTitle>{formTitle}</CardTitle>
      </CardHeader>
      <CardContent className="px-3">{children}</CardContent>
      <CardFooter className="block px-3">
        {showProvider && <ProviderLogin />}
        <FormFooter footerHref={footerHref} footerLabel={footerLabel} />
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
