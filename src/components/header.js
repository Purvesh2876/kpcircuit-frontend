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

import logoNew from "../images/logo_new.png";
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
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
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

  return (
    <Box position="sticky" top="0" bg="white" zIndex="1000" boxShadow="0 2px 20px rgba(0,0,0,0.04)">

      {/* TOP ANNOUNCEMENT BAR */}
      <Flex
        bg="brand.500"
        color="white"
        height="36px"
        align="center"
        justify="center"
        fontSize="sm"
        fontWeight="500"
        letterSpacing="0.5px"
      >
        ✨ Premium Electronic Components | 🔒 100% Secure Payments | ✅ 100% Genuine Products
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

          <Flex align="center" cursor="pointer" onClick={() => navigate("/")}>
            <Img src={logoNew} height="60px" mr={3} />
            <Text
              fontSize="xl"
              fontWeight="700"
              letterSpacing="1px"
              color="brand.500"
              display={{ base: "none", lg: "block" }}
            >
              KP CIRCUIT CITY<Box as="span" fontWeight="300"></Box>
            </Text>
          </Flex>
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
              _hover={{ bg: "brand.100" }}
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
              _hover={{ bg: "brand.100" }}
              onClick={() => setWishlistOpen(!isWishlistOpen)}
            />
            {wishlistCount > 0 && (
              <Box
                position="absolute"
                top="-4px"
                right="-4px"
                bg="brand.500"
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
              bg="brand.500"
              color="white"
              _hover={{ bg: "brand.800" }}
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
