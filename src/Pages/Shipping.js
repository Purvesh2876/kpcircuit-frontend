// ShippingPolicy.jsx

import React from "react";
import { Container, Box, Heading, Text } from "@chakra-ui/react";

const ShippingPolicy = () => {
  return (
    <main>
      <Container maxW="container.lg" py={10}>
        <Heading mb={6}>Shipping Policy</Heading>

        <Text mb={4}>
          <strong>Effective Date:</strong> [Insert Date]
        </Text>

        <Text mb={6}>
          This Shipping Policy applies to all orders placed through
          <strong> https://kpcircuitcity.com</strong> operated by
          <strong> KP Circuit City Private Limited</strong>.
        </Text>

        {/* 1 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>1. Shipping Coverage</Heading>
          <Text>
            We currently ship orders across India.
            <br /><br />
            International shipping is not available at this time.
          </Text>
        </Box>

        {/* 2 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>2. Order Processing Time</Heading>
          <Text>
            Orders are processed within 1–2 business days after successful
            payment confirmation.
            <br /><br />
            Orders are not processed on Sundays or public holidays.
          </Text>
        </Box>

        {/* 3 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>3. Shipping Timeline</Heading>
          <Text>
            Delivery timelines typically range between 3–7 business days,
            depending on the delivery location.
            <br /><br />
            Remote locations may require additional delivery time.
          </Text>
        </Box>

        {/* 4 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>4. Shipping Charges</Heading>
          <Text>
            Shipping charges, if applicable, will be calculated and displayed
            at checkout before payment confirmation.
          </Text>
        </Box>

        {/* 5 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>5. Payment Method</Heading>
          <Text>
            We offer prepaid orders only.
            <br /><br />
            Cash on Delivery (COD) is not available.
          </Text>
        </Box>

        {/* 6 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>6. Tracking Information</Heading>
          <Text>
            Once your order is shipped, tracking details will be shared via
            email or SMS to the registered contact details.
          </Text>
        </Box>

        {/* 7 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>7. Delays & Liability</Heading>
          <Text>
            While we strive to ensure timely delivery, delays may occur due to:
            <br /><br />
            • Courier partner issues<br />
            • Weather conditions<br />
            • Government restrictions<br />
            • Unforeseen logistical challenges
            <br /><br />
            KP Circuit City Private Limited shall not be held liable for delays
            caused by third-party logistics providers.
          </Text>
        </Box>

        {/* 8 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>8. Incorrect Address</Heading>
          <Text>
            Customers are responsible for providing accurate shipping details.
            <br /><br />
            We are not responsible for delivery failures due to incorrect or
            incomplete addresses provided at the time of order placement.
          </Text>
        </Box>

        {/* 9 */}
        <Box mb={6}>
          <Heading size="md" mb={2}>9. Company Details</Heading>
          <Text>
            <strong>KP Circuit City Private Limited</strong><br />
            Ground Floor, Shed No. H/161, Ved Industrial Park-2,<br />
            B/H Shreenath Estate, Bhuwaldi Road,<br />
            Kathwada GIDC, Kathwada,<br />
            Ahmedabad, Gujarat – 382430<br /><br />
            Contact: 8160334012<br />
            Email: kpcircuitcity@gmail.com
          </Text>
        </Box>

      </Container>
    </main>
  );
};

export default ShippingPolicy;