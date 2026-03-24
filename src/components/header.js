import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  IconButton,
  Drawer,
  Text,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  HStack,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Img,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FaUser, FaShoppingCart, FaRegHeart } from "react-icons/fa";

import logo from "./logo.png";
import ShoppingCartDrawer from "../components/cart";
import WishlistDrawer from "./wishlist";
import HeaderSearch from "../components/HeaderSearch";

import {
  getCart,
  getSingleUser,
  getWishlist,
  logout,
} from "../actions/api";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isWishlistOpen, setWishlistOpen] = useState(false);

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleToggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getSingleUser();
        setIsLoggedIn(res.success === true);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    navigate("/login");
  };

  const loadCounts = async () => {
    try {
      const cartRes = await getCart();
      const wishlistRes = await getWishlist();
      setCartCount(cartRes?.items?.length || 0);
      setWishlistCount(wishlistRes?.items?.length || 0);
    } catch { }
  };

  useEffect(() => {
    loadCounts();
  }, []);

  useEffect(() => {
    const update = () => loadCounts();
    window.addEventListener("cartUpdated", update);
    window.addEventListener("wishlistUpdated", update);
    return () => {
      window.removeEventListener("cartUpdated", update);
      window.removeEventListener("wishlistUpdated", update);
    };
  }, []);

  const isMobile = window.innerWidth <= 768;

  // return (
  //   <Box position="sticky" top="0" bg="white" zIndex="1000" borderBottom="1px solid #eee">

  //     {/* MAIN HEADER */}
  //     <Flex
  //       px={{ base: 4, md: 8 }}   // 🔥 Reduced side spacing
  //       height={{ base: "70px", md: "85px" }}
  //       align="center"
  //       justify="space-between"
  //     >
  //       {/* LEFT */}
  //       <HStack spacing={4}>
  //         <IconButton
  //           icon={<HamburgerIcon />}
  //           variant="ghost"
  //           onClick={handleToggle}
  //         />
  //         <Box
  //           fontWeight="600"
  //           fontSize={{ base: "lg", md: "xl" }}
  //           cursor="pointer"
  //           onClick={() => navigate("/")}
  //         >
  //           KP {isMobile ? <br /> : " CIRCUIT CITY"}
  //         </Box>
  //       </HStack>
  //       {/* DESKTOP SEARCH */}
  //       <Box
  //         display={{ base: "none", md: "flex" }}
  //         flex="1"
  //         justifyContent="center"
  //         px={6}
  //       >
  //         <Box w="100%">
  //           <HeaderSearch />
  //         </Box>
  //       </Box>

  //       {/* RIGHT */}
  //       <HStack spacing={3}>
  //         {/* USER */}
  //         <Menu>
  //           <MenuButton
  //             as={IconButton}
  //             icon={<FaUser />}
  //             variant="ghost"
  //           />
  //           <MenuList>
  //             {isLoggedIn ? (
  //               <>
  //                 <MenuItem onClick={() => navigate("/myorders")}>
  //                   My Orders
  //                 </MenuItem>
  //                 <MenuItem onClick={() => navigate("/profile")}>
  //                   Profile
  //                 </MenuItem>
  //                 <MenuItem onClick={handleLogout}>
  //                   Logout
  //                 </MenuItem>
  //               </>
  //             ) : (
  //               <MenuItem onClick={() => navigate("/login")}>
  //                 Login
  //               </MenuItem>
  //             )}
  //           </MenuList>
  //         </Menu>

  //         {/* HEART */}
  //         <Box position="relative">
  //           <IconButton
  //             icon={<FaRegHeart />}   // 🔥 Red heart
  //             variant="ghost"
  //             onClick={() => setWishlistOpen(!isWishlistOpen)}
  //           />
  //           {wishlistCount > 0 && (
  //             <Box
  //               position="absolute"
  //               top="0"
  //               right="0"
  //               bg="red.500"
  //               color="white"        // 🔥 White text
  //               borderRadius="full"
  //               fontSize="10px"
  //               px="6px"
  //               minW="18px"
  //               textAlign="center"
  //               fontWeight="bold"
  //             >
  //               {wishlistCount}
  //             </Box>
  //           )}
  //         </Box>

  //         {/* CART */}
  //         <Box position="relative">
  //           <IconButton
  //             icon={<FaShoppingCart />}
  //             variant="ghost"
  //             onClick={() => setCartOpen(!isCartOpen)}
  //           />
  //           {cartCount > 0 && (
  //             <Box
  //               position="absolute"
  //               top="0"
  //               right="0"
  //               bg="red.500"
  //               color="white"
  //               borderRadius="full"
  //               fontSize="10px"
  //               px="6px"
  //               minW="18px"
  //               textAlign="center"
  //               fontWeight="bold"
  //             >
  //               {cartCount}
  //             </Box>
  //           )}
  //         </Box>
  //       </HStack>
  //     </Flex>

  //     {/* MOBILE SEARCH */}
  //     <Box display={{ base: "block", md: "none" }} px={4} pb={3}>
  //       <HeaderSearch />
  //     </Box>

  //     {/* DRAWER */}
  //     <Drawer placement="left" onClose={handleToggle} isOpen={isOpen}>
  //       <DrawerOverlay>
  //         <DrawerContent>
  //           <DrawerCloseButton />
  //           <DrawerHeader>
  //             <Img src={logo} width="120px" />
  //           </DrawerHeader>
  //           <Divider />
  //           <DrawerBody>
  //             <VStack align="left" spacing={4}>
  //               <Text cursor="pointer" onClick={() => navigate("/")}>
  //                 Featured Products
  //               </Text>
  //               <Divider />
  //               <Text>All Categories</Text>
  //               <Divider />
  //               <Text onClick={() => navigate("/about")}>ABOUT</Text>
  //             </VStack>
  //           </DrawerBody>
  //         </DrawerContent>
  //       </DrawerOverlay>
  //     </Drawer>

  //     <ShoppingCartDrawer isCartOpen={isCartOpen} setCartOpen={setCartOpen} />
  //     <WishlistDrawer isWishlistOpen={isWishlistOpen} setWishlistOpen={setWishlistOpen} />
  //   </Box>
  // );

  return (
    <Box position="sticky" top="0" bg="white" zIndex="1000" boxShadow="0 2px 20px rgba(0,0,0,0.04)">

      {/* TOP ANNOUNCEMENT BAR */}
      <Flex
        bg="black"
        color="white"
        height="36px"
        align="center"
        justify="center"
        fontSize="sm"
        fontWeight="500"
        letterSpacing="0.5px"
      >
        🚚 Free Shipping Above ₹999 | 🔒 100% Secure Payments
      </Flex>

      {/* MAIN HEADER */}
      <Flex
        px={{ base: 4, md: 12 }}
        height="90px"
        align="center"
        justify="space-between"
      >

        {/* LEFT: LOGO */}
        <HStack spacing={4}>
          <IconButton
            icon={<HamburgerIcon />}
            variant="ghost"
            display={{ base: "flex", md: "none" }}
            onClick={handleToggle}
          />

          <Text
            fontSize="2xl"
            fontWeight="700"
            letterSpacing="1px"
            cursor="pointer"
            onClick={() => navigate("/")}
          >
            KP <Box as="span" fontWeight="300">CIRCUIT</Box>
          </Text>
        </HStack>

        {/* CENTER SEARCH */}
        <Box flex="1" maxW="600px" mx={10} display={{ base: "none", md: "block" }}>
          <HeaderSearch />
        </Box>

        {/* RIGHT SIDE */}
        <HStack spacing={3}>

          {/* USER */}
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FaUser />}
              variant="ghost"
              borderRadius="full"
              bg="gray.50"
              _hover={{ bg: "gray.100" }}
            />
            <MenuList borderRadius="12px" boxShadow="lg">
              {isLoggedIn ? (
                <>
                  <MenuItem onClick={() => navigate("/myorders")}>My Orders</MenuItem>
                  <MenuItem onClick={() => navigate("/my-returns")}>My Returns</MenuItem>
                  <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              ) : (
                <MenuItem onClick={() => navigate("/login")}>Login</MenuItem>
              )}
            </MenuList>
          </Menu>

          {/* WISHLIST */}
          <Box position="relative">
            <IconButton
              icon={<FaRegHeart />}
              borderRadius="full"
              bg="gray.50"
              _hover={{ bg: "gray.100" }}
              onClick={() => setWishlistOpen(!isWishlistOpen)}
            />
            {wishlistCount > 0 && (
              <Box
                position="absolute"
                top="-4px"
                right="-4px"
                bg="black"
                color="white"
                borderRadius="full"
                fontSize="10px"
                px="6px"
                minW="18px"
                textAlign="center"
                fontWeight="bold"
              >
                {wishlistCount}
              </Box>
            )}
          </Box>

          {/* CART */}
          <Box position="relative">
            <IconButton
              icon={<FaShoppingCart />}
              borderRadius="full"
              bg="black"
              color="white"
              _hover={{ bg: "gray.800" }}
              onClick={() => setCartOpen(!isCartOpen)}
            />
            {cartCount > 0 && (
              <Box
                position="absolute"
                top="-4px"
                right="-4px"
                bg="red.500"
                color="white"
                borderRadius="full"
                fontSize="10px"
                px="6px"
                minW="18px"
                textAlign="center"
                fontWeight="bold"
              >
                {cartCount}
              </Box>
            )}
          </Box>
        </HStack>
      </Flex>

      {/* MOBILE SEARCH */}
      <Box display={{ base: "block", md: "none" }} px={4} pb={4}>
        <HeaderSearch />
      </Box>

      <ShoppingCartDrawer isCartOpen={isCartOpen} setCartOpen={setCartOpen} />
      <WishlistDrawer isWishlistOpen={isWishlistOpen} setWishlistOpen={setWishlistOpen} />
    </Box>
  );
};

export default Header;