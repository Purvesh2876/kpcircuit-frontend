import React from "react";
import {
  Box,
  Text,
  Stack,
  SimpleGrid,
  Divider,
  Input,
  IconButton,
  Flex,
  Image,
} from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import logo from "./logo.png";

const Footer = () => {
  return (
    <Box bg="brand.dark" color="white" mt={20}>

      {/* MAIN FOOTER */}
      <Box px={{ base: 6, md: 16 }} py={16}>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 4 }}
          spacing={12}
        >

          {/* BRAND */}
          <Box>
            {/* <Image src={logo} width="120px" mb={6} /> */}
            <Text fontWeight="600" mb={5}>
              KP CIRCUIT CITY
            </Text>
            <Text color="gray.400" fontSize="sm" lineHeight="1.8">
              Premium electronics curated for performance and reliability.
              Powering your digital lifestyle with quality & trust.
            </Text>
          </Box>

          {/* QUICK LINKS */}
          <Box>
            <Text fontWeight="600" mb={5}>
              Sections
            </Text>

            <Stack spacing={3} fontSize="sm">
              <Link to="/products">
                <Text _hover={{ color: "brand.50" }} color="gray.400">
                  Shop All
                </Text>
              </Link>
              <Link to="/myorders">
                <Text _hover={{ color: "brand.50" }} color="gray.400">
                  My Orders
                </Text>
              </Link>
              <Link to="/profile">
                <Text _hover={{ color: "brand.50" }} color="gray.400">
                  My Profile
                </Text>
              </Link>
              <Link to="/about">
                <Text _hover={{ color: "brand.50" }} color="gray.400">
                  About Us
                </Text>
              </Link>
            </Stack>
          </Box>

          {/* QUICK LINKS */}
          <Box>
            <Text fontWeight="600" mb={5}>
              Quick Links
            </Text>

            <Stack spacing={3} fontSize="sm">
              <Link to="/refund">
                <Text _hover={{ color: "brand.50" }} color="gray.400">
                  Return / Exchange
                </Text>
              </Link>
              <Link to="/privacy">
                <Text _hover={{ color: "brand.50" }} color="gray.400">
                  Privacy Policy
                </Text>
              </Link>
              <Link to="/shipping">
                <Text _hover={{ color: "brand.50" }} color="gray.400">
                  Shipping Policy
                </Text>
              </Link>
              <Link to="/termsandcondition">
                <Text _hover={{ color: "brand.50" }} color="gray.400">
                  Terms & Conditions
                </Text>
              </Link>
            </Stack>
          </Box>

          {/* CUSTOMER SUPPORT */}
          <Box>
            <Text fontWeight="600" mb={5}>
              Customer Support
            </Text>

            <Stack spacing={3} fontSize="sm" color="gray.400">
              <Text>Mon – Sun | 10 AM – 8 PM</Text>
              <Text _hover={{ color: "brand.50" }} cursor="pointer">
                WhatsApp: +91 8889014888
              </Text>
              <Text _hover={{ color: "brand.50" }} cursor="pointer">
                Instagram: @kpcircuitcity
              </Text>
              <Text>support@kpcircuitcity.com</Text>
            </Stack>
          </Box>

          {/* NEWSLETTER */}
          {/* <Box>
            <Text fontWeight="600" mb={5}>
              Stay Updated
            </Text>

            <Text fontSize="sm" color="gray.400" mb={4}>
              Get latest offers & product launches directly in your inbox.
            </Text>

            <Flex>
              <Input
                placeholder="Enter your email"
                bg="gray.900"
                border="1px solid #333"
                borderRight="none"
                borderRadius="full 0 0 full"
                _focus={{
                  borderColor: "white",
                  boxShadow: "none",
                }}
              />

              <IconButton
                aria-label="Subscribe"
                icon={<EmailIcon />}
                bg="white"
                color="black"
                borderRadius="0 full full 0"
                _hover={{ bg: "gray.200" }}
              />
            </Flex>
          </Box> */}

        </SimpleGrid>
      </Box>

      {/* BOTTOM BAR */}
      <Divider borderColor="gray.800" />

      <Box
        px={{ base: 6, md: 16 }}
        py={6}
        textAlign="center"
      // bg="brand.500"
      >
        <Text fontSize="sm" color="gray.500">
          © {new Date().getFullYear()} KP Circuit City. All Rights Reserved.
        </Text>
      </Box>
    </Box>
  );
};

export default Footer;