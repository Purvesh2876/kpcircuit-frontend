import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Text,
  Stack,
  Button,
  Flex,
  Input,
  Select,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  useToast,
  InputGroup,
  InputLeftElement,
  Skeleton
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Link, useParams } from "react-router-dom";
import { getAllProducts, addToWishlistt } from "../actions/api";

const SubCategoryProducts = () => {
  const { subCategoryId } = useParams();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Mobile Filter Drawer

  // --- State ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // --- Debounce Search ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // --- Fetch Products ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        subCategory: subCategoryId,
        search: debouncedSearch,
        sort: sortOption,
        // Removed Price params
      };

      const response = await getAllProducts(params);
      setProducts(response.products || []);

    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger Fetch
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subCategoryId, debouncedSearch, sortOption]);

  const addToWishlist = async (productId) => {
    try {
      const response = await addToWishlistt(productId);
      toast({
        title: response.data.message || "Added to wishlist",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({ title: "Error adding to wishlist", status: "error" });
    }
  };

  // --- Filter Sidebar Content (Only Sorting now) ---
  const FilterContent = () => (
    <Stack spacing={6}>
      <Box>
        <Text fontWeight="bold" mb={2}>Sort By</Text>
        <Select
          placeholder="Select option"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          bg="white"
          borderColor="gray.300"
          _hover={{ borderColor: "gray.400" }}
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </Select>
      </Box>
      
      {/* You can add more filters here later (e.g., Brand, Color) */}
    </Stack>
  );

  return (
    <Box p={{ base: 4, md: 8 }} maxW="1400px" mx="auto">

      {/* 1. HEADER SECTION (Heading Left - Search Right) */}
      <Flex 
        justify="space-between" 
        align="center" 
        mb={8} 
        direction={{ base: "column", md: "row" }} 
        gap={4}
      >
        <Flex align="center" w="100%" justify={{ base: "space-between", md: "flex-start" }}>
          <Heading fontFamily="'Quicksand', sans-serif" size="lg">
            Products
          </Heading>
          
          {/* Mobile Filter Trigger */}
          <Button 
            display={{ base: "flex", md: "none" }} 
            onClick={onOpen} 
            size="sm" 
            variant="outline"
          >
            Sort / Filter
          </Button>
        </Flex>

        {/* Search Bar */}
        <Box w={{ base: "100%", md: "300px" }}>
          <InputGroup>
            <InputLeftElement pointerEvents='none'>
              <SearchIcon color='gray.400' />
            </InputLeftElement>
            <Input
              placeholder="Search products..."
              borderRadius="full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg="gray.50"
              borderColor="gray.200"
              _focus={{ borderColor: "black", boxShadow: "none" }}
            />
          </InputGroup>
        </Box>
      </Flex>

      <Flex gap={8} align="start">
        {/* 2. DESKTOP SIDEBAR (Hidden on Mobile) */}
        <Box
          display={{ base: "none", md: "block" }}
          w="250px"
          minW="250px"
          p={5}
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
          position="sticky"
          top="20px"
        >
          <Heading size="md" mb={4}>Filters</Heading>
          <FilterContent />
        </Box>

        {/* 3. PRODUCT GRID */}
        <Box flex="1">
          <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
            {loading ? (
              // Skeleton Loading
              [1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} height="350px" borderRadius="25px" />)
            ) : (
              products.map((product) => (
                <Card
                  key={product._id}
                  shadow="none"
                  borderRadius="25px"
                  border="1px solid"
                  borderColor="gray.100"
                >
                  <CardBody p={0} borderRadius="25px" _hover={{ shadow: "md" }} transition="0.2s">
                    <Link to={`/productdetails/${product._id}`}>
                      <Box p={4} pb={0} h="220px" overflow="hidden">
                        <Image
                          src={`http://localhost:5000/uploads${product.images[0]}`}
                          h="100%"
                          w="100%"
                          objectFit="contain"
                          alt={product.name}
                        />
                      </Box>
                    </Link>
                    <Stack spacing={2} p={4} align="center">
                      <Text fontWeight="600" textAlign="center" noOfLines={1}>
                        {product.name}
                      </Text>
                      
                      {product.manufacturer && (
                        <Text fontSize="xs" color="gray.500">{product.manufacturer}</Text>
                      )}

                      <Text fontSize="lg" fontWeight="700">₹ {product.price}</Text>

                      <Button
                        w="full"
                        borderRadius="full"
                        size="sm"
                        colorScheme="blackAlpha"
                        bg="black"
                        color="white"
                        onClick={() => addToWishlist(product._id)}
                      >
                        Add to Wishlist
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              ))
            )}
          </SimpleGrid>

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <Flex justify="center" align="center" h="200px" direction="column">
              <Text fontSize="xl" color="gray.500">No products found</Text>
              <Button mt={4} variant="link" onClick={() => {
                setSearchQuery("");
                setSortOption("");
              }}>
                Clear Search
              </Button>
            </Flex>
          )}
        </Box>
      </Flex>

      {/* 4. MOBILE DRAWER */}
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent borderTopRadius="20px">
          <DrawerCloseButton />
          <DrawerHeader>Filter & Sort</DrawerHeader>
          <DrawerBody pb={10}>
            <FilterContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

    </Box>
  );
};

export default SubCategoryProducts;