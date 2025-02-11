import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Text,
} from "@react-email/components";

export default function TwoFactorAuthTemplate(verificationCode?: string) {
  return (
    <Html>
      <Head />
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          <Section>
            <Heading style={headingStyle}>Your 2FA Verification Code</Heading>
            <Text style={textStyle}>
              Use the following verification code to complete your sign-in. This
              code is valid for 30 minutes.
            </Text>
            <Text style={codeStyle}>{verificationCode}</Text>
            <Text style={textStyle}>
              If you didn’t request this, please ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const mainStyle = {
  backgroundColor: "#ffffff",
  color: "#333",
  fontFamily: "Arial, sans-serif",
};

const containerStyle = {
  padding: "20px",
  maxWidth: "400px",
  margin: "0 auto",
  backgroundColor: "#f7f7f7",
  borderRadius: "8px",
};

const headingStyle = {
  fontSize: "20px",
  fontWeight: "bold",
  textAlign: "center" as const,
};

const textStyle = {
  fontSize: "14px",
  textAlign: "center" as const,
  margin: "10px 0",
};

const codeStyle = {
  fontSize: "32px",
  fontWeight: "bold",
  textAlign: "center" as const,
  backgroundColor: "#884DEE",
  padding: "10px",
  color: "#fff",
  borderRadius: "4px",
};
