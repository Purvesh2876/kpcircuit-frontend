// RefundPolicy.jsx

import React from "react";
import { Container, Box, Heading, Text } from "@chakra-ui/react";

const RefundPolicy = () => {
  return (
    <main>
      <Container maxW="container.lg" py={10}>
        <Heading mb={6}>Refund & Return Policy</Heading>

        <Text mb={4}>
          <strong>Effective Date:</strong> [Insert Date]
        </Text>

        <Text mb={6}>
          This Refund & Return Policy applies to purchases made from
          <strong> KP Circuit City Private Limited</strong> through
          <strong> https://kpcircuitcity.com</strong>.
        </Text>

        {/* 1 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>1. General Policy</Heading>
          <Text>
            We follow a strict <strong>No Return Policy</strong>.
            <br /><br />
            Returns are not accepted unless the product is found to be
            defective or damaged at the time of delivery.
          </Text>
        </Box>

        {/* 2 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>2. Defective Product Claims</Heading>
          <Text>
            If a product is found to be defective, the customer must notify us
            within <strong>3 days of delivery</strong>.
            <br /><br />
            Claims made after 3 days from the date of delivery will not be eligible
            for replacement or refund.
            <br /><br />
            To initiate a defect claim, customers must contact us at:
            <br />
            📧 kpcircuitcity@gmail.com <br />
            📞 8160334012
            <br /><br />
            Customers may be required to provide:
            <br />
            • Order number<br />
            • Clear images or video of the defect<br />
            • Description of the issue
          </Text>
        </Box>

        {/* 3 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>3. Replacement Policy</Heading>
          <Text>
            If the defect is verified by our technical team, we will:
            <br /><br />
            • Arrange reverse pickup (if applicable), or<br />
            • Request the customer to courier the product to our registered address
            <br /><br />
            After inspection and approval, a replacement product will be dispatched.
          </Text>
        </Box>

        {/* 4 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>4. Refund Policy</Heading>
          <Text>
            If replacement is not possible due to stock unavailability or other
            valid reasons, a refund will be initiated on the same day of approval.
            <br /><br />
            The amount will be credited back to the original payment method.
            <br /><br />
            Please note that while refund initiation is done on the same day,
            the credit timeline depends on the respective bank or payment provider,
            and may take 5–7 business days to reflect.
          </Text>
        </Box>

        {/* 5 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>5. Non-Eligible Cases</Heading>
          <Text>
            Replacement or refund will not be applicable in the following cases:
            <br /><br />
            • Damage caused due to improper installation<br />
            • Incorrect wiring or voltage fluctuations<br />
            • Physical damage caused after delivery<br />
            • Misuse or unauthorized modifications<br />
            • Normal wear and tear
          </Text>
        </Box>

        {/* 6 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>6. Manufacturer Warranty</Heading>
          <Text>
            Some products may carry manufacturer warranty.
            Warranty terms vary depending on the manufacturer and are subject
            to their respective policies.
          </Text>
        </Box>

        {/* 7 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>7. Company Details</Heading>
          <Text>
            <strong>KP Circuit City Private Limited</strong><br />
            Ground Floor, Shed No. H/161, Ved Industrial Park-2,<br />
            B/H Shreenath Estate, Bhuwaldi Road,<br />
            Kathwada GIDC, Kathwada,<br />
            Ahmedabad, Gujarat – 382430<br /><br />
            GSTIN: 24AALCK7210Q1Z4
          </Text>
        </Box>

      </Container>
    </main>
  );
};

export default RefundPolicy;