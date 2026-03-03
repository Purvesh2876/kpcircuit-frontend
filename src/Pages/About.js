// AboutUs.jsx

import React from "react";
import { Container, Box, Heading, Text, Stack } from "@chakra-ui/react";

const AboutUs = () => {
  return (
    <main>
      <Container maxW="container.lg" py={10}>
        <Heading mb={6}>About Us</Heading>

        <Text mb={6}>
          <strong>KP Circuit City Private Limited</strong> is an Ahmedabad-based
          electronics components supplier dedicated to serving students,
          hobbyists, engineers, startups, and industrial clients across India.
          <br /><br />
          We specialize in providing high-quality electronic components,
          development boards, circuit modules, robotics components, and
          electrical accessories at competitive prices.
        </Text>

        {/* Mission */}
        <Box mb={6}>
          <Heading size="md" mb={2}>Our Mission</Heading>
          <Text>
            Our mission is to simplify access to reliable electronic components
            and technical hardware for innovators and professionals. We aim to
            support learning, experimentation, research, and product development
            by ensuring product availability, transparency, and dependable service.
          </Text>
        </Box>

        {/* What We Offer */}
        <Box mb={6}>
          <Heading size="md" mb={2}>What We Offer</Heading>
          <Stack spacing={2}>
            <Text>• Electronic Components</Text>
            <Text>• Development Boards & Microcontroller Modules</Text>
            <Text>• Robotics & Automation Components</Text>
            <Text>• Power Supply Modules & Accessories</Text>
            <Text>• Circuit Protection & Connectivity Products</Text>
          </Stack>
        </Box>

        {/* Why Choose Us */}
        <Box mb={6}>
          <Heading size="md" mb={2}>Why Choose KP Circuit City?</Heading>
          <Text>
            • Genuine and quality-checked products<br />
            • Transparent pricing with GST compliance<br />
            • Secure online payments via trusted payment gateways<br />
            • Fast order processing and reliable shipping<br />
            • Dedicated customer support
          </Text>
        </Box>

        {/* Business Information */}
        <Box mb={6}>
          <Heading size="md" mb={2}>Company Information</Heading>
          <Text>
            <strong>Legal Name:</strong> KP Circuit City Private Limited<br />
            <strong>Registered Office:</strong> Ground Floor, Shed No. H/161,
            Ved Industrial Park-2, B/H Shreenath Estate,
            Bhuwaldi Road, Kathwada GIDC,
            Ahmedabad, Gujarat – 382430<br /><br />
            <strong>GSTIN:</strong> 24AALCK7210Q1Z4<br />
            <strong>Email:</strong> kpcircuitcity@gmail.com<br />
            <strong>Contact:</strong> 8160334012
          </Text>
        </Box>

        {/* Vision */}
        <Box mb={6}>
          <Heading size="md" mb={2}>Our Vision</Heading>
          <Text>
            We envision becoming a trusted electronics supply partner for
            individuals and businesses across India by maintaining quality,
            technical reliability, and long-term customer relationships.
          </Text>
        </Box>

      </Container>
    </main>
  );
};

export default AboutUs;