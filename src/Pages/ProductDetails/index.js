import React, { useEffect, useState } from "react";
import {
  Flex,
  Box,
  Image,
  Heading,
  Text,
  Input,
  Select,
  Button,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";

import { useParams, useNavigate } from "react-router-dom";
import { addToCartt, addToWishlistt } from "../../actions/api";
import { useCustomToast } from "../../hooks/useCustomToast";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentPrice, setCurrentPrice] = useState(0);  // New state for price
  const [imagee, setImagee] = useState("");
  const [zoomedImage, setZoomedImage] = useState("");
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(false);
  const toast = useCustomToast();
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  const { isOpenn, onTogglee, onClosee } = useDisclosure();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/products/${productId}`
        );
        console.log('response123', response)
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const productData = await response.json();
        setProduct(productData);
        setImagee(`/uploads${productData.images[0]}`); // http://76.13.247.39:5000

        // Set initial price to the first variant's price
        setCurrentPrice(productData.price);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  const addToCart = async () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      toast({
        title: "Login required",
        description: "Please login to add items to your cart.",
        status: "warning",
        action: { label: "Login now", onClick: () => navigate('/login') },
      });
      return;
    }
    try {
      const response = await addToCartt(productId, quantity, selectedColor);

      if (!response.status === 200) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      toast({ title: "Item added to cart", status: "success", duration: 3000 });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast({ title: "Error adding item to cart", status: "error", duration: 3000 });
    }
  };

  const addToWishlist = async () => {
    const response = await addToWishlistt(productId);
    console.log(response);
    setIsAddedToWishlist(true);
    toast({ title: response.data.message, status: "success", duration: 3000 });
  };

  const handleColorChange = (e) => {
    const selectedColor = e.target.value;
    setSelectedColor(selectedColor);

    // Find the variant that matches the selected color
    const variant = product.variants.find((variant) => variant.color === selectedColor);

    if (variant) {
      setCurrentPrice(variant.price); // Update the price when a color is selected
    }
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Flex
        direction={["column", "column", "row"]}
        maxW="1400px"
        mx="auto"
        p="20px"
        mt="20px"
      >
        <Stack display={'flex'}>
          <Box
            boxSize={{ base: "100%", md: "300px", lg: "500px" }}
            maxW={{ base: "100%", md: "300px", lg: "500px" }}
            mb="4"
            onMouseMove={(e) => {
              const target = e.target;
              const boundingBox = target.getBoundingClientRect();
              const mouseX = e.clientX - boundingBox.left;
              const mouseY = e.clientY - boundingBox.top;
              const percentX = (mouseX / boundingBox.width) * 100;
              const percentY = (mouseY / boundingBox.height) * 100;
              target.style.transformOrigin = `${percentX}% ${percentY}%`;
            }}
            overflow='hidden'
          >
            <Image
              src={imagee}
              objectFit="contain"
              h="100%"
              w="100%"
              onClick={() => { }}
              transition="transform 0.2s ease-in-out"
              _hover={{ transform: 'scale(1.3)' }}
              overflow='hidden'
            />
          </Box>

          <Box display='flex' flex={["none", 1]} mb={["20px", 0]}>
            {product.images.map((imagePath, index) => (
              <Box key={index} h="auto" w="100%" overflow="hidden" onClick={() => setImagee(`/uploads${imagePath}`)}> {/*// http://76.13.247.39:5000*/}
                <Image
                  src={`/uploads${imagePath}`} // http://76.13.247.39:5000
                  alt={`Product Image ${index + 1}`}
                  borderRadius="2px"
                  objectFit="contain"
                  h="100px"
                  w="100%"
                />
              </Box>
            ))}
          </Box>
        </Stack>

        <Box ml={["0", "30px"]} textAlign="left" flex="1">
          <Heading color="gray.800" mb="4">
            {product.name}
          </Heading>
          <Text color="brand.500" fontSize="xl" fontWeight="bold" mb="1">
            Rs. {currentPrice} {/* Display the current price */}
          </Text>
          <Text color="black.600" fontSize="sm" fontWeight="light" mb="4">
            (incl. of all taxes)
          </Text>

          <Box display="flex" alignItems="center" mb="4" w={"100%"}>
            {/* <Text color="gray.600" mb="4">
              Color:
              <Select
                value={selectedColor}
                onChange={handleColorChange}
                placeholder="Select Color"
                size="md"
              // mt="2"
              >
                {product.variants.map((variant, index) => (
                  <option key={index} value={variant.color}>
                    {variant.color}
                  </option>
                ))}
              </Select>
            </Text> */}

            <Text color="gray.600" mb="4">
              Quantity:
              <Select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
              </Select>
              {/* <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              /> */}
            </Text>
          </Box>


          <Button
            bg="brand.500"
            color="white"
            colorScheme="brand"
            variant="solid"
            size="md"
            borderRadius="1px"
            cursor="pointer"
            onClick={addToCart}
            mb="4"
            w="full"
          // isDisabled={!selectedColor}
          >
            {/* {!selectedColor ? "Select Size and Color" : "Add to Cart"} */}
            Add to Cart
          </Button>

          <Button
            colorScheme="brand"
            variant="outline"
            size="md"
            borderRadius="1px"
            cursor="pointer"
            onClick={addToWishlist}
            mb="4"
            isDisabled={isAddedToWishlist}
            w="full"
          >
            {isAddedToWishlist ? "Added to Wishlist" : "Add to Wishlist"}
          </Button>
        </Box>
      </Flex>
    </>
  );
};

export default ProductDetails;
