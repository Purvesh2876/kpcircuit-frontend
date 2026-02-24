import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Heading,
  Box,
  Image,
  Button,
  Text,
  Divider,
  HStack,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Input,
  VStack,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";
import { createOrder, getCart, removeFromCart } from "../actions/api";

/* -------------------- LOAD RAZORPAY SCRIPT -------------------- */
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const ShoppingCartDrawer = ({ isCartOpen, setCartOpen }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const toast = useToast();

  /* -------------------- FETCH CART -------------------- */
  const getCartData = async () => {
    try {
      const response = await getCart();
      setCartItems(response.items);
      setCartTotal(response.totalPrice);
    } catch (error) {
      toast({
        title: error.response?.data?.message || "Error fetching cart",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (isCartOpen) getCartData();
  }, [isCartOpen]);

  /* -------------------- REMOVE ITEM -------------------- */
  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId);
      getCartData();
    } catch (error) {
      toast({
        title: "Failed to remove item",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  /* -------------------- CHECKOUT -------------------- */
  const handleDone = async () => {
    if (!name || !phoneNumber || !email || !address || !city || !pincode) {
      toast({
        title: "Please fill all details",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    const sdkLoaded = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!sdkLoaded) {
      toast({ title: "Payment SDK failed to load", status: "error" });
      return;
    }

    const shippingInfo = { name, email, phone: phoneNumber, address, city, pincode };

    const orderItems = cartItems.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      priceAtAdd: item.priceAtAdd,
    }));

    const orderData = {
      amount: cartTotal,
      currency: "INR",
      shippingInfo,
      items: orderItems,
    };

    try {
      const data = await createOrder(orderData);

      const options = {
        key: "rzp_test_S0jaQgN2TWpblg",
        amount: data.razorpayOrder.amount,
        currency: "INR",
        name: "Nisarg Ecomm",
        order_id: data.razorpayOrder.id,
        handler: async function (response) {
          try {
            await axios.post(
              `${process.env.REACT_APP_API_URL}/order/verify`,
              response
            );

            toast({
              title: "Payment Successful",
              status: "success",
              duration: 4000,
            });

            setOrderModalOpen(false);
            setCartOpen(false);
          } catch {
            toast({
              title: "Payment Verification Failed",
              status: "error",
            });
          }
        },
        prefill: { name, email, contact: phoneNumber },
        theme: { color: "#000000" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast({
        title: error.response?.data?.message || "Order Failed",
        status: "error",
      });
    }
  };

  return (
    <>
      <Drawer
        placement="right"
        onClose={() => setCartOpen(false)}
        isOpen={isCartOpen}
      >
        <DrawerOverlay />
        <DrawerContent
          maxW={{ base: "100%", md: "420px" }}
          borderLeftRadius="20px"
        >
          <DrawerCloseButton />
          <DrawerHeader>
            <Heading size="lg">Your Cart ({cartItems.length})</Heading>
          </DrawerHeader>

          <DrawerBody display="flex" flexDirection="column">
            {/* -------------------- CART ITEMS -------------------- */}
            <Stack spacing={6} flex="1" overflowY="auto">
              {cartItems.length === 0 ? (
                <Text textAlign="center" color="gray.500">
                  Your cart is empty
                </Text>
              ) : (
                cartItems.map((item) => (
                  <HStack
                    key={item.product._id}
                    spacing={4}
                    align="start"
                  >
                    <Image
                      src={`/uploads${item.product.images[0]}`} // ${process.env.REACT_APP_API_URL}
                      boxSize="80px"
                      borderRadius="12px"
                      objectFit="cover"
                    />
                    <Stack flex="1" spacing={1}>
                      <Text fontWeight="600">
                        {item.product.name}
                      </Text>
                      <Text fontSize="sm">
                        Qty: {item.quantity}
                      </Text>
                      <Text fontWeight="bold">
                        ₹ {item.priceAtAdd}
                      </Text>
                    </Stack>
                    <DeleteIcon
                      cursor="pointer"
                      onClick={() =>
                        handleRemoveFromCart(item.product._id)
                      }
                    />
                  </HStack>
                ))
              )}
            </Stack>

            {/* -------------------- SUMMARY -------------------- */}
            <Box mt={6} pt={4} borderTop="1px solid #eee">
              <Flex justify="space-between" mb={4}>
                <Text fontWeight="600">Subtotal</Text>
                <Text fontWeight="bold">₹ {cartTotal}</Text>
              </Flex>

              <Button
                w="100%"
                bg="black"
                color="white"
                borderRadius="full"
                _hover={{ bg: "gray.800" }}
                onClick={() => setOrderModalOpen(true)}
                isDisabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* ================= CHECKOUT MODAL ================= */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent borderRadius="20px">
          <ModalHeader>Checkout Details</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Tabs index={currentStep} isFitted>
              <TabList>
                <Tab>Details</Tab>
                <Tab isDisabled={currentStep === 0}>Address</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <VStack spacing={4}>
                    <Input
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <Input
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={4}>
                    <Input
                      placeholder="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <Input
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <Input
                      placeholder="Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter>
            {currentStep === 0 ? (
              <Button
                bg="black"
                color="white"
                borderRadius="full"
                onClick={() => setCurrentStep(1)}
                isDisabled={!name || !phoneNumber || !email}
              >
                Next
              </Button>
            ) : (
              <Button
                bg="black"
                color="white"
                borderRadius="full"
                onClick={handleDone}
              >
                Pay ₹ {cartTotal}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShoppingCartDrawer;
