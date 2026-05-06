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
  VStack,
  Icon,
  HStack,
  Badge,
  Divider,
  SimpleGrid,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { MdCheckCircle, MdCancel, MdAssignmentReturn, MdAutorenew } from "react-icons/md";

import { useParams, useNavigate } from "react-router-dom";
import { addToCartt, addToWishlistt, getSimilarProducts } from "../../actions/api";
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
  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);
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
        setCurrentPrice(productData.price);

        // Fetch similar products (non-blocking)
        setSimilarLoading(true);
        getSimilarProducts(productId)
          .then((data) => {
            setSimilarProducts(data?.products || []);
          })
          .catch(() => setSimilarProducts([]))
          .finally(() => setSimilarLoading(false));

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
      window.dispatchEvent(new Event("cartUpdated"));
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

  const SimilarProductCard = ({ p }) => (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      cursor="pointer"
      onClick={() => navigate(`/productdetails/${p._id}`)}
      transition="all 0.2s ease"
      _hover={{ shadow: "md", transform: "translateY(-3px)" }}
      minW={{ base: "160px", md: "auto" }}
      flexShrink={0}
    >
      <Box h="160px" overflow="hidden" bg="gray.50">
        <Image
          src={p.images?.[0] ? `/uploads${p.images[0]}` : ""}
          alt={p.name}
          h="160px"
          w="full"
          objectFit="cover"
          fallback={<Box h="160px" bg="gray.100" />}
        />
      </Box>
      <Box p={3}>
        <Text fontSize="sm" fontWeight="medium" color="gray.800" noOfLines={2} lineHeight="1.4">
          {p.name}
        </Text>
        <Text fontSize="sm" fontWeight="bold" color="brand.500" mt={1}>
          ₹{p.price}
        </Text>
      </Box>
    </Box>
  );

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

          {/* Return & Replacement Policy */}
          <Box
            borderWidth="1px"
            borderRadius="lg"
            borderColor="gray.200"
            overflow="hidden"
          >
            <Box bg="gray.50" px={4} py={3} borderBottomWidth="1px" borderColor="gray.200">
              <Text fontWeight="semibold" fontSize="sm" color="gray.700" letterSpacing="wide">
                Return &amp; Replacement Policy
              </Text>
            </Box>

            <Box px={4} py={3}>
              {!product?.isReturnable && !product?.isReplaceable ? (
                <HStack spacing={3} align="start">
                  <Icon as={MdCancel} color="red.400" boxSize={5} mt="1px" flexShrink={0} />
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="red.600">
                      Not eligible for return or replacement
                    </Text>
                    <Text fontSize="xs" color="gray.500" mt={0.5}>
                      This product cannot be returned or replaced once delivered.
                    </Text>
                  </Box>
                </HStack>
              ) : (
                <VStack align="stretch" spacing={3}>
                  {product?.isReturnable && (
                    <HStack spacing={3} align="start">
                      <Icon as={MdAssignmentReturn} color="green.500" boxSize={5} mt="1px" flexShrink={0} />
                      <Box>
                        <HStack spacing={2} align="center">
                          <Text fontSize="sm" fontWeight="medium" color="gray.800">
                            Returns accepted
                          </Text>
                          {(product?.returnWindowDays ?? 0) > 0 && (
                            <Badge colorScheme="green" fontSize="xs" borderRadius="full">
                              {product.returnWindowDays} days
                            </Badge>
                          )}
                        </HStack>
                        <Text fontSize="xs" color="gray.500" mt={0.5}>
                          {(product?.returnWindowDays ?? 0) > 0
                            ? `You can request a return within ${product.returnWindowDays} days of delivery.`
                            : "Contact us to initiate a return."}
                        </Text>
                      </Box>
                    </HStack>
                  )}

                  {product?.isReturnable && product?.isReplaceable && (
                    <Divider borderColor="gray.100" />
                  )}

                  {product?.isReplaceable && (
                    <HStack spacing={3} align="start">
                      <Icon as={MdAutorenew} color="blue.500" boxSize={5} mt="1px" flexShrink={0} />
                      <Box>
                        <HStack spacing={2} align="center">
                          <Text fontSize="sm" fontWeight="medium" color="gray.800">
                            Replacement available
                          </Text>
                          {(product?.returnWindowDays ?? 0) > 0 && (
                            <Badge colorScheme="blue" fontSize="xs" borderRadius="full">
                              {product.returnWindowDays} days
                            </Badge>
                          )}
                        </HStack>
                        <Text fontSize="xs" color="gray.500" mt={0.5}>
                          {(product?.returnWindowDays ?? 0) > 0
                            ? `Request a replacement within ${product.returnWindowDays} days of delivery.`
                            : "Contact us to request a replacement."}
                        </Text>
                      </Box>
                    </HStack>
                  )}
                </VStack>
              )}
            </Box>
          </Box>
        </Box>
      </Flex>

      {/* Similar Products */}
      {(similarLoading || similarProducts.length > 0) && (
        <Box maxW="1400px" mx="auto" px="20px" pb="40px">
          <Divider mb={6} />
          <Heading size="md" color="gray.800" mb={5}>
            Similar Products
          </Heading>

          {similarLoading ? (
            <>
              {/* Mobile skeleton */}
              <Box display={{ base: "flex", md: "none" }} gap={4} overflowX="auto" pb={2}>
                {[...Array(3)].map((_, i) => (
                  <Box key={i} minW="160px" borderRadius="lg" overflow="hidden" borderWidth="1px">
                    <Skeleton h="160px" />
                    <Box p={3}>
                      <SkeletonText noOfLines={2} spacing={2} />
                      <Skeleton h="16px" mt={2} w="60%" />
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Desktop skeleton */}
              <SimpleGrid display={{ base: "none", md: "grid" }} columns={4} spacing={4}>
                {[...Array(4)].map((_, i) => (
                  <Box key={i} borderRadius="lg" overflow="hidden" borderWidth="1px">
                    <Skeleton h="160px" />
                    <Box p={3}>
                      <SkeletonText noOfLines={2} spacing={2} />
                      <Skeleton h="16px" mt={2} w="60%" />
                    </Box>
                  </Box>
                ))}
              </SimpleGrid>
            </>
          ) : (
            <>
              {/* Mobile: horizontal scroll */}
              <Box
                display={{ base: "flex", md: "none" }}
                overflowX="auto"
                gap={4}
                pb={2}
                sx={{ "&::-webkit-scrollbar": { display: "none" } }}
              >
                {similarProducts.map((p) => (
                  <SimilarProductCard key={p._id} p={p} />
                ))}
              </Box>

              {/* Desktop: 4-column grid */}
              <SimpleGrid
                display={{ base: "none", md: "grid" }}
                columns={4}
                spacing={4}
              >
                {similarProducts.map((p) => (
                  <SimilarProductCard key={p._id} p={p} />
                ))}
              </SimpleGrid>
            </>
          )}
        </Box>
      )}
    </>
  );
};

export default ProductDetails;
