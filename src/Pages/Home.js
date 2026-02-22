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
import { Link } from "react-router-dom";
import cat1 from "../images/cat1.jpg"
import cat2 from "../images/cat2.jpg"
import slider1 from "../images/1.jpg";
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

  return (
    <>
      <Box overflowX="hidden" overflowY="hidden">
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
      </Box>

      <Box id="featured-products" m={0}>
        <Stack
          direction="column"
          spacing={6}
          align="center"
          justify="center"
          mt={{ base: 8, md: 12 }}
          // mb={{ base: 4, md: 8 }}
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
          // letterSpacing="wide"
          >
            Featured Products
          </Heading>
        </Stack>

        <Box width="80%" overflow="hidden" py={10} mx="auto">
          {/* The Slider Component replaces SimpleGrid */}
          <Slider {...sliderSettings2}>
            {/* {products.map((product) => (
              <Box key={product._id} px={2} py={2}>
                <Card
                  shadow={"none"}
                  maxW={["100%", "100%", "xs"]}
                  width="244px"
                  mx="auto"
                >
                  <CardBody p={0}
                    boxShadow={"0px 0px 10px rgba(0, 0, 0, 0.1)"}>
                    <Link
                      to={{
                        pathname: `/productdetails/${product._id}`,
                        state: { product },
                      }}
                    >
                      <Stack sx={{ objectFit: "contain" }}>
                        <Image
                          height="200px"
                          width="244px"
                          objectFit="cover"
                          p={2}
                          src={`http://localhost:5000/uploads${hoveredProductId === product._id ? product.images[1] : product.images[0]}`}
                          onMouseOver={() => handleHover(product._id)}
                          onMouseOut={handleHoverOut}
                          alt={product.name}
                        />
                      </Stack>
                    </Link>
                    <Stack direction="column" display={'flex'} justifyContent={'center'} alignItems={'center'}>
                      <Text size="xs">
                        {product.name}
                        <Text textAlign={'center'} fontWeight={600} fontSize="xl" fontFamily="'Quicksand', sans-serif">
                          ₹ {product.price}
                        </Text>
                      </Text>
                      <Text textAlign={'center'} fontSize="xs" fontFamily="'Quicksand', sans-serif">
                        MRP (Inc. of all taxes)
                      </Text>
                      <Flex mb={2} w={'90%'} justifyContent={'center'}>
                        <Button w={'100%'} borderRadius={'50px'} onClick={() => addToWishlist(product._id)}>
                          Add To Wishlist
                        </Button>
                      </Flex>
                    </Stack>
                  </CardBody>
                </Card>
              </Box>
            ))} */}
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
                  {/* IMAGE SECTION */}
                  <Box position="relative" role="group">
                    <Image
                      src={`http://localhost:5000/uploads${product.images[0]}`}
                      h="240px"
                      w="100%"
                      objectFit="cover"
                      bg="gray.50"
                      p={0}
                    />

                    {/* Wishlist Icon (Smooth Hover) */}
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

                  {/* CONTENT */}
                  <Box p={5}>
                    {/* Product Name */}
                    <Text
                      fontWeight="600"
                      fontSize="md"
                      mb={2}
                      noOfLines={1}
                    >
                      {product.name}
                    </Text>

                    {/* Price */}
                    <Text
                      fontWeight="bold"
                      fontSize="lg"
                      mb={4}
                      color="black"
                    >
                      ₹ {product.price}
                    </Text>

                    {/* Bottom Controls */}
                    <Flex gap={3}>
                      {/* Quantity Selector */}
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


                      {/* Add to Cart Button */}
                      <Button
                        bg="black"
                        color="white"
                        flex="2"
                        borderRadius="8px"
                        _hover={{ bg: "gray.800" }}
                        leftIcon={<FaShoppingCart />}
                        // onClick={() => handleAddToCart(product._id, quantity)}
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
      </Box >

      {/* <br></br>
      <br></br> */}
      {/* //category */}
      <Box bgColor={'gray.100'} mt={10} pb={10} pt={1}>
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
          // letterSpacing="wide"
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
                    {/* <Card
                      height="100%"
                      width="100%" shadow={"none"}
                    >
                      <CardBody p={0} display={'flex'} justifyContent={'center'} height={'100%'} bgColor={categoryBg}>
                        <Box maxW={["100%", "100%", "100%"]} >
                          <Image
                            // height="100%"
                            borderRadius={'25px'}
                            width="100%"
                            objectFit="contain"
                            src={`http://localhost:5000/uploads${category.image}`}
                          />
                        </Box>
                      </CardBody>
                    </Card> */}
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
                              // boxShadow={"0px 0px 10px rgba(0, 0, 0, 0.1)"}
                              src={`http://localhost:5000/uploads${category.image}`}
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
      </Box>

      {/* All Products */}
      <Box mt={10} pb={10} pt={1}>
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
          // letterSpacing="wide"
          >
            All Products
          </Heading>
        </Stack>

        <Stack spacing={4} align="center" justify="center" marginTop={2}>
          <SimpleGrid columns={[1, 2, 2, 4]} spacing={8} alignItems="stretch">
            {/* {allProducts.map((product) => (
              <Card
                shadow={"none"}
                maxW={["100%", "100%", "xs"]}
                // height="366px"
                width="244px"
              >
                <CardBody p={0} borderRadius={'25px'} boxShadow={"0px 0px 10px rgba(0, 0, 0, 0.1)"}>
                  <Link
                    to={{
                      pathname: `/productdetails/${product._id}`,
                      state: { product },
                    }}
                    key={product._id}
                  >
                    <Stack sx={{ objectFit: "contain" }}>
                      <Image
                        height="200px"
                        width="244px"
                        p={4}
                        objectFit="cover"
                        borderRadius={'25px'}
                        // boxShadow={"0px 0px 10px rgba(0, 0, 0, 0.1)"}
                        src={`http://localhost:5000/uploads${hoveredProductId === product._id ? product.images[1] : product.images[0]}`}
                        onMouseOver={() => handleHover(product._id)}
                        onMouseOut={handleHoverOut}
                        alt={product.name}
                      />
                    </Stack>
                  </Link>
                  <Stack direction="column" display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <Text size="xs">
                      {product.name}
                      <Text textAlign={'center'} fontWeight={600} fontSize="xl" fontFamily="'Quicksand', sans-serif">
                        ₹ {product.price}
                      </Text>
                    </Text>
                    <Text textAlign={'center'} fontSize="xs" fontFamily="'Quicksand', sans-serif">
                      MRP (Inc. of all taxes)
                    </Text>
                    <Flex mb={2} w={'90%'} justifyContent={'center'}>
                      <Button w={'100%'} borderRadius={'50px'} onClick={() => addToWishlist(product._id)}>
                        Add To Wishlist
                      </Button>
                    </Flex>
                  </Stack>
                </CardBody>
              </Card>
            ))} */}
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
                  {/* IMAGE SECTION */}
                  <Box position="relative" role="group">
                    <Link to={`/productdetails/${product._id}`}>
                      <Image
                        h="240px"
                        w="100%"
                        objectFit="cover"
                        bg="gray.50"
                        // p={4}
                        src={`http://localhost:5000/uploads${hoveredProductId === product._id
                          ? product.images[1]
                          : product.images[0]
                          }`}
                        onMouseOver={() => handleHover(product._id)}
                        onMouseOut={handleHoverOut}
                        alt={product.name}
                      />
                    </Link>

                    {/* Wishlist Hover Icon */}
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

                  {/* CONTENT */}
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

                    {/* Bottom Controls */}
                    <Flex gap={3}>
                      {/* Quantity Selector */}
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

                      {/* Add To Cart */}
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
      </Box >
    </>
  );
};

export default Home;
