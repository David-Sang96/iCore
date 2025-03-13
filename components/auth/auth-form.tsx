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
    <Card>
      <CardHeader className="px-3 py-5">
        <CardTitle>{formTitle}</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-4">{children}</CardContent>
      <CardFooter className="block px-3 ">
        {showProvider && (
          <>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border mb-3.5">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <ProviderLogin />
          </>
        )}
        <FormFooter footerHref={footerHref} footerLabel={footerLabel} />
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
