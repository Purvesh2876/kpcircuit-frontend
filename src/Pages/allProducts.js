// // pages/AllProducts.jsx (Updated)
// import React, { useEffect, useState } from "react";
// import {
//   Box, Heading, SimpleGrid, Card, CardBody, Image, Text, Stack, Button, Flex,
//   Input, Select, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton,
//   DrawerHeader, DrawerBody, useDisclosure, useToast, InputGroup, InputLeftElement,
//   Skeleton, FormControl, FormLabel,
//   IconButton
// } from "@chakra-ui/react";
// import { SearchIcon } from "@chakra-ui/icons";
// import { Link, useLocation } from "react-router-dom"; // Added useLocation
// import {
//   getAllProducts, getAllCategories, getSubCategoriesByCategory, addToWishlistt,
//   addToCartt
// } from "../actions/api";
// import { FaHeart, FaShoppingCart } from "react-icons/fa";

// const AllProducts = () => {
//   const toast = useToast();
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [quantities, setQuantities] = useState({});

//   const location = useLocation();

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const searchParam = params.get("search");

//     if (searchParam) {
//       setFilters((prev) => ({
//         ...prev,
//         search: searchParam,
//       }));
//     }
//   }, [location.search]);

//   const increaseQty = (id) => {
//     setQuantities((prev) => ({
//       ...prev,
//       [id]: (prev[id] || 1) + 1,
//     }));
//   };

//   const decreaseQty = (id) => {
//     setQuantities((prev) => ({
//       ...prev,
//       [id]: prev[id] > 1 ? prev[id] - 1 : 1,
//     }));
//   };


//   // Filter State
//   const [filters, setFilters] = useState({
//     category: "",
//     subCategory: "",
//     search: "",
//     sort: "",
//   });

//   const [debouncedSearch, setDebouncedSearch] = useState("");

//   // --- 2. HANDLE INCOMING REDIRECT STATE ---
//   useEffect(() => {
//     // If we have state from the SubCategoryList page
//     if (location.state?.preSelectedCategory) {
//       const { preSelectedCategory, preSelectedSubCategory } = location.state;

//       // A. Update Filters immediately
//       setFilters((prev) => ({
//         ...prev,
//         category: preSelectedCategory,
//         subCategory: preSelectedSubCategory || ""
//       }));

//       // B. We MUST fetch subcategories manually here so the sidebar dropdown works
//       // and shows the correct subcategory name
//       const loadPreSelectedSubCats = async () => {
//         try {
//           const subs = await getSubCategoriesByCategory(preSelectedCategory);
//           setSubCategories(subs);
//         } catch (e) { console.error(e) }
//       };
//       loadPreSelectedSubCats();
//     }
//   }, [location.state]); // Runs once when page loads if state exists

//   // --- INITIAL DATA FETCH (Categories) ---
//   useEffect(() => {
//     const loadCategories = async () => {
//       try {
//         const res = await getAllCategories();
//         setCategories(res);
//       } catch (err) { console.error("Error loading categories", err); }
//     };
//     loadCategories();
//   }, []);

//   // --- DEBOUNCE SEARCH ---
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(filters.search);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [filters.search]);

//   // --- FETCH PRODUCTS ---
//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const params = {
//         category: filters.category,
//         subCategory: filters.subCategory,
//         search: debouncedSearch,
//         sort: filters.sort,
//         limit: 50,
//       };

//       const res = await getAllProducts(params);
//       setProducts(res.products || []);
//     } catch (err) {
//       console.error("Error fetching products", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [debouncedSearch, filters.category, filters.subCategory, filters.sort]);

//   const handleCategoryChange = async (e) => {
//     const catId = e.target.value;
//     setFilters({ ...filters, category: catId, subCategory: "" });
//     if (catId) {
//       try {
//         const subCats = await getSubCategoriesByCategory(catId);
//         setSubCategories(subCats);
//       } catch (err) { console.error(err); }
//     } else {
//       setSubCategories([]);
//     }
//   };

//   const addToWishlist = async (productId) => {
//     // ... (Keep existing wishlist logic)
//     try {
//       const response = await addToWishlistt(productId);
//       window.dispatchEvent(new Event("wishlistUpdated"));
//       toast({ title: "Added to wishlist", status: "success", duration: 2000 });
//     } catch (e) { toast({ title: "Error", status: "error" }); }
//   };

//   // --- SIDEBAR CONTENT ---
//   const FilterContent = () => (
//     <Stack spacing={6}>
//       <Box>
//         <Text fontWeight="bold" mb={2}>Sort By</Text>
//         <Select
//           placeholder="Select option"
//           value={filters.sort}
//           onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
//           bg="white"
//         >
//           <option value="newest">Newest Arrivals</option>
//           <option value="price_asc">Price: Low to High</option>
//           <option value="price_desc">Price: High to Low</option>
//         </Select>
//       </Box>

//       <Box>
//         <Text fontWeight="bold" mb={2}>Filter By Category</Text>
//         <Stack spacing={3}>
//           <FormControl>
//             <FormLabel fontSize="sm" color="gray.600">Category</FormLabel>
//             <Select
//               placeholder="All Categories"
//               value={filters.category}
//               onChange={handleCategoryChange}
//               bg="white"
//             >
//               {categories.map((cat) => (
//                 <option key={cat._id} value={cat._id}>{cat.name}</option>
//               ))}
//             </Select>
//           </FormControl>

//           <FormControl isDisabled={!filters.category}>
//             <FormLabel fontSize="sm" color="gray.600">SubCategory</FormLabel>
//             <Select
//               placeholder="All SubCategories"
//               value={filters.subCategory}
//               onChange={(e) => setFilters({ ...filters, subCategory: e.target.value })}
//               bg="white"
//             >
//               {subCategories.map((sub) => (
//                 <option key={sub._id} value={sub._id}>{sub.name}</option>
//               ))}
//             </Select>
//           </FormControl>
//         </Stack>
//       </Box>

//       <Button
//         variant="link"
//         colorScheme="red"
//         size="sm"
//         onClick={() => {
//           setFilters({ category: "", subCategory: "", search: "", sort: "" });
//           setSubCategories([]); // Clear subcats on reset
//         }}
//       >
//         Reset All Filters
//       </Button>
//     </Stack>
//   );

//   // add to cart function
//   const handleAddToCart = async (productId, quantity) => {
//     try {
//       const response = await addToCartt(productId, quantity); // quantity default 1
//       window.dispatchEvent(new Event("cartUpdated"));
//       if (response.status === 200) {
//         toast({
//           title: "Item added to cart",
//           status: "success",
//           duration: 2000,
//           isClosable: true,
//         });
//       }
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       toast({
//         title: "Error adding to cart",
//         status: "error",
//         duration: 2000,
//         isClosable: true,
//       });
//     }
//   };

//   return (
//     <Box p={{ base: 4, md: 8 }} maxW="1400px" mx="auto">
//       {/* HEADER */}
//       <Flex justify="space-between" align="center" mb={8} direction={{ base: "column", md: "row" }} gap={4}>
//         <Flex align="center" w="100%" justify={{ base: "space-between", md: "flex-start" }}>
//           <Heading fontFamily="'Quicksand', sans-serif" size="lg">All Products</Heading>
//           <Button display={{ base: "flex", md: "none" }} onClick={onOpen} size="sm" variant="outline">Filters</Button>
//         </Flex>
//         <Box w={{ base: "100%", md: "300px" }}>
//           <InputGroup>
//             <InputLeftElement pointerEvents='none'><SearchIcon color='gray.400' /></InputLeftElement>
//             <Input
//               placeholder="Search products..." borderRadius="full" bg="gray.50"
//               value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })}
//             />
//           </InputGroup>
//         </Box>
//       </Flex>

//       <Flex gap={8} align="start">
//         {/* DESKTOP SIDEBAR */}
//         <Box display={{ base: "none", md: "block" }} w="260px" minW="260px" p={5} border="1px solid" borderColor="gray.200" borderRadius="xl" position="sticky" top="20px">
//           <Heading size="md" mb={6}>Filters</Heading>
//           <FilterContent />
//         </Box>

//         {/* PRODUCTS */}
//         <Box flex="1">
//           <SimpleGrid columns={[1, 2, 2, 3]} spacing={8}>
//             {loading ? (
//               [1, 2, 3, 4, 5, 6].map((i) => (
//                 <Skeleton
//                   key={i}
//                   height="360px"
//                   borderRadius="16px"
//                 />
//               ))
//             ) : (
//               products.map((product) => (
//                 <Box
//                   key={product._id}
//                   bg="white"
//                   borderRadius="16px"
//                   overflow="hidden"
//                   boxShadow="0 4px 20px rgba(0,0,0,0.06)"
//                   _hover={{
//                     boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
//                     transform: "translateY(-6px)",
//                   }}
//                   transition="all 0.3s ease"
//                 >
//                   {/* IMAGE SECTION */}
//                   <Box position="relative" role="group">
//                     <Link to={`/productdetails/${product._id}`}>
//                       <Box
//                         p={4}
//                         h="230px"
//                         bg="gray.50"
//                         overflow="hidden"
//                       >
//                         <Image
//                           src={`/uploads${product.images[0]}`}
//                           h="100%"
//                           w="100%"
//                           objectFit="cover"
//                           alt={product.name}
//                           transition="transform 0.4s ease"
//                           _groupHover={{ transform: "scale(1.08)" }}
//                         />
//                       </Box>
//                     </Link>

//                     {/* Wishlist Hover Icon */}
//                     <IconButton
//                       icon={<FaHeart />}
//                       aria-label="Wishlist"
//                       position="absolute"
//                       top="12px"
//                       right="12px"
//                       borderRadius="full"
//                       bg="white"
//                       size="sm"
//                       boxShadow="sm"
//                       opacity={0}
//                       transform="translateY(-10px)"
//                       _groupHover={{
//                         opacity: 1,
//                         transform: "translateY(0px)",
//                       }}
//                       transition="all 0.3s ease"
//                       _hover={{ bg: "gray.100" }}
//                       onClick={() => addToWishlist(product._id)}
//                     />
//                   </Box>

//                   {/* CONTENT */}
//                   <Box p={5}>
//                     <Text
//                       fontWeight="600"
//                       textAlign="center"
//                       noOfLines={1}
//                       fontSize="md"
//                       mb={1}
//                     >
//                       {product.name}
//                     </Text>

//                     {product.manufacturer && (
//                       <Text
//                         fontSize="xs"
//                         color="gray.500"
//                         textAlign="center"
//                         mb={2}
//                       >
//                         {product.manufacturer}
//                       </Text>
//                     )}

//                     <Text
//                       fontSize="lg"
//                       fontWeight="700"
//                       textAlign="center"
//                       mb={4}
//                       fontFamily="'Quicksand', sans-serif"
//                     >
//                       ₹ {product.price}
//                     </Text>

//                     {/* QUANTITY + ADD SECTION */}
//                     <Flex gap={3}>
//                       {/* Quantity Selector */}
//                       <Flex
//                         border="1px solid #E2E8F0"
//                         borderRadius="8px"
//                         align="center"
//                         justify="space-between"
//                         px={3}
//                         py={1}
//                         flex="1"
//                         bg="gray.50"
//                       >
//                         <Text
//                           cursor="pointer"
//                           fontWeight="bold"
//                           onClick={() => decreaseQty(product._id)}
//                         >
//                           −
//                         </Text>

//                         <Text>
//                           {quantities[product._id] || 1}
//                         </Text>

//                         <Text
//                           cursor="pointer"
//                           fontWeight="bold"
//                           onClick={() => increaseQty(product._id)}
//                         >
//                           +
//                         </Text>
//                       </Flex>

//                       {/* Add To Cart */}
//                       <Button
//                         bg="black"
//                         color="white"
//                         flex="2"
//                         borderRadius="8px"
//                         _hover={{ bg: "gray.800" }}
//                         leftIcon={<FaShoppingCart />}
//                         onClick={() =>
//                           handleAddToCart(
//                             product._id,
//                             quantities[product._id] || 1
//                           )
//                         }
//                       >
//                         ADD
//                       </Button>
//                     </Flex>
//                   </Box>
//                 </Box>
//               ))

//             )}
//           </SimpleGrid>

//           {/* EMPTY STATE */}
//           {!loading && products.length === 0 && (
//             <Flex
//               justify="center"
//               align="center"
//               h="300px"
//               direction="column"
//               bg="gray.50"
//               borderRadius="xl"
//             >
//               <Text fontSize="xl" color="gray.500" mb={2}>
//                 No products found
//               </Text>
//               <Button
//                 mt={4}
//                 variant="link"
//                 colorScheme="blue"
//                 onClick={() =>
//                   setFilters({
//                     category: "",
//                     subCategory: "",
//                     search: "",
//                     sort: "",
//                   })
//                 }
//               >
//                 Clear Filters
//               </Button>
//             </Flex>
//           )}
//         </Box>

//       </Flex>

//       {/* MOBILE DRAWER */}
//       <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
//         <DrawerOverlay />
//         <DrawerContent borderTopRadius="20px">
//           <DrawerCloseButton />
//           <DrawerHeader>Filter & Sort</DrawerHeader>
//           <DrawerBody pb={10}><FilterContent /></DrawerBody>
//         </DrawerContent>
//       </Drawer>
//     </Box>
//   );
// };

// export default AllProducts;

// pages/AllProducts.jsx

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
  useToast,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
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
import { Link, useLocation } from "react-router-dom";
import {
  getAllProducts,
  getAllCategories,
  getSubCategoriesByCategory,
  addToWishlistt,
  addToCartt,
} from "../actions/api";

import { FaHeart, FaShoppingCart } from "react-icons/fa";

const MAX_PRICE_DEFAULT = 10000;

const AllProducts = () => {
  const toast = useToast();
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
  });

  // Search from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      setFilters((prev) => ({ ...prev, search: searchParam }));
    }
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
        limit: 50,
      });

      console.log("Products:", res.products);

      setProducts(res.products || []);
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
  ]);

  const handleCategoryClick = async (catId) => {
    setFilters({ ...filters, category: catId, subCategory: "" });

    if (catId) {
      const subs = await getSubCategoriesByCategory(catId);
      setSubCategories(subs);
    } else {
      setSubCategories([]);
    }
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
                setFilters({ ...filters, sort: e.target.value })
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
          bg="white"
          p={8}
          borderRadius="30px"
          border="1px solid #f0f0f0"
          boxShadow="0 20px 60px rgba(0,0,0,0.03)"
          position="sticky"
          top="20px"
        >

          {/* Search */}
          <InputGroup mb={10}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search products..."
              borderRadius="full"
              bg="gray.50"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </InputGroup>

          {/* Category */}
          <Text
            fontSize="xs"
            fontWeight="700"
            letterSpacing="1px"
            color="gray.500"
            mb={4}
          >
            CATEGORY
          </Text>

          <Stack spacing={3} mb={10}>
            <Text
              cursor="pointer"
              fontWeight={!filters.category ? "600" : "400"}
              onClick={() => handleCategoryClick("")}
            >
              All Categories
            </Text>

            {categories.map((cat) => (
              <Text
                key={cat._id}
                cursor="pointer"
                fontWeight={filters.category === cat._id ? "600" : "400"}
                pl={filters.category === cat._id ? "12px" : "0"}
                borderLeft={
                  filters.category === cat._id
                    ? "3px solid #004d3d"
                    : "3px solid transparent"
                }
                transition="all 0.2s ease"
                onClick={() => handleCategoryClick(cat._id)}
              >
                {cat.name}
              </Text>
            ))}
          </Stack>

          <Divider mb={8} />

          {/* SubCategory */}
          <Text fontSize="xs" fontWeight="700" mb={3} color="gray.500">
            SUBCATEGORY
          </Text>

          <Select
            borderRadius="12px"
            bg="gray.50"
            mb={10}
            value={filters.subCategory}
            onChange={(e) =>
              setFilters({ ...filters, subCategory: e.target.value })
            }
            isDisabled={!filters.category}
          >
            <option value="">All SubCategories</option>
            {subCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </Select>

          {/* Price */}
          <Text fontSize="xs" fontWeight="700" mb={4} color="gray.500">
            PRICE RANGE
          </Text>

          <RangeSlider
            min={0}
            max={MAX_PRICE_DEFAULT}
            step={100}
            value={[filters.minPrice, filters.maxPrice]}
            onChange={(val) =>
              setFilters({
                ...filters,
                minPrice: val[0],
                maxPrice: val[1],
              })
            }
          >
            <RangeSliderTrack>
              <RangeSliderFilledTrack bg="brand.500" />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>

          <Flex justify="space-between" mt={2} mb={10}>
            <Text fontSize="sm">₹ {filters.minPrice}</Text>
            <Text fontSize="sm">₹ {filters.maxPrice}</Text>
          </Flex>

          {/* Featured */}
          <Flex align="center" justify="space-between" mb={10}>
            <Text fontSize="xs" fontWeight="700" color="gray.500">
              FEATURED
            </Text>
            <Switch
              isChecked={filters.featured}
              onChange={() =>
                setFilters({ ...filters, featured: !filters.featured })
              }
            />
          </Flex>

          <Button
            w="100%"
            borderRadius="full"
            variant="outline"
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
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
        </Box>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent borderTopRadius="30px">
          <DrawerCloseButton />
          <DrawerHeader>Filters</DrawerHeader>
          <DrawerBody pb={10}>
            {/* You can reuse same sidebar content here if needed */}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default AllProducts;