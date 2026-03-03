// PrivacyPolicy.jsx

import React from "react";
import { Container, Box, Heading, Text } from "@chakra-ui/react";

const PrivacyPolicy = () => {
  return (
    <main>
      <Container maxW="container.lg" py={10}>
        <Heading mb={6}>Privacy Policy</Heading>

        <Text mb={4}>
          <strong>Effective Date:</strong> [Insert Date]
        </Text>

        <Text mb={6}>
          This Privacy Policy describes how <strong>KP Circuit City Private Limited</strong>
          ("Company", "we", "our", "us") collects, uses, and protects your
          personal information when you visit or make a purchase from
          <strong> https://kpcircuitcity.com</strong>.
        </Text>

        {/* 1 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>1. Company Information</Heading>
          <Text>
            <strong>Company Name:</strong> KP Circuit City Private Limited<br />
            <strong>Registered Address:</strong> Ground Floor, Shed No. H/161,
            Ved Industrial Park-2, B/H Shreenath Estate,
            Bhuwaldi Road, Kathwada GIDC, Kathwada,
            Ahmedabad, Gujarat – 382430<br />
            <strong>GSTIN:</strong> 24AALCK7210Q1Z4<br />
            <strong>Contact Number:</strong> 8160334012<br />
            <strong>Email:</strong> kpcircuitcity@gmail.com
          </Text>
        </Box>

        {/* 2 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>2. Information We Collect</Heading>
          <Text>
            We may collect the following information:
            <br /><br />
            • Full name<br />
            • Email address<br />
            • Phone number<br />
            • Shipping & billing address<br />
            • Payment information (processed securely via Razorpay)<br />
            • Order history<br />
            • IP address and browser/device information
          </Text>
        </Box>

        {/* 3 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>3. How We Use Your Information</Heading>
          <Text>
            We use your information to:
            <br /><br />
            • Process and fulfill orders<br />
            • Communicate order updates<br />
            • Provide customer support<br />
            • Improve website performance<br />
            • Comply with legal and tax obligations
          </Text>
        </Box>

        {/* 4 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>4. Payment Security</Heading>
          <Text>
            All payments are processed securely through authorized payment
            gateways including Razorpay and its banking partners.
            <br /><br />
            We do not store your debit/credit card details on our servers.
          </Text>
        </Box>

        {/* 5 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>5. Data Sharing</Heading>
          <Text>
            We do not sell or rent your personal information.
            <br /><br />
            Information may be shared only with:
            <br />
            • Payment gateway providers<br />
            • Courier/logistics partners for delivery<br />
            • Government authorities if legally required
          </Text>
        </Box>

        {/* 6 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>6. Data Protection</Heading>
          <Text>
            We implement reasonable technical and organizational security
            measures to protect your data against unauthorized access,
            alteration, disclosure, or destruction.
          </Text>
        </Box>

        {/* 7 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>7. Cookies</Heading>
          <Text>
            Our website may use cookies to enhance user experience and
            analyze website traffic. You may choose to disable cookies
            through your browser settings.
          </Text>
        </Box>

        {/* 8 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>8. Data Retention</Heading>
          <Text>
            We retain customer data only as long as necessary to fulfill
            business, tax, and legal obligations.
          </Text>
        </Box>

        {/* 9 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>9. Your Rights</Heading>
          <Text>
            You may request access, correction, or deletion of your
            personal information by contacting us at
            kpcircuitcity@gmail.com.
          </Text>
        </Box>

        {/* 10 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>10. Governing Law</Heading>
          <Text>
            This Privacy Policy shall be governed by the laws of India.
            Any disputes shall be subject to the jurisdiction of courts
            located in Ahmedabad, Gujarat.
          </Text>
        </Box>

      </Container>
    </main>
  );
};

export default PrivacyPolicy;