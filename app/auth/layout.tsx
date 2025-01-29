import { ReactNode } from "react";

const AuthLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return <div className="max-w-md mx-auto">{children}</div>;
};

export default AuthLayout;
