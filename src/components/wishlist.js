import React, { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack, Heading, Box, Link, useColorModeValue as mode, Flex,
  Input, Image,
  Select,
  Button,
  Text,
  Divider,
  List,
  ListItem,
  ListIcon,
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
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { MdCheckCircle, MdLocationCity } from 'react-icons/md';
import { getWishlist, removeFromWishlist } from '../actions/api';
import { DeleteIcon } from '@chakra-ui/icons';

const WishlistDrawer = ({
  isWishlistOpen,
  setWishlistOpen,

}) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [activeTab, setActiveTab] = useState(0); // 0 for phone number, 1 for address
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const toast = useToast();

  const handleRemoveFromCart = async (itemId) => {
    console.log('itemif', itemId);
    try {
      const response = await removeFromWishlist(itemId);
      console.log('Response from removeFromCart:', response);
      getCartData();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const getCartData = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
      const response = await getWishlist();
      setWishlistItems(response.items);
      console.log(response, 'getWishiiee');
    } catch (error) {
      console.error('Error fetching cart data:', error);
      toast({
        title: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  useEffect(() => {
    if (isWishlistOpen) {
      getCartData();
    }
  }, [isWishlistOpen]);


  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleCheckout = () => {
    // Add logic for handling the checkout process
    // You can show the order confirmation modal here
    setOrderModalOpen(true);
  };
  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };
  const handlePincodeChange = (e) => {
    setPincode(e.target.value);
  };

  const handleDone = () => {
    if (phoneNumber && name && email && address && city && pincode) {
      const data = {
        "name": name,
        "email": email,
        "phone": phoneNumber,
        "address": address,
        "city": city,
        "pincode": pincode,
      }

      const token = localStorage.getItem('token');

      // Set the Authorization header with the token
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios.post('http://localhost:4000/orders/checkout', data, { headers }).then(res => console.log(res)).catch(error => {
        console.error(error);
      });
    }

    // axios.post('localhost:4000/orders/checkout')



    // Close the modal after confirming the order
    setOrderModalOpen(false);
    setCurrentStep(0)
  };

  return (
    <Drawer
      placement="right"
      onClose={() => setWishlistOpen(false)}
      isOpen={isWishlistOpen}
      size="md"
    >
      <DrawerOverlay />
      <DrawerContent maxW="420px">
        <DrawerCloseButton />

        {/* Header */}
        <DrawerHeader borderBottom="1px solid" borderColor="gray.200">
          <Heading fontSize="xl" fontWeight="bold">
            My Wishlist ({wishlistItems.length})
          </Heading>
        </DrawerHeader>

        {/* Body */}
        <DrawerBody p={0}>
          {wishlistItems && wishlistItems.length > 0 ? (
            <VStack
              spacing={0}
              align="stretch"
              maxH="calc(100vh - 100px)"
              overflowY="auto"
            >
              {wishlistItems.map((item, index) => (
                <Flex
                  key={index}
                  p={4}
                  gap={4}
                  align="center"
                  borderBottom="1px solid"
                  borderColor="gray.100"
                  _hover={{ bg: "gray.50" }}
                  transition="0.2s"
                >
                  {/* Product Image */}
                  <Image
                    src={`http://localhost:5000/uploads${item.product.images[0]}`}
                    alt={item.product.name}
                    boxSize="90px"
                    objectFit="cover"
                    borderRadius="md"
                  />

                  {/* Product Info */}
                  <Box flex="1">
                    <Text fontWeight="600" fontSize="sm">
                      {item.product.name}
                    </Text>

                    {item.product.price && (
                      <Text color="gray.600" fontSize="sm" mt={1}>
                        ₹ {item.product.price}
                      </Text>
                    )}
                  </Box>

                  {/* Remove Button */}
                  <DeleteIcon
                    cursor="pointer"
                    color="gray.500"
                    _hover={{ color: "red.500" }}
                    onClick={() =>
                      handleRemoveFromCart(item.product._id)
                    }
                  />
                </Flex>
              ))}
            </VStack>
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              h="70vh"
              p={6}
              textAlign="center"
            >
              <Text fontSize="lg" fontWeight="600" mb={2}>
                Your Wishlist is Empty
              </Text>
              <Text fontSize="sm" color="gray.500">
                Add items you love to your wishlist.
              </Text>
            </Flex>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>

  );
};

export default WishlistDrawer;
