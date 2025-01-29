import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Store } from "lucide-react";

interface EmailVerificationProps {
  userFirstname?: string;
  verificationLink?: string;
}

export const EmailVerificationTemplate = ({
  userFirstname,
  verificationLink,
}: EmailVerificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>Account verification with email - Shopee</Preview>
      <Body style={main}>
        <Container style={container}>
          <Store width={40} height={33} />
          <Section>
            <Text style={text}>Hi {userFirstname},</Text>
            <Text style={text}>
              Thank you for signing up for Dropbox! Please verify your email
              address to activate your account.
            </Text>
            <Button style={button} href={verificationLink}>
              Verify Email
            </Button>
            <Text style={text}>
              If you didn&apos;t create this account, you can ignore this email.
            </Text>
            {/* <Text style={text}>
              For security reasons, please don&apos;t share this email with
              anyone. If you need help, visit our{" "}
              <Link style={anchor} href="https://dropbox.com/help">
                Help Center.
              </Link>
            </Text> */}
            <Text style={text}>Welcome to Shopee!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

EmailVerificationTemplate.PreviewProps = {
  userFirstname: "Shopee",
  verificationLink: "https://google.com",
} as EmailVerificationProps;

export default EmailVerificationTemplate;

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#404040",
  lineHeight: "26px",
};

const button = {
  backgroundColor: "#884DEE",
  borderRadius: "4px",
  color: "#fff",
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 7px",
};

const anchor = {
  textDecoration: "underline",
};
