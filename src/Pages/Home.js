// Home.js

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Fade,
  Stack,
  Button,
  SimpleGrid,
  Card,
  Flex,
  CardBody,
  Image,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import cat1 from "../images/cat1.jpg"
import cat2 from "../images/cat2.jpg"
import slider1 from "../images/1.png";
import slider2 from "../images/2.jpg";
import slider3 from "../images/3.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
// import "@fontsource/pt-sans";
import { addToCartt, addToWishlistt, getAllCategories, getAllFeaturedProducts, getAllProducts } from "../actions/api";
import { useLocation } from "react-router-dom";

// Standard Slick Carousel CSS imports
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

const Home = ({ }) => {

  const images = [
    slider1,
    slider2,
    slider1,
    slider2,
    slider1,
    slider2,
    slider1,
    slider2,
    slider1,
    slider2,
    slider1,
    slider2,
    slider1,
    slider2,
    slider1,
    slider2,
    // Add more image paths as needed
  ];
  const posterPaths = [
    slider1,
    slider2,
    slider3,
    // Add more image paths as needed
  ];
  const leftSliderSettings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    arrows: false,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024, // For tablets
        settings: {
          slidesToShow: 5, // Show fewer slides on tablets
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // For mobile devices
        settings: {
          slidesToShow: 3, // Show even fewer slides on mobile
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // For smaller mobile devices
        settings: {
          slidesToShow: 2, // Show only two slides on smaller screens
          slidesToScroll: 1,
        },
      },
    ],
  };
  const rightSliderSettings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    arrows: false,
    pauseOnHover: false,
    rtl: true, // Right to left scrolling
    responsive: [
      {
        breakpoint: 1024, // For tablets
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // For mobile devices
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // For smaller mobile devices
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [quantities, setQuantities] = useState({});

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

  //  mouse hover on card
  const [hoveredProductId, setHoveredProductId] = useState(null);

  const handleHover = (productId) => {
    setHoveredProductId(productId);
  };

  const handleHoverOut = () => {
    setHoveredProductId(null);
  };

  const location = useLocation();

  useEffect(() => {
    if (location.state?.tag) {
      setTags(location.state.tag);

      // Small delay to let React render the section
      setTimeout(() => {
        const section = document.getElementById("featured-products");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 300); // adjust delay if needed
    }
  }, [location.state]);

  useEffect(() => {
    const categoriesSet = new Set(products.map((product) => product.category));
    const uniqueCategoriesArray = [...categoriesSet];
  }, [products]);


  //////////////////

  const [tags, setTags] = useState(['Trending']);
  const [category, setCategory] = useState(null);
  const [color, setColor] = useState(null);

  const fecthData = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response);
      // console.log(response);
      // setLoading(false);
    }
    catch (error) {
      setError(
        "An error occurred while fetching data. Please try again later."
      );
      setLoading(false);
    };
  };

  const fetchTags = async () => {
    try {
      const response = await getAllFeaturedProducts();
      // console.log(response, 'product tag wise');
      setProducts(response.products);
    }
    catch (error) {
      setError(error);
      setLoading(false);
    }
  }
  const [allProducts, setAllProducts] = useState([]);
  const fetchAllProducts = async () => {
    try {
      const response = await getAllProducts({
        limit: 8,
        sort: "newest",
      });
      setAllProducts(response.products);
      console.log(response, 'product all');
    }
    catch (error) {
      setError(error);
      setLoading(false);
    }
  }

  const toast = useToast();
  const addToWishlist = async (productId) => {
    const response = await addToWishlistt(productId);
    window.dispatchEvent(new Event("wishlistUpdated"));
    // console.log(response);
    // setIsAddedToWishlist(true);
    toast({
      title: response.data.message,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // add to cart function
  const handleAddToCart = async (productId, quantity) => {
    try {
      const response = await addToCartt(productId, quantity); // quantity default 1
      window.dispatchEvent(new Event("cartUpdated"));
      if (response.status === 200) {
        toast({
          title: "Item added to cart",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error adding to cart",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchAllProducts();
    fecthData();
    fetchTags();
  }, [tags]);

  // 1. Define Slider Settings
  const sliderSettings2 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1, // Still used for "Next/Prev" buttons
    swipeToSlide: true, // <--- ENABLE THIS. Allows dragging multiple slides at once based on swipe distance
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  // #2
  const sliderSettings = {
    // dots: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    autoplaySpeed: 1000,
  };
  const navigate = useNavigate();
  const query = 'Rasp'
  const shopNowToProducts = () => {
    if (!query.trim()) return;
    navigate(`/products?search=${query}`);
  };

  return (
    <>
      {/* <Box overflowX="hidden" overflowY="hidden">
        <Slider {...sliderSettings}>
          {posterPaths.map((path, index) => (
            <Fade
              key={index}
              in={true}
              style={{ transitionDelay: `${index * 0.5}s` }}
            >
              <Box mb={4}>
                <Image
                  src={path}
                  alt={`Poster ${index + 1}`}
                  style={{ width: "100%", height: "auto" }}
                />
              </Box>
            </Fade>
          ))}
        </Slider>
      </Box> */}
      <Box px={{ base: 4, md: 12 }} mt={6}>
        <Box
          bg="#f5f5f5"
          borderRadius="30px"
          px={{ base: 6, md: 16 }}
          py={{ base: 10, md: 20 }}
          position="relative"
          overflow="hidden"
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
            gap={10}
          >
            {/* LEFT CONTENT */}
            <Box flex="1">
              <Text
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="700"
                lineHeight="1.2"
                mb={6}
              >
                Transform Your Tech,
                <br />
                Boost Digital Journey!
              </Text>

              <Text
                color="gray.600"
                fontSize="md"
                maxW="420px"
                mb={8}
              >
                From ultra-fast chargers to cutting-edge gaming accessories,
                find everything you need to power your devices with style
                and performance.
              </Text>

              <Button
                bg="black"
                color="white"
                borderRadius="full"
                px={8}
                py={6}
                _hover={{ bg: "gray.800" }}
                onClick={shopNowToProducts}
              >
                Shop Now →
              </Button>
            </Box>

            {/* RIGHT IMAGE */}
            <Box flex="1" textAlign="center">
              <Image
                src={slider1}   // use your product image
                maxH="420px"
                mx="auto"
              />
            </Box>
          </Flex>

          {/* Background Big Faded Text */}
          <Text
            position="absolute"
            bottom="10px"
            left="50%"
            transform="translateX(-50%)"
            fontSize="150px"
            fontWeight="800"
            color="gray.200"
            zIndex="0"
            userSelect="none"
            display={{ base: "none", md: "block" }}
          >
            KP
          </Text>
        </Box>
      </Box>

      <Box px={{ base: 4, md: 12 }} mt={12}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          bg="white"
          borderRadius="20px"
          py={8}
          px={10}
          boxShadow="0 10px 40px rgba(0,0,0,0.05)"
          gap={8}
        >
          {[
            {
              title: "Superior Quality",
              desc: "We give only the best. No compromises.",
            },
            {
              title: "Fast & Free Shipping",
              desc: "Enjoy free shipping on orders over ₹999",
            },
            {
              title: "30-Day Returns",
              desc: "Easy replacement within 30 days",
            },
            {
              title: "24/7 Support",
              desc: "Dedicated support team always available",
            },
          ].map((item, index) => (
            <Box key={index} textAlign="center">
              <Box
                bg="gray.100"
                borderRadius="full"
                w="50px"
                h="50px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb={4}
              >
                ✓
              </Box>

              <Text fontWeight="600" mb={1}>
                {item.title}
              </Text>

              <Text fontSize="sm" color="gray.600">
                {item.desc}
              </Text>
            </Box>
          ))}
        </Flex>
      </Box>

      {/* <Box id="featured-products" m={0}>
        <Stack
          direction="column"
          spacing={6}
          align="center"
          justify="center"
          mt={{ base: 8, md: 12 }}
          px={4}
        >
          <Heading
            px={{ base: 6, md: 10 }}
            py={2}
            fontSize={{ base: "xl", sm: "2xl", md: "3xl", lg: "4xl" }}
            fontWeight="500"
            border="1px solid"
            borderColor="gray.400"
            borderRadius="full"
            textAlign="center"
            fontFamily="'Quicksand', sans-serif"
          >
            Featured Products
          </Heading>
        </Stack>

        <Box width="80%" overflow="hidden" py={10} mx="auto">
          <Slider {...sliderSettings2}>

            {products.map((product) => (
              <Box key={product._id} px={4}>
                <Box
                  bg="white"
                  borderRadius="16px"
                  overflow="hidden"
                  boxShadow="0 4px 20px rgba(0,0,0,0.04)"
                  _hover={{
                    transform: "scale(1.02)",
                    transition: "all 0.3s ease"
                  }}
                  transition="all 0.3s ease"
                >
                  <Box position="relative" role="group">
                    <Image
                      src={`http://localhost:5000/uploads${product.images[0]}`} // http://76.13.247.39:5000
                      h="240px"
                      w="100%"
                      objectFit="cover"
                      bg="gray.50"
                      p={0}
                    />

                    <IconButton
                      icon={<FaHeart />}
                      aria-label="Wishlist"
                      position="absolute"
                      top="12px"
                      right="12px"
                      borderRadius="full"
                      bg="white"
                      size="sm"
                      boxShadow="sm"
                      opacity={0}
                      transform="translateY(-10px)"
                      _groupHover={{
                        opacity: 1,
                        transform: "translateY(0px)",
                      }}
                      transition="all 0.3s ease"
                      _hover={{ bg: "gray.100" }}
                      onClick={() => addToWishlist(product._id)}
                    />
                  </Box>

                  <Box p={5}>
                    <Text
                      fontWeight="600"
                      fontSize="md"
                      mb={2}
                      noOfLines={1}
                    >
                      {product.name}
                    </Text>

                    <Text
                      fontWeight="bold"
                      fontSize="lg"
                      mb={4}
                      color="black"
                    >
                      ₹ {product.price}
                    </Text>

                    <Flex gap={3}>
                      <Flex
                        border="1px solid #E2E8F0"
                        borderRadius="8px"
                        align="center"
                        justify="space-between"
                        px={3}
                        py={1}
                        flex="1"
                        bg="gray.50"
                      >
                        <Text
                          cursor="pointer"
                          fontWeight="bold"
                          onClick={() => decreaseQty(product._id)}
                        >
                          −
                        </Text>

                        <Text fontWeight="500">
                          {quantities[product._id] || 1}
                        </Text>

                        <Text
                          cursor="pointer"
                          fontWeight="bold"
                          onClick={() => increaseQty(product._id)}
                        >
                          +
                        </Text>
                      </Flex>


                      <Button
                        bg="black"
                        color="white"
                        flex="2"
                        borderRadius="8px"
                        _hover={{ bg: "gray.800" }}
                        leftIcon={<FaShoppingCart />}
                        onClick={() =>
                          handleAddToCart(
                            product._id,
                            quantities[product._id] || 1
                          )
                        }

                      >
                        ADD
                      </Button>
                    </Flex>
                  </Box>
                </Box>
              </Box>
            ))}

          </Slider>
        </Box>
      </Box > */}

      <Box id="featured-products" px={{ base: 4, md: 12 }} mt={20}>

        {/* SECTION HEADER */}
        <Flex
          justify="space-between"
          align="center"
          mb={12}
          flexWrap="wrap"
          gap={4}
        >
          <Box>
            <Text fontSize="3xl" fontWeight="700">
              Featured Products
            </Text>
            <Text color="gray.500" fontSize="sm">
              Handpicked premium tech curated for you
            </Text>
          </Box>

          <Link to="/products">
            <Button
              variant="outline"
              borderRadius="full"
              px={6}
              _hover={{ bg: "black", color: "white" }}
            >
              View All →
            </Button>
          </Link>
        </Flex>

        {/* PRODUCTS GRID */}
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
          spacing={10}
        >
          {products.slice(0, 8).map((product) => (
            <Box
              key={product._id}
              bg="white"
              borderRadius="24px"
              overflow="hidden"
              transition="all 0.3s ease"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
              }}
            >
              {/* IMAGE */}
              <Box position="relative" role="group">
                <Link to={`/productdetails/${product._id}`}>
                  <Image
                    src={`/uploads${hoveredProductId === product._id
                      ? product.images[1]
                      : product.images[0]
                      }`}
                    onMouseOver={() => handleHover(product._id)}
                    onMouseOut={handleHoverOut}
                    h="260px"
                    w="100%"
                    objectFit="cover"
                    bg="gray.50"
                  // p={6}
                  />
                </Link>

                {/* Wishlist */}
                <IconButton
                  icon={<FaHeart />}
                  aria-label="wishlist"
                  position="absolute"
                  top="20px"
                  right="20px"
                  borderRadius="full"
                  bg="white"
                  boxShadow="md"
                  size="sm"
                  opacity={0}
                  transform="translateY(-10px)"
                  _groupHover={{
                    opacity: 1,
                    transform: "translateY(0)",
                  }}
                  transition="all 0.3s ease"
                  _hover={{ bg: "gray.100" }}
                  onClick={() => addToWishlist(product._id)}
                />
              </Box>

              {/* CONTENT */}
              <Box px={6} pb={6}>
                <Text
                  fontWeight="600"
                  fontSize="md"
                  mt={4}
                  mb={2}
                  noOfLines={1}
                >
                  {product.name}
                </Text>

                <Text fontWeight="bold" fontSize="lg" mb={4}>
                  ₹ {product.price}
                </Text>

                {/* CONTROLS */}
                <Flex gap={3}>
                  {/* Quantity */}
                  <Flex
                    border="1px solid #E2E8F0"
                    borderRadius="12px"
                    align="center"
                    justify="space-between"
                    px={3}
                    py={1}
                    flex="1"
                    bg="gray.50"
                  >
                    <Text
                      cursor="pointer"
                      fontWeight="bold"
                      onClick={() => decreaseQty(product._id)}
                    >
                      −
                    </Text>

                    <Text fontWeight="500">
                      {quantities[product._id] || 1}
                    </Text>

                    <Text
                      cursor="pointer"
                      fontWeight="bold"
                      onClick={() => increaseQty(product._id)}
                    >
                      +
                    </Text>
                  </Flex>

                  {/* Add Button */}
                  <Button
                    bg="black"
                    color="white"
                    flex="2"
                    borderRadius="12px"
                    _hover={{ bg: "gray.800" }}
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

      {/* <br></br>
      <br></br> */}
      {/* //category */}
      {/* <Box bgColor={'gray.100'} mt={10} pb={10} pt={1}>
        <Stack
          direction="column"
          spacing={6}
          align="center"
          justify="center"
          mt={{ base: 8, md: 12 }}
          mb={{ base: 4, md: 8 }}
          px={4}
        >
          <Heading
            px={{ base: 6, md: 10 }}
            py={2}
            fontSize={{ base: "xl", sm: "2xl", md: "3xl", lg: "4xl" }}
            fontWeight="500"
            border="1px solid"
            borderColor="gray.400"
            borderRadius="full"
            textAlign="center"
            fontFamily="'Quicksand', sans-serif"
           >
            All Categories
          </Heading>
        </Stack>

        <Stack spacing={4} align="center" justify="center">
          <Stack spacing={4} align="center" justify="center" marginTop={2}>
            <SimpleGrid columns={[1, 2, 2, 4]} spacing={4} alignItems="stretch">
              {categories.map((category) => (
                <React.Fragment key={category}>
                  <Link to={`/products/${encodeURIComponent(category.name)}`} display='flex' justifyContent={'center'} alignItems={'center'}>
                    <Card
                      shadow={"none"}
                      borderRadius={'10px'}
                    >
                      <CardBody
                        _hover={{ boxShadow: "0px 5px 10px rgba(0,0,0,0.15)" }}  // Applies medium shadow on hover
                        transition="box-shadow 0.1s ease-in-out"
                        border="1px solid #cbcbcbff" p={0}
                        borderRadius={'10px'}
                        boxShadow={"0px 0px 10px rgba(0, 0, 0, 0.1)"}>
                        <Link
                          to={{
                            pathname: `/category/${category._id}`,
                            state: { category },
                          }}
                          key={category._id}
                        >
                          <Stack sx={{ objectFit: "contain" }}>
                            <Image
                              height="200px"
                              width="244px"
                              objectFit="cover"
                              borderRadius={'10px'}
                              m={4}
                              border="1px solid #cbcbcbff"
                              src={`http://localhost:5000/uploads${category.image}`} // http://76.13.247.39:5000
                              onMouseOver={() => handleHover(category._id)}
                              onMouseOut={handleHoverOut}
                              alt={category.name}
                            />
                          </Stack>
                        </Link>
                        <Stack mb={4} mx={4} direction="column" display={'flex'} justifyContent={'center'} alignItems={'left'}>
                          <Text fontSize={20} fontWeight={600} fontFamily="'Quicksand', sans-serif">
                            {category.name}
                          </Text>
                        </Stack>
                      </CardBody>
                    </Card>
                  </Link>
                </React.Fragment>
              ))}
            </SimpleGrid>
          </Stack>
        </Stack>
      </Box> */}

      <Box px={{ base: 4, md: 12 }} mt={24}>

        {/* SECTION HEADER */}
        <Flex
          justify="space-between"
          align="center"
          mb={12}
          flexWrap="wrap"
          gap={4}
        >
          <Box>
            <Text fontSize="3xl" fontWeight="700">
              Shop By Category
            </Text>
            <Text color="gray.500" fontSize="sm">
              Explore our wide range of premium collections
            </Text>
          </Box>

          <Link to="/products">
            <Button
              variant="outline"
              borderRadius="full"
              px={6}
              _hover={{ bg: "black", color: "white" }}
            >
              View All →
            </Button>
          </Link>
        </Flex>

        {/* DESKTOP GRID */}
        <Box display={{ base: "none", md: "block" }}>
          <SimpleGrid columns={{ md: 3, lg: 4 }} spacing={8}>
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/category/${category._id}`}
              >
                <Box
                  position="relative"
                  borderRadius="28px"
                  overflow="hidden"
                  cursor="pointer"
                  role="group"
                  h="260px"
                >
                  <Image
                    src={`/uploads${category.image}`}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    transition="all 0.5s ease"
                    _groupHover={{
                      transform: "scale(1.08)",
                    }}
                  />

                  {/* Dark Overlay */}
                  <Box
                    position="absolute"
                    inset="0"
                    bg="rgba(0,0,0,0.35)"
                    transition="all 0.3s ease"
                    _groupHover={{
                      bg: "rgba(0,0,0,0.55)",
                    }}
                  />

                  {/* Text */}
                  <Box
                    position="absolute"
                    bottom="30px"
                    left="30px"
                    color="white"
                  >
                    <Text fontSize="xl" fontWeight="700">
                      {category.name}
                    </Text>
                    <Text fontSize="sm" opacity="0.8">
                      Explore Now →
                    </Text>
                  </Box>
                </Box>
              </Link>
            ))}
          </SimpleGrid>
        </Box>

        {/* MOBILE SLIDER */}
        <Box display={{ base: "block", md: "none" }}>
          <Box overflowX="auto" whiteSpace="nowrap" pb={4}>
            <Flex gap={4}>
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/category/${category._id}`}
                >
                  <Box
                    minW="240px"
                    h="200px"
                    borderRadius="24px"
                    overflow="hidden"
                    position="relative"
                    role="group"
                    flexShrink={0}
                  >
                    <Image
                      src={`/uploads${category.image}`}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />

                    <Box
                      position="absolute"
                      inset="0"
                      bg="rgba(0,0,0,0.4)"
                    />

                    <Box
                      position="absolute"
                      bottom="20px"
                      left="20px"
                      color="white"
                    >
                      <Text fontWeight="600">
                        {category.name}
                      </Text>
                    </Box>
                  </Box>
                </Link>
              ))}
            </Flex>
          </Box>
        </Box>

      </Box>

      {/* <Box mt={10} pb={10} pt={1}>
        <Stack
          direction="column"
          spacing={6}
          align="center"
          justify="center"
          mt={{ base: 8, md: 12 }}
          mb={{ base: 4, md: 8 }}
          px={4}
        >
          <Heading
            px={{ base: 6, md: 10 }}
            py={2}
            fontSize={{ base: "xl", sm: "2xl", md: "3xl", lg: "4xl" }}
            fontWeight="500"
            border="1px solid"
            borderColor="gray.400"
            borderRadius="full"
            textAlign="center"
            fontFamily="'Quicksand', sans-serif"
          >
            All Products
          </Heading>
        </Stack>

        <Stack spacing={4} align="center" justify="center" marginTop={2}>
          <SimpleGrid columns={[1, 2, 2, 4]} spacing={8} alignItems="stretch">
            {allProducts.map((product) => (
              <Box key={product._id}>
                <Box
                  bg="white"
                  width="280px"
                  borderRadius="16px"
                  overflow="hidden"
                  maxW={["100%", "100%", "xs"]}
                  boxShadow="0 4px 20px rgba(0,0,0,0.06)"
                  _hover={{
                    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                    transform: "translateY(-6px)",
                  }}
                  transition="all 0.3s ease"
                >
                  <Box position="relative" role="group">
                    <Link to={`/productdetails/${product._id}`}>
                      <Image
                        h="240px"
                        w="100%"
                        objectFit="cover"
                        bg="gray.50"
                        src={`http://localhost:5000/uploads${hoveredProductId === product._id
                          ? product.images[1]
                          : product.images[0]
                          }`} // http://76.13.247.39:5000
                        onMouseOver={() => handleHover(product._id)}
                        onMouseOut={handleHoverOut}
                        alt={product.name}
                      />
                    </Link>

                    <IconButton
                      icon={<FaHeart />}
                      aria-label="Wishlist"
                      position="absolute"
                      top="12px"
                      right="12px"
                      borderRadius="full"
                      bg="white"
                      size="sm"
                      boxShadow="sm"
                      opacity={0}
                      transform="translateY(-10px)"
                      _groupHover={{
                        opacity: 1,
                        transform: "translateY(0px)",
                      }}
                      transition="all 0.3s ease"
                      _hover={{ bg: "gray.100" }}
                      onClick={() => addToWishlist(product._id)}
                    />
                  </Box>

                  <Box p={5}>
                    <Text
                      fontWeight="600"
                      fontSize="md"
                      mb={2}
                      noOfLines={1}
                    >
                      {product.name}
                    </Text>

                    <Text
                      fontWeight="bold"
                      fontSize="lg"
                      mb={4}
                      color="black"
                    >
                      ₹ {product.price}
                    </Text>

                    <Flex gap={3}>
                      <Flex
                        border="1px solid #E2E8F0"
                        borderRadius="8px"
                        align="center"
                        justify="space-between"
                        px={3}
                        py={1}
                        flex="1"
                        bg="gray.50"
                      >
                        <Text
                          cursor="pointer"
                          fontWeight="bold"
                          onClick={() => decreaseQty(product._id)}
                        >
                          −
                        </Text>

                        <Text fontWeight="500">
                          {quantities[product._id] || 1}
                        </Text>

                        <Text
                          cursor="pointer"
                          fontWeight="bold"
                          onClick={() => increaseQty(product._id)}
                        >
                          +
                        </Text>
                      </Flex>

                      <Button
                        bg="black"
                        color="white"
                        flex="2"
                        borderRadius="8px"
                        _hover={{ bg: "gray.800" }}
                        leftIcon={<FaShoppingCart />}
                        onClick={() =>
                          handleAddToCart(
                            product._id,
                            quantities[product._id] || 1
                          )
                        }
                      >
                        ADD
                      </Button>
                    </Flex>
                  </Box>
                </Box>
              </Box>
            ))}

          </SimpleGrid>
        </Stack>

        <Flex align={'center'} justifyContent={'center'} mt={10}>

          <Link
            to={{
              pathname: `/products`
            }}
          >
            <Button variant={'outline'}>
              View More
            </Button>
          </Link>
        </Flex>
      </Box > */}

      <Box px={{ base: 4, md: 12 }} mt={28} pb={20}>

        {/* SECTION HEADER */}
        <Flex
          justify="space-between"
          align="center"
          mb={14}
          flexWrap="wrap"
          gap={4}
        >
          <Box>
            <Text fontSize="3xl" fontWeight="700">
              All Products
            </Text>
            <Text color="gray.500" fontSize="sm">
              Discover our complete collection
            </Text>
          </Box>

          <Link to="/products">
            <Button
              borderRadius="full"
              px={6}
              bg="black"
              color="white"
              _hover={{ bg: "gray.800" }}
            >
              View More →
            </Button>
          </Link>
        </Flex>

        {/* PRODUCTS GRID */}
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
          spacing={10}
        >
          {allProducts.map((product) => (
            <Box
              key={product._id}
              bg="white"
              borderRadius="24px"
              overflow="hidden"
              border="1px solid #f1f1f1"
              transition="all 0.3s ease"
              _hover={{
                transform: "translateY(-6px)",
                boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
              }}
            >
              {/* IMAGE */}
              <Box position="relative" role="group">
                <Link to={`/productdetails/${product._id}`}>
                  <Image
                    src={`/uploads${hoveredProductId === product._id
                      ? product.images[1]
                      : product.images[0]
                      }`}
                    onMouseOver={() => handleHover(product._id)}
                    onMouseOut={handleHoverOut}
                    h="240px"
                    w="100%"
                    objectFit="cover"
                    bg="gray.50"
                    p={6}
                    transition="all 0.4s ease"
                    _groupHover={{
                      transform: "scale(1.05)",
                    }}
                  />
                </Link>

                {/* Wishlist */}
                <IconButton
                  icon={<FaHeart />}
                  aria-label="wishlist"
                  position="absolute"
                  top="18px"
                  right="18px"
                  borderRadius="full"
                  bg="white"
                  boxShadow="md"
                  size="sm"
                  opacity={0}
                  transform="translateY(-10px)"
                  _groupHover={{
                    opacity: 1,
                    transform: "translateY(0)",
                  }}
                  transition="all 0.3s ease"
                  _hover={{ bg: "gray.100" }}
                  onClick={() => addToWishlist(product._id)}
                />
              </Box>

              {/* CONTENT */}
              <Box px={6} pb={6}>
                <Text
                  fontWeight="600"
                  fontSize="md"
                  mt={4}
                  mb={2}
                  noOfLines={1}
                >
                  {product.name}
                </Text>

                <Text
                  fontWeight="700"
                  fontSize="lg"
                  mb={4}
                  letterSpacing="0.5px"
                >
                  ₹ {product.price}
                </Text>

                {/* CONTROLS */}
                <Flex gap={3}>
                  {/* Quantity Selector */}
                  <Flex
                    border="1px solid #E2E8F0"
                    borderRadius="12px"
                    align="center"
                    justify="space-between"
                    px={3}
                    py={1}
                    flex="1"
                    bg="gray.50"
                  >
                    <Text
                      cursor="pointer"
                      fontWeight="bold"
                      onClick={() => decreaseQty(product._id)}
                    >
                      −
                    </Text>

                    <Text fontWeight="500">
                      {quantities[product._id] || 1}
                    </Text>

                    <Text
                      cursor="pointer"
                      fontWeight="bold"
                      onClick={() => increaseQty(product._id)}
                    >
                      +
                    </Text>
                  </Flex>

                  {/* Add Button */}
                  <Button
                    bg="black"
                    color="white"
                    flex="2"
                    borderRadius="12px"
                    _hover={{ bg: "gray.800" }}
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

    </>
  );
};

export default Home;
