// TermsAndConditions.jsx

import React from "react";
import { Container, Box, Heading, Text } from "@chakra-ui/react";

const TermsAndConditions = () => {
  return (
    <main>
      <Container maxW="container.lg" py={10}>
        <Heading mb={6}>Terms & Conditions</Heading>

        <Text mb={4}>
          <strong>Effective Date:</strong> [Insert Date]
        </Text>

        <Text mb={6}>
          Welcome to <strong>KP Circuit City Private Limited</strong>
          ("Company", "we", "our", "us"). These Terms & Conditions govern your
          use of our website <strong>https://kpcircuitcity.com</strong> and the
          purchase of products from our platform.
          <br /><br />
          By accessing our website or placing an order, you agree to be legally
          bound by these Terms.
        </Text>

        <Box mb={6}>
          <Heading size="md" mb={2}>1. Business Information</Heading>
          <Text>
            <strong>Company Name:</strong> KP Circuit City Private Limited<br />
            <strong>Registered Address:</strong> Ground Floor, Shed No. H/161, Ved Industrial Park-2,
            B/H Shreenath Estate, Bhuwaldi Road, Kathwada GIDC,
            Kathwada, Ahmedabad, Gujarat – 382430<br />
            <strong>GSTIN:</strong> 24AALCK7210Q1Z4<br />
            <strong>Contact Number:</strong> 8160334012<br />
            <strong>Email:</strong> kpcircuitcity@gmail.com
          </Text>
        </Box>

        <Box mb={6}>
          <Heading size="md" mb={2}>2. Eligibility</Heading>
          <Text>
            By using this website, you confirm that you are at least 18 years
            of age or accessing the website under the supervision of a legal guardian.
          </Text>
        </Box>

        <Box mb={6}>
          <Heading size="md" mb={2}>3. Nature of Products</Heading>
          <Text>
            KP Circuit City Private Limited sells electronic components,
            development boards, circuit modules, robotics components,
            electrical accessories, and related technical hardware products.
            <br /><br />
            All products are intended for educational, industrial, research,
            and technical use.
          </Text>
        </Box>

        <Box mb={6}>
          <Heading size="md" mb={2}>4. Pricing & Payments</Heading>
          <Text>
            All prices are listed in Indian Rupees (INR ₹) and applicable GST
            will be charged at checkout.
            <br /><br />
            Payments are processed securely through authorized payment
            gateways including Razorpay and its banking partners.
            <br /><br />
            Cash on Delivery (COD) is <strong>not available</strong>.
            <br /><br />
            Orders are confirmed only after successful payment authorization.
          </Text>
        </Box>

        <Box mb={6}>
          <Heading size="md" mb={2}>5. Order Cancellation</Heading>
          <Text>
            Orders once placed cannot be cancelled after dispatch.
            <br /><br />
            We reserve the right to cancel orders in case of pricing errors,
            stock unavailability, or suspected fraudulent transactions.
            In such cases, a full refund will be processed.
          </Text>
        </Box>

        <Box mb={6}>
          <Heading size="md" mb={2}>6. Shipping & Delivery</Heading>
          <Text>
            Orders are shipped through third-party courier partners across India.
            Estimated delivery timelines are displayed at checkout.
            <br /><br />
            Delivery delays caused by logistics providers, weather conditions,
            or unforeseen circumstances are beyond our control.
          </Text>
        </Box>

        <Box mb={6}>
          <Heading size="md" mb={2}>7. Returns, Replacements & Refunds</Heading>
          <Text>
            We follow a strict <strong>No Return Policy</strong>.
            <br /><br />
            Replacement is allowed only if a manufacturing defect is reported
            within <strong>3 days of delivery</strong>.
            <br /><br />
            If a defect is verified, KP Circuit City will arrange courier pickup
            (if required) and dispatch a replacement product.
            <br /><br />
            If replacement is not possible, refund will be initiated on the
            same day of approval. The credited amount may reflect in the
            customer's account as per the banking partner's processing time.
          </Text>
        </Box>

        <Box mb={6}>
          <Heading size="md" mb={2}>8. Warranty</Heading>
          <Text>
            Some products may carry manufacturer warranty where applicable.
            Warranty terms vary depending on the manufacturer.
            <br /><br />
            We are not responsible for damages caused due to improper
            installation, misuse, voltage fluctuations, unauthorized
            modification, or incorrect handling.
          </Text>
        </Box>

        <Box mb={6}>
          <Heading size="md" mb={2}>9. Limitation of Liability</Heading>
          <Text>
            To the maximum extent permitted by law, KP Circuit City Private
            Limited shall not be liable for any indirect, incidental, or
            consequential damages arising from the use of our products.
            <br /><br />
            Our total liability shall not exceed the purchase value of the product.
          </Text>
        </Box>

        <Box mb={6}>
          <Heading size="md" mb={2}>10. Governing Law & Jurisdiction</Heading>
          <Text>
            These Terms shall be governed by the laws of India.
            <br /><br />
            Any disputes shall be subject to the exclusive jurisdiction of
            courts located in Ahmedabad, Gujarat.
          </Text>
        </Box>

      </Container>
    </main>
  );
};

export default TermsAndConditions;