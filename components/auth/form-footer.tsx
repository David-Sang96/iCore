import Link from "next/link";

type FormFooterProps = {
  footerLabel: string;
  footerHref: string;
};

const FormFooter = ({ footerLabel, footerHref }: FormFooterProps) => {
  return (
    <div className=" text-end  hover:underline hover:underline-offset-4 font-medium text-sm">
      <Link href={footerHref}>{footerLabel}</Link>
    </div>
  );
};

export default FormFooter;
