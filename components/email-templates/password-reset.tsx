import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface ResetPasswordTemplateProps {
  username?: string;
  resetLink?: string;
}

export const ResetPasswordTemplate = ({
  username,
  resetLink,
}: ResetPasswordTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password for your Shopee account</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>Reset Your Password</Section>
          <Section style={sectionsBorders}>
            <Row>
              <Column style={sectionBorder} />
              <Column style={sectionCenter} />
              <Column style={sectionBorder} />
            </Row>
          </Section>
          <Section style={content}>
            <Text style={paragraph}>Hi {username},</Text>
            <Text style={paragraph}>
              We received a request to reset your password for your Shopee
              account.
            </Text>
            <Text style={paragraph}>
              Click the link below to reset your password:
            </Text>
            <Text style={paragraph}>
              <Link href={resetLink} style={link}>
                Reset Your Password
              </Link>
            </Text>
            <Text style={paragraph}>
              If you did not request this change, you can ignore this email, and
              your password will remain the same.
            </Text>
            <Text style={paragraph}>
              Still have questions? Please contact
              <Link href="#" style={link}>
                Shopee Support
              </Link>
            </Text>
            <Text style={paragraph}>
              Thanks,
              <br />
              Shopee Support Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

ResetPasswordTemplate.PreviewProps = {
  username: "Shopee User",
  resetLink: "https://shopee.com/reset-password?token=example",
} as ResetPasswordTemplateProps;

export default ResetPasswordTemplate;

const fontFamily = "HelveticaNeue,Helvetica,Arial,sans-serif";

const main = {
  backgroundColor: "#efeef1",
  fontFamily,
};

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
};

const container = {
  maxWidth: "580px",
  margin: "30px auto",
  backgroundColor: "#ffffff",
};

const content = {
  padding: "5px 20px 10px 20px",
};

const logo = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 30,
};

const sectionsBorders = {
  width: "100%",
  display: "flex",
};

const sectionBorder = {
  borderBottom: "1px solid rgb(238,238,238)",
  width: "249px",
};

const sectionCenter = {
  borderBottom: "1px solid rgb(145,71,255)",
  width: "102px",
};

const link = {
  textDecoration: "underline",
  color: "#2754C5",
  fontWeight: "bold",
};
