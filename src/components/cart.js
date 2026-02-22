// import React, { useEffect, useState } from 'react';
// import {
//   Drawer,
//   DrawerOverlay,
//   DrawerContent,
//   DrawerCloseButton,
//   DrawerHeader,
//   DrawerBody,
//   VStack, Heading, Box, Link, useColorModeValue as mode, Flex,
//   Input, Image,
//   Select,
//   Button,
//   Text,
//   Divider,
//   List,
//   ListItem,
//   ListIcon,
//   HStack,
//   Stack,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
//   Tabs,
//   Tab,
//   TabList,
//   TabPanel,
//   TabPanels,
//   useToast,
// } from '@chakra-ui/react';
// import axios from 'axios';
// import { MdCheckCircle, MdLocationCity } from 'react-icons/md';
// import { createOrder, getCart, getCartTotal, removeFromCart } from '../actions/api';
// import { DeleteIcon } from '@chakra-ui/icons';

// // --- ADD THIS FUNCTION HERE ---
// function loadScript(src) {
//   return new Promise((resolve) => {
//     const script = document.createElement("script");
//     script.src = src;
//     script.onload = () => {
//       resolve(true);
//     };
//     script.onerror = () => {
//       resolve(false);
//     };
//     document.body.appendChild(script);
//   });
// }

// const ShoppingCartDrawer = ({
//   isCartOpen,
//   setCartOpen,

// }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [cartTotal, setCartTotal] = useState(0);
//   const [activeTab, setActiveTab] = useState(0); // 0 for phone number, 1 for address
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [address, setAddress] = useState('');
//   const [city, setCity] = useState('');
//   const [pincode, setPincode] = useState('');
//   const [isOrderModalOpen, setOrderModalOpen] = useState(false);
//   const [currentStep, setCurrentStep] = useState(0);
//   const toast = useToast();

//   const handleRemoveFromCart = async (itemId, color) => {
//     console.log('itemif', itemId, color);
//     try {
//       const response = await removeFromCart(itemId, color);
//       console.log('Response from removeFromCart:', response);
//       getCartData();
//     } catch (error) {
//       console.error('Error removing item from cart:', error);
//     }
//   };

//   const getCartData = async () => {
//     try {
//       const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
//       const response = await getCart();
//       console.log(response, 'getCart');
//       // const response2 = await getCartTotal();
//       // setCartTotal(response2.total);
//       setCartTotal(response.totalPrice);
//       setCartItems(response.items);
//     } catch (error) {
//       console.error('Error fetching cart data:', error);
//       toast({
//         title: error.response.data.message,
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };
//   useEffect(() => {
//     if (isCartOpen) {
//       getCartData();
//     }
//   }, [isCartOpen]);


//   const handleNextStep = () => {
//     setCurrentStep(currentStep + 1);
//   };

//   // Function to handle the checkout process
//   const handleCheckout = () => {
//     setOrderModalOpen(true);
//   };
//   const handleTabChange = (index) => {
//     setActiveTab(index);
//   };

//   // const handleDone = () => {
//   //   if (phoneNumber && name && email && address && city && pincode) {
//   //     const data = {
//   //       "name": name,
//   //       "email": email,
//   //       "phone": phoneNumber,
//   //       "address": address,
//   //       "city": city,
//   //       "pincode": pincode,
//   //     }

//   //     const token = localStorage.getItem('token');

//   //     // Set the Authorization header with the token
//   //     const headers = {
//   //       Authorization: `Bearer ${token}`,
//   //     };

//   //     axios.post('http://localhost:5000/orders/checkout', data, { headers }).then(res => console.log(res)).catch(error => {
//   //       console.error(error);
//   //     });
//   //   }

//   //   // axios.post('localhost:4000/orders/checkout')



//   //   // Close the modal after confirming the order
//   //   setOrderModalOpen(false);
//   //   setCurrentStep(0)
//   // };

//   // ... existing imports
//   // Make sure you have your Razorpay Key ID available (e.g., in .env or hardcoded for dev)
//   const RAZORPAY_KEY_ID = "rzp_test_S0jaQgN2TWpblg";

//   const handleDone = async () => {
//     // 1. Validation
//     if (!phoneNumber || !name || !email || !address || !city || !pincode) {
//       toast({
//         title: "Please fill all details",
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }

//     // 2. Load Razorpay SDK
//     const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
//     if (!res) {
//       toast({
//         title: "Razorpay SDK failed to load. Are you online?",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }

//     // 3. Prepare Data for Backend
//     const shippingInfo = {
//       name,
//       email,
//       phone: phoneNumber,
//       address,
//       city,
//       pincode,
//     };

//     // Map cart items
//     const orderItems = cartItems.map((item) => ({
//       product: item.product._id,
//       name: item.product.name,
//       manufacturer: item.product.manufacturer || "Unknown",
//       quantity: item.quantity,
//       priceAtAdd: item.priceAtAdd, // Note: In future, fetch price from DB for security
//     }));

//     const orderData = {
//       amount: cartTotal, // Uses state variable
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//       shippingInfo,
//       items: orderItems,
//       notes: {
//         desc: "Order from Website",
//       },
//     };

//     const token = localStorage.getItem("token");
//     const headers = {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     };

//     try {
//       // 4. Create Order on Backend
//       // This calls your createOrderAndProcessPayment controller
//       const data = await createOrder(orderData);

//       console.log("Order Created:", data);

//       if (!data || !data.razorpayOrder) {
//         throw new Error("Failed to get Order ID from backend");
//       }

//       // 5. Configure Razorpay Options
//       const options = {
//         key: 'rzp_test_S0jaQgN2TWpblg', // Make sure this matches backend .env
//         amount: data.razorpayOrder.amount,
//         currency: data.razorpayOrder.currency,
//         name: "Nisarg Ecomm",
//         description: "Transaction",
//         image: "https://your-logo-url.com/logo.png",
//         order_id: data.razorpayOrder.id, // THE RAZORPAY ORDER ID (Starts with 'order_...')

//         // --- THE HANDLER: This runs when payment succeeds on Razorpay popup ---
//         handler: async function (response) {
//           console.log("Payment success on Gateway, Verifying...");

//           try {
//             const verifyUrl = "http://localhost:5000/api/order/verify";

//             // These variable names MUST match what verifyPayment in backend expects
//             const verifyData = {
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature,
//             };

//             const verifyRes = await axios.post(verifyUrl, verifyData, { headers });

//             if (verifyRes.data.success) {
//               toast({
//                 title: "Payment Successful",
//                 description: "Your order has been placed.",
//                 status: "success",
//                 duration: 5000,
//                 isClosable: true,
//               });

//               // Close Modal and Reset
//               setOrderModalOpen(false);
//               setCurrentStep(0);
//               // Add logic here to clear cart if needed
//             }
//           } catch (error) {
//             console.error("Verification Error", error);
//             toast({
//               title: "Payment Verification Failed",
//               description: "Payment deducted but verification failed. Contact support.",
//               status: "error",
//               duration: 5000,
//               isClosable: true,
//             });
//           }
//         },
//         // ---------------------------------------------------------------------

//         prefill: {
//           name: name,
//           email: email,
//           contact: phoneNumber,
//         },
//         notes: {
//           address: address,
//         },
//         theme: {
//           color: "#000000",
//         },
//       };

//       // 6. Open the Payment Window
//       const paymentObject = new window.Razorpay(options);
//       paymentObject.open();

//     } catch (error) {
//       console.error("Error in handleDone:", error);
//       toast({
//         title: "Something went wrong",
//         description: error.response?.data?.message || error.message,
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   return (
//     <Drawer
//       placement="right"
//       onClose={() => setCartOpen(false)}
//       isOpen={isCartOpen}
//       size="auto"
//     >
//       <DrawerOverlay>
//         <DrawerContent style={{ maxWidth: "100%", width: "40%" }}>
//           <DrawerCloseButton />
//           <DrawerHeader>
//             <Heading fontSize="2xl" fontWeight="extrabold">
//               Cart ({cartItems.length} items)
//             </Heading>
//           </DrawerHeader>
//           <Divider my={4} />
//           <DrawerBody>
//             <Box
//               maxW={{ base: "3xl", lg: "7xl" }}
//               mx="auto"
//               px={{ base: "4", md: "8", lg: "12" }}
//               py={{ base: "6", md: "8", lg: "12" }}
//             >
//               <Stack
//                 direction={{ base: "column", lg: "row" }}
//                 align={{ lg: "flex-start" }}
//                 spacing={{ base: "8", md: "16" }}
//               >
//                 <Stack
//                   spacing={{ base: "8", md: "10" }}
//                   flex="2"
//                   position="relative"
//                 >
//                   <Stack spacing="6">
//                     {cartItems && cartItems.length > 0 ? (
//                       cartItems.map((item, index) => (
//                         <HStack
//                           display="flex"
//                           key={index}
//                           spacing={4}
//                           borderBottom="1px solid"
//                           borderColor="gray.200"
//                         >
//                           <Image
//                             src={`http://localhost:5000/uploads${item.product.images[0]}`}
//                             alt={item.product.name}
//                             boxSize="80px"
//                             objectFit="cover"
//                           />
//                           <Stack flex="1">
//                             <Text fontSize="md" fontWeight="bold">
//                               {item.product.name}
//                             </Text>
//                             <Text fontSize="xs">
//                               Color: {item.color}
//                             </Text>
//                             {/* <Text fontSize="xs">Size: {item.selectedSize}</Text> */}
//                             <Text fontSize="xs">Quantity: {item.quantity}</Text>
//                           </Stack>
//                           <Stack display={"flex"} mt={18} alignItems="end" gap={2}>
//                             <DeleteIcon onClick={() => handleRemoveFromCart(item.product._id, item.color)} cursor="pointer" />
//                             <Text fontSize="xs" fontWeight="bold">
//                               Price: ${item.priceAtAdd}
//                             </Text>
//                           </Stack>
//                         </HStack>
//                       ))
//                     ) : (
//                       <Text textAlign="center" color="gray.500">
//                         No items in the cart
//                       </Text>
//                     )}
//                   </Stack>
//                 </Stack>
//               </Stack>

//               <Flex direction="column" align="center" flex="1">
//                 {/* Additional components related to cart summary can be added here */}
//               </Flex>
//               <Stack
//                 position="sticky"
//                 bottom="0"
//                 bg="white"
//                 p={4}
//                 borderTop="1px solid"
//                 borderColor="gray.200"
//               >
//                 <Text fontSize="lg" fontWeight="bold">
//                   Subtotal: {/* Add your logic to calculate subtotal */}
//                 </Text>
//                 <Button
//                   onClick={handleCheckout}
//                   bg="black"
//                   color="white"
//                   _hover={{}}
//                   size="md"
//                   mt={2}
//                 >
//                   Proceed to Checkout: ₹{cartTotal}
//                 </Button>
//               </Stack>
//               <Modal
//                 isOpen={isOrderModalOpen}
//                 onClose={() => setOrderModalOpen(false)}
//               >
//                 <ModalOverlay />
//                 <ModalContent>
//                   <ModalHeader>Order Confirmation</ModalHeader>
//                   <ModalCloseButton />
//                   <ModalBody>
//                     <Tabs index={currentStep} onChange={handleTabChange}>
//                       <TabList>
//                         <Tab
//                           _selected={{
//                             borderBottom: "2px solid black", // Change the bottom border color for the active tab
//                             color: "black", // Change the text color for the active tab
//                           }}
//                           onClick={() => setCurrentStep(0)}
//                         >
//                           1 Reciever Details
//                         </Tab>
//                         <Tab
//                           isDisabled={currentStep === 0}
//                           _selected={{
//                             borderBottom: "2px solid black", // Change the bottom border color for the active tab
//                             color: "black", // Change the text color for the active tab
//                           }}
//                         >
//                           2 Address
//                         </Tab>
//                       </TabList>
//                       <TabPanels>
//                         <TabPanel>
//                           <VStack spacing={4} align="stretch">
//                             <Text>Name:</Text>
//                             <Input
//                               type="tel"
//                               placeholder="Name"
//                               value={name}
//                               onChange={(e) => setName(e.target.value)}
//                             />
//                             <Text>Phone:</Text>
//                             <Input
//                               type="tel"
//                               placeholder="Phone Number"
//                               value={phoneNumber}
//                               onChange={(e) => setPhoneNumber(e.target.value)}
//                             />
//                             <Text>email:</Text>
//                             <Input
//                               type="tel"
//                               placeholder="Email"
//                               value={email}
//                               onChange={(e) => setEmail(e.target.value)}
//                             />
//                             {/* <Button
//                     colorScheme="blue"
//                     onClick={handleNextStep}
//                   >
//                     Next Step
//                   </Button> */}
//                           </VStack>
//                         </TabPanel>
//                         <TabPanel>
//                           <VStack spacing={4} align="stretch">
//                             <Text>Address Line 1:</Text>
//                             <Input
//                               type="text"
//                               placeholder="Enter Address"
//                               value={address}
//                               onChange={(e) => setAddress(e.target.value)}
//                             />
//                             <Text>City:</Text>
//                             <Input
//                               type="text"
//                               placeholder="Enter City"
//                               value={city}
//                               onChange={(e) => setCity(e.target.value)}
//                             />
//                             <Text>Pincode:</Text>
//                             <Input
//                               type="text"
//                               placeholder="Enter Pincode"
//                               value={pincode}
//                               onChange={(e) => setPincode(e.target.value)}
//                             />
//                           </VStack>
//                         </TabPanel>
//                       </TabPanels>
//                     </Tabs>
//                   </ModalBody>
//                   <ModalFooter>
//                     {currentStep === 0 ? (
//                       <Button
//                         bg="black"
//                         _hover={{}}
//                         color="white"
//                         onClick={handleNextStep}
//                         isDisabled={!name || !phoneNumber || !email}
//                       >
//                         Next Step
//                       </Button>
//                     ) : (
//                       <Button
//                         bg="black"
//                         _hover={{}}
//                         color="white"
//                         onClick={handleDone}
//                         isDisabled={!address || !city || !pincode}
//                       >
//                         Done
//                       </Button>
//                     )}
//                   </ModalFooter>
//                 </ModalContent>
//               </Modal>
//             </Box>
//           </DrawerBody>
//         </DrawerContent>
//       </DrawerOverlay>
//     </Drawer>
//   );
// };

// export default ShoppingCartDrawer;
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
              "http://localhost:5000/api/order/verify",
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
                      src={`http://localhost:5000/uploads${item.product.images[0]}`}
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
