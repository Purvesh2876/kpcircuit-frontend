import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Image,
  Text,
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
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  VStack,
  IconButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Switch,
  Divider,
} from "@chakra-ui/react";

import { SearchIcon } from "@chakra-ui/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getAllProducts,
  getAllCategories,
  getSubCategoriesByCategory,
  addToWishlistt,
  addToCartt,
} from "../actions/api";
import { useCustomToast } from "../hooks/useCustomToast";

import { FaHeart, FaShoppingCart } from "react-icons/fa";

const MAX_PRICE_DEFAULT = 10000;

const AllProducts = () => {
  const toast = useCustomToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [filters, setFilters] = useState({
    category: "",
    subCategory: "",
    search: "",
    sort: "newest",
    minPrice: 0,
    maxPrice: MAX_PRICE_DEFAULT,
    featured: false,
    page: 1, // Add default page
  });

  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Handle filters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    const featuredParam = params.get("featured");

    setFilters((prev) => ({
      ...prev,
      search: searchParam || prev.search,
      featured: featuredParam === "true" ? true : prev.featured,
    }));
  }, [location.search]);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      const res = await getAllCategories();
      setCategories(res);
    };
    loadCategories();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const res = await getAllProducts({
        category: filters.category,
        subCategory: filters.subCategory,
        search: debouncedSearch,
        sort: filters.sort,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        featured: filters.featured,
        page: filters.page, // Pass current page
        limit: 12, // Standard 3 rows of 4
      });

      console.log("Products response:", res);

      setProducts(res.products || []);
      setTotalPages(res.totalPages || 1);
      setTotalProducts(res.totalProducts || 0);
      setLoading(false);
    };

    fetchProducts();
  }, [
    debouncedSearch,
    filters.category,
    filters.subCategory,
    filters.sort,
    filters.minPrice,
    filters.maxPrice,
    filters.featured,
    filters.page, // Refetch on page change
  ]);

  // 🔥 IMPORTANT: RESET PAGE TO 1 ON FILTER CHANGE
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handleCategoryClick = async (catId) => {
    handleFilterChange({ category: catId, subCategory: "" });

    if (catId) {
      const subs = await getSubCategoriesByCategory(catId);
      setSubCategories(subs);
    } else {
      setSubCategories([]);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setFilters(prev => ({ ...prev, page: newPage }));
    scrollToTop();
  };

  const increaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const decreaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };

  const addToWishlist = async (id) => {
    await addToWishlistt(id);
    window.dispatchEvent(new Event("wishlistUpdated"));
    toast({ title: "Added to wishlist", status: "success" });
  };

  const handleAddToCart = async (id, qty) => {
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
    const res = await addToCartt(id, qty);
    window.dispatchEvent(new Event("cartUpdated"));
    if (res.status === 200) {
      toast({ title: "Added to cart", status: "success" });
    }
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      subCategory: "",
      search: "",
      sort: "newest",
      minPrice: 0,
      maxPrice: MAX_PRICE_DEFAULT,
      featured: false,
    });
    setSubCategories([]);
  };

  const FilterContent = () => (
    <VStack align="stretch" spacing={0}>
      <InputGroup mb={8}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search products..."
          borderRadius="full"
          bg="gray.50"
          value={filters.search}
          onChange={(e) => handleFilterChange({ search: e.target.value })}
        />
      </InputGroup>

      <Text fontSize="xs" fontWeight="700" letterSpacing="1px" color="gray.500" mb={4}>CATEGORY</Text>
      <Stack spacing={3} mb={8}>
        <Text cursor="pointer" fontWeight={!filters.category ? "600" : "400"} onClick={() => handleCategoryClick("")}>All Categories</Text>
        {categories.map((cat) => (
          <Text
            key={cat._id}
            cursor="pointer"
            fontWeight={filters.category === cat._id ? "600" : "400"}
            pl={filters.category === cat._id ? "12px" : "0"}
            borderLeft={filters.category === cat._id ? "3px solid #004d3d" : "3px solid transparent"}
            transition="all 0.2s ease"
            onClick={() => handleCategoryClick(cat._id)}
          >
            {cat.name}
          </Text>
        ))}
      </Stack>

      <Divider mb={6} />

      <Text fontSize="xs" fontWeight="700" mb={3} color="gray.500">SUBCATEGORY</Text>
      <Select
        borderRadius="12px"
        bg="gray.50"
        mb={8}
        value={filters.subCategory}
        onChange={(e) => handleFilterChange({ subCategory: e.target.value })}
        isDisabled={!filters.category}
      >
        <option value="">All SubCategories</option>
        {subCategories.map((sub) => (
          <option key={sub._id} value={sub._id}>{sub.name}</option>
        ))}
      </Select>

      <Text fontSize="xs" fontWeight="700" mb={4} color="gray.500">PRICE RANGE</Text>
      <RangeSlider
        min={0}
        max={MAX_PRICE_DEFAULT}
        step={100}
        value={[filters.minPrice, filters.maxPrice]}
        onChange={(val) => handleFilterChange({ minPrice: val[0], maxPrice: val[1] })}
      >
        <RangeSliderTrack>
          <RangeSliderFilledTrack bg="brand.500" />
        </RangeSliderTrack>
        <RangeSliderThumb index={0} />
        <RangeSliderThumb index={1} />
      </RangeSlider>
      <Flex justify="space-between" mt={2} mb={8}>
        <Text fontSize="sm">₹ {filters.minPrice}</Text>
        <Text fontSize="sm">₹ {filters.maxPrice}</Text>
      </Flex>

      <Flex align="center" justify="space-between" mb={8}>
        <Text fontSize="xs" fontWeight="700" color="gray.500">FEATURED</Text>
        <Switch isChecked={filters.featured} onChange={() => handleFilterChange({ featured: !filters.featured })} />
      </Flex>

      <Button w="100%" borderRadius="full" variant="outline" onClick={resetFilters}>
        Reset Filters
      </Button>
    </VStack>
  );

  return (
    <Box px={{ base: 4, md: 12 }} py={10} maxW="1500px" mx="auto">

      {/* Breadcrumb */}
      <Breadcrumb mb={6} fontSize="sm" color="gray.500">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Products</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Top Curved Section */}
      <Box
        bg="#f7f7f7"
        borderRadius="30px"
        px={{ base: 6, md: 12 }}
        py={8}
        mb={12}
      >
        <Flex
          justify="space-between"
          align="center"
          flexWrap="wrap"
          gap={4}
        >
          <Heading size="lg" fontWeight="600">
            All Products
          </Heading>

          <Flex align="center" gap={4}>
            <Select
              borderRadius="full"
              bg="white"
              maxW="200px"
              value={filters.sort}
              onChange={(e) =>
                handleFilterChange({ sort: e.target.value })
              }
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price ↑</option>
              <option value="price_desc">Price ↓</option>
            </Select>

            <Button
              display={{ base: "block", md: "none" }}
              onClick={onOpen}
              borderRadius="full"
            >
              Filters
            </Button>
          </Flex>
        </Flex>
      </Box>

      <Flex gap={12} align="flex-start">

        {/* Sidebar Desktop */}
        <Box
          display={{ base: "none", md: "block" }}
          w="320px"
          flexShrink={0}
          bg="white"
          p={8}
          borderRadius="30px"
          border="1px solid #f0f0f0"
          boxShadow="0 20px 60px rgba(0,0,0,0.03)"
          position="sticky"
          top="20px"
        >
          <FilterContent />
        </Box>

        {/* Products */}
        <Box flex="1">
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={10}>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} height="400px" borderRadius="25px" />
              ))
              : products.map((product) => (
                <Box
                  key={product._id}
                  bg="white"
                  borderRadius="25px"
                  border="1px solid #f1f1f1"
                  overflow="hidden"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "translateY(-8px)",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.08)",
                  }}
                >
                  <Box position="relative" role="group">
                    <Link to={`/productdetails/${product._id}`}>
                      <Box bg="gray.50" p={6} h="240px">
                        <Image
                          src={`/uploads${product.images[0]}`}
                          h="100%"
                          w="100%"
                          objectFit="contain"
                          transition="0.4s"
                          _groupHover={{ transform: "scale(1.05)" }}
                        />
                      </Box>
                    </Link>

                    <IconButton
                      icon={<FaHeart />}
                      position="absolute"
                      top="16px"
                      right="16px"
                      borderRadius="full"
                      bg="white"
                      size="sm"
                      boxShadow="md"
                      opacity={0}
                      _groupHover={{ opacity: 1 }}
                      onClick={() => addToWishlist(product._id)}
                    />
                  </Box>

                  <Box p={6}>
                    <Text fontWeight="600" textAlign="center" mb={2}>
                      {product.name}
                    </Text>

                    <Text
                      fontWeight="700"
                      textAlign="center"
                      mb={4}
                    >
                      ₹ {product.price}
                    </Text>

                    <Flex gap={3}>
                      <Flex
                        border="1px solid #E2E8F0"
                        borderRadius="12px"
                        align="center"
                        justify="space-between"
                        px={3}
                        flex="1"
                        bg="gray.50"
                      >
                        <Text onClick={() => decreaseQty(product._id)}>−</Text>
                        <Text>{quantities[product._id] || 1}</Text>
                        <Text onClick={() => increaseQty(product._id)}>+</Text>
                      </Flex>

                      <Button
                        bg="brand.500"
                        color="white"
                        flex="2"
                        borderRadius="12px"
                        _hover={{ bg: "brand.800" }}
                        leftIcon={<FaShoppingCart />}
                        onClick={() =>
                          handleAddToCart(
                            product._id,
                            quantities[product._id] || 1
                          )
                        }
                      >
                        Add
                      </Button>
                    </Flex>
                  </Box>
                </Box>
              ))}
          </SimpleGrid>

          {/* ================= PAGINATION (AS PER USER IMAGE) ================= */}
          {!loading && products.length > 0 && (
            <Flex
              mt={16}
              py={4}
              justify="center"
              align="center"
              gap={{ base: 4, md: 8 }}
              flexWrap="wrap"
            >
              {/* << Page 1 (Jump to start) */}
              <Text
                fontSize="sm"
                fontWeight="700"
                color={filters.page === 1 ? "gray.300" : "gray.600"}
                cursor={filters.page === 1 ? "not-allowed" : "pointer"}
                onClick={() => handlePageChange(1)}
                display="flex"
                alignItems="center"
                _hover={filters.page !== 1 ? { color: "brand.500" } : {}}
              >
                «« Page 1
              </Text>

              {/* < Previous Button */}
              <Button
                leftIcon={<Text fontSize="lg" mt="-2px">‹</Text>}
                variant="outline"
                borderRadius="10px"
                px={6}
                borderColor="gray.200"
                color="gray.600"
                fontWeight="600"
                isDisabled={filters.page === 1}
                onClick={() => handlePageChange(filters.page - 1)}
                _hover={{ bg: "gray.50" }}
              >
                Previous
              </Button>

              {/* Page X of Y Text */}
              <Text fontSize="sm" color="gray.500" fontWeight="500">
                Page {filters.page} of {totalPages}
              </Text>

              {/* Next > Button */}
              <Button
                rightIcon={<Text fontSize="lg" mt="-2px">›</Text>}
                variant="outline"
                borderRadius="10px"
                px={6}
                borderColor="gray.200"
                color="brand.500"
                fontWeight="700"
                isDisabled={filters.page === totalPages}
                onClick={() => handlePageChange(filters.page + 1)}
                _hover={{ bg: "gray.50" }}
              >
                Next
              </Button>
            </Flex>
          )}
        </Box>
      </Flex>

      {/* Mobile Filter Drawer */}
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent borderTopRadius="30px" maxH="85vh">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Filters</DrawerHeader>
          <DrawerBody pb={10} overflowY="auto">
            <FilterContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default AllProducts;