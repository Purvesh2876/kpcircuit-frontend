// // import React, { useState, useEffect } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import {
// //   Box,
// //   Flex,
// //   IconButton,
// //   Drawer,
// //   Text,
// //   DrawerOverlay,
// //   DrawerContent,
// //   DrawerCloseButton,
// //   DrawerHeader,
// //   DrawerBody,
// //   VStack,
// //   HStack,
// //   Divider,
// //   Button,
// //   Img,
// // } from "@chakra-ui/react";
// // import { HamburgerIcon } from "@chakra-ui/icons";
// // import { FaUser, FaShoppingCart, FaRegHeart } from "react-icons/fa";
// // import logo from "./logo.png";
// // import ShoppingCartDrawer from "../components/cart";
// // import WishlistDrawer from "./wishlist";

// // // ✅ IMPORT YOUR EXISTING API FUNCTIONS
// // import { getCart, getSingleUser, getWishlist } from "../actions/api";

// // const Header = () => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [isCartOpen, setCartOpen] = useState(false);
// //   const [isWishlistOpen, setWishlistOpen] = useState(false);

// //   const [cartCount, setCartCount] = useState(0);
// //   const [wishlistCount, setWishlistCount] = useState(0);

// //   const navigate = useNavigate();

// //   const handleToggle = () => setIsOpen(!isOpen);

// //   const handleClick = () => {
// //     const email = localStorage.getItem("email");
// //     if (email) {
// //       navigate("/profile");
// //     } else {
// //       navigate("/login");
// //     }
// //   };

// //   const [isLoggedIn, setIsLoggedIn] = useState(false);

// //   useEffect(() => {
// //     const checkAuth = async () => {
// //       try {
// //         const res = await getSingleUser();
// //         if (res.success === true) {
// //           setIsLoggedIn(true);
// //         } else {
// //           setIsLoggedIn(false);
// //         }
// //       } catch {
// //         setIsLoggedIn(false);
// //       }
// //     };

// //     checkAuth();
// //   }, []);


// //   const isMobile = window.innerWidth <= 768;

// //   // ✅ LOAD COUNTS
// //   const loadCounts = async () => {
// //     try {
// //       const cartRes = await getCart();
// //       const wishlistRes = await getWishlist();
// //       console.log(cartRes, wishlistRes);

// //       // 🔥 Adjust these according to your API response structure
// //       setCartCount(cartRes?.items?.length || 0);
// //       setWishlistCount(wishlistRes?.items?.length || 0);
// //     } catch (error) {
// //       console.log("Error loading header counts");
// //     }
// //   };

// //   // Load once on mount
// //   useEffect(() => {
// //     loadCounts();
// //   }, []);

// //   // Refresh when drawer opens
// //   useEffect(() => {
// //     if (isCartOpen || isWishlistOpen) {
// //       loadCounts();
// //     }
// //   }, [isCartOpen, isWishlistOpen]);

// //   return (
// //     <Flex
// //       p={4}
// //       pl={[0, 0, 10, 200]}
// //       pr={[0, 0, 10, 200]}
// //       height="100px"
// //       align="center"
// //       justifyContent="space-between"
// //     >
// //       <HStack spacing={10}>
// //         <IconButton
// //           icon={<HamburgerIcon fontSize="2xl" />}
// //           variant="ghost"
// //           onClick={handleToggle}
// //         />

// //         {/* Sidebar Drawer */}
// //         <Drawer placement="left" onClose={handleToggle} isOpen={isOpen}>
// //           <DrawerOverlay>
// //             <DrawerContent>
// //               <DrawerCloseButton />
// //               <Link to="/">
// //                 <DrawerHeader>
// //                   <Img src={logo} width="30%" />
// //                 </DrawerHeader>
// //               </Link>
// //               <Divider />
// //               <DrawerBody>
// //                 <VStack align="left" spacing={4}>
// //                   <Text
// //                     cursor="pointer"
// //                     onClick={() => {
// //                       setIsOpen(false);
// //                       navigate("/", { state: { tag: "New Drops" } });
// //                     }}
// //                   >
// //                     Featured Products
// //                   </Text>
// //                   <Divider />
// //                   <Text>All Categories</Text>
// //                   <Divider />
// //                   <Text>
// //                     <Link to="/about">ABOUT</Link>
// //                   </Text>
// //                 </VStack>
// //               </DrawerBody>
// //             </DrawerContent>
// //           </DrawerOverlay>
// //         </Drawer>

// //         <ShoppingCartDrawer
// //           isCartOpen={isCartOpen}
// //           setCartOpen={setCartOpen}
// //         />

// //         <WishlistDrawer
// //           isWishlistOpen={isWishlistOpen}
// //           setWishlistOpen={setWishlistOpen}
// //         />
// //       </HStack>

// //       {/* Center Logo */}
// //       <Box
// //         display="flex"
// //         justifyContent="center"
// //         alignItems="center"
// //         color="black"
// //         height="100px"
// //       >
// //         <Link to="/">
// //           KP {isMobile ? <br /> : " CIRCUIT CITY"}
// //         </Link>
// //       </Box>

// //       {/* Right Icons */}
// //       <Box display="flex" gap={4}>
// //         <IconButton
// //           onClick={handleClick}
// //           icon={<FaUser fontSize="2xl" />}
// //           variant="ghost"
// //         />

// //         {/* ❤️ Wishlist Icon with Badge */}
// //         <Box position="relative">
// //           <IconButton
// //             icon={<FaRegHeart fontSize="2xl" />}
// //             variant="ghost"
// //             onClick={() => setWishlistOpen(!isWishlistOpen)}
// //           />

// //           {wishlistCount > 0 && (
// //             <Box
// //               position="absolute"
// //               top="4px"
// //               right="4px"
// //               bg="red.500"
// //               color="white"
// //               borderRadius="full"
// //               fontSize="10px"
// //               px="6px"
// //               minW="18px"
// //               textAlign="center"
// //               fontWeight="bold"
// //             >
// //               {wishlistCount}
// //             </Box>
// //           )}
// //         </Box>

// //         {/* 🛒 Cart Icon with Badge */}
// //         <Box position="relative">
// //           <IconButton
// //             icon={<FaShoppingCart fontSize="2xl" />}
// //             variant="ghost"
// //             onClick={() => setCartOpen(!isCartOpen)}
// //           />

// //           {cartCount > 0 && (
// //             <Box
// //               position="absolute"
// //               top="4px"
// //               right="4px"
// //               bg="red.500"
// //               color="white"
// //               borderRadius="full"
// //               fontSize="10px"
// //               px="6px"
// //               minW="18px"
// //               textAlign="center"
// //               fontWeight="bold"
// //             >
// //               {cartCount}
// //             </Box>
// //           )}
// //         </Box>
// //       </Box>
// //     </Flex>
// //   );
// // };

// // export default Header;

// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Flex,
//   IconButton,
//   Drawer,
//   Text,
//   DrawerOverlay,
//   DrawerContent,
//   DrawerCloseButton,
//   DrawerHeader,
//   DrawerBody,
//   VStack,
//   HStack,
//   Divider,
//   Img,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
// } from "@chakra-ui/react";
// import { HamburgerIcon } from "@chakra-ui/icons";
// import { FaUser, FaShoppingCart, FaRegHeart } from "react-icons/fa";
// import logo from "./logo.png";
// import ShoppingCartDrawer from "../components/cart";
// import WishlistDrawer from "./wishlist";
// import { useLocation } from "react-router-dom";

// import {
//   getCart,
//   getSingleUser,
//   getWishlist,
//   logout,
// } from "../actions/api";

// const Header = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isCartOpen, setCartOpen] = useState(false);
//   const [isWishlistOpen, setWishlistOpen] = useState(false);

//   const [cartCount, setCartCount] = useState(0);
//   const [wishlistCount, setWishlistCount] = useState(0);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const handleToggle = () => setIsOpen(!isOpen);

//   const isMobile = window.innerWidth <= 768;

//   // 🔐 CHECK LOGIN STATUS (via cookie)
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await getSingleUser();
//         if (res.success === true) {
//           setIsLoggedIn(true);
//         } else {
//           setIsLoggedIn(false);
//         }
//       } catch {
//         setIsLoggedIn(false);
//       }
//     };

//     checkAuth();
//   }, [location.pathname]); // 👈 KEY CHANGE


//   // 🔓 Logout
//   const handleLogout = async () => {
//     try {
//       await logout();
//       setIsLoggedIn(false);
//       navigate("/login");
//     } catch (error) {
//       console.log("Logout failed");
//     }
//   };

//   // 🛒 Load Cart & Wishlist Counts
//   const loadCounts = async () => {
//     try {
//       const cartRes = await getCart();
//       const wishlistRes = await getWishlist();

//       // Adjust based on your API response structure
//       setCartCount(cartRes?.items?.length || 0);
//       setWishlistCount(wishlistRes?.items?.length || 0);
//     } catch (error) {
//       console.log("Error loading header counts");
//     }
//   };

//   useEffect(() => {
//     const handleCartUpdate = () => {
//       loadCounts();   // 👈 API RECHECK
//     };

//     const handleWishlistUpdate = () => {
//       loadCounts();   // 👈 API RECHECK
//     };

//     window.addEventListener("cartUpdated", handleCartUpdate);
//     window.addEventListener("wishlistUpdated", handleWishlistUpdate);

//     return () => {
//       window.removeEventListener("cartUpdated", handleCartUpdate);
//       window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
//     };
//   }, []);


//   useEffect(() => {
//     loadCounts();
//   }, []);

//   useEffect(() => {
//     if (isCartOpen || isWishlistOpen) {
//       loadCounts();
//     }
//   }, [isCartOpen, isWishlistOpen]);

//   return (
//     <Flex
//       p={4}
//       pl={[0, 0, 10, 200]}
//       pr={[0, 0, 10, 200]}
//       height="100px"
//       align="center"
//       justifyContent="space-between"
//     >
//       {/* LEFT SIDE */}
//       <HStack spacing={10}>
//         <IconButton
//           icon={<HamburgerIcon fontSize="2xl" />}
//           variant="ghost"
//           onClick={handleToggle}
//         />

//         {/* Sidebar Drawer */}
//         <Drawer placement="left" onClose={handleToggle} isOpen={isOpen}>
//           <DrawerOverlay>
//             <DrawerContent>
//               <DrawerCloseButton />
//               <Link to="/">
//                 <DrawerHeader>
//                   <Img src={logo} width="30%" />
//                 </DrawerHeader>
//               </Link>
//               <Divider />
//               <DrawerBody>
//                 <VStack align="left" spacing={4}>
//                   <Text
//                     cursor="pointer"
//                     onClick={() => {
//                       setIsOpen(false);
//                       navigate("/", { state: { tag: "New Drops" } });
//                     }}
//                   >
//                     Featured Products
//                   </Text>
//                   <Divider />
//                   <Text>All Categories</Text>
//                   <Divider />
//                   <Text>
//                     <Link to="/about">ABOUT</Link>
//                   </Text>
//                 </VStack>
//               </DrawerBody>
//             </DrawerContent>
//           </DrawerOverlay>
//         </Drawer>

//         <ShoppingCartDrawer
//           isCartOpen={isCartOpen}
//           setCartOpen={setCartOpen}
//         />

//         <WishlistDrawer
//           isWishlistOpen={isWishlistOpen}
//           setWishlistOpen={setWishlistOpen}
//         />
//       </HStack>

//       {/* CENTER LOGO */}
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         color="black"
//         height="100px"
//       >
//         <Link to="/">
//           KP {isMobile ? <br /> : " CIRCUIT CITY"}
//         </Link>
//       </Box>

//       {/* RIGHT SIDE */}
//       <Box display="flex" gap={4} alignItems="center">
//         {/* 👤 USER DROPDOWN */}
//         <Menu>
//           <MenuButton
//             as={IconButton}
//             icon={<FaUser fontSize="2xl" />}
//             variant="ghost"
//           />

//           <MenuList borderRadius="12px" shadow="lg">
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

//         {/* ❤️ Wishlist */}
//         <Box position="relative">
//           <IconButton
//             icon={<FaRegHeart fontSize="2xl" />}
//             variant="ghost"
//             onClick={() => setWishlistOpen(!isWishlistOpen)}
//           />

//           {wishlistCount > 0 && (
//             <Box
//               position="absolute"
//               top="4px"
//               right="4px"
//               bg="red.500"
//               color="white"
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

//         {/* 🛒 Cart */}
//         <Box position="relative">
//           <IconButton
//             icon={<FaShoppingCart fontSize="2xl" />}
//             variant="ghost"
//             onClick={() => setCartOpen(!isCartOpen)}
//           />

//           {cartCount > 0 && (
//             <Box
//               position="absolute"
//               top="4px"
//               right="4px"
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
//       </Box>
//     </Flex>
//   );
// };

// export default Header;

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

  return (
    <Box position="sticky" top="0" bg="white" zIndex="1000" borderBottom="1px solid #eee">

      {/* MAIN HEADER */}
      <Flex
        px={{ base: 4, md: 8 }}   // 🔥 Reduced side spacing
        height={{ base: "70px", md: "85px" }}
        align="center"
        justify="space-between"
      >
        {/* LEFT */}
        <HStack spacing={4}>
          <IconButton
            icon={<HamburgerIcon />}
            variant="ghost"
            onClick={handleToggle}
          />
          <Box
            fontWeight="600"
            fontSize={{ base: "lg", md: "xl" }}
            cursor="pointer"
            onClick={() => navigate("/")}
          >
            KP {isMobile ? <br /> : " CIRCUIT CITY"}
          </Box>
        </HStack>
        {/* DESKTOP SEARCH */}
        <Box
          display={{ base: "none", md: "flex" }}
          flex="1"
          justifyContent="center"
          px={6}
        >
          <Box w="100%">
            <HeaderSearch />
          </Box>
        </Box>

        {/* RIGHT */}
        <HStack spacing={3}>
          {/* USER */}
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FaUser />}
              variant="ghost"
            />
            <MenuList>
              {isLoggedIn ? (
                <>
                  <MenuItem onClick={() => navigate("/myorders")}>
                    My Orders
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </>
              ) : (
                <MenuItem onClick={() => navigate("/login")}>
                  Login
                </MenuItem>
              )}
            </MenuList>
          </Menu>

          {/* HEART */}
          <Box position="relative">
            <IconButton
              icon={<FaRegHeart />}   // 🔥 Red heart
              variant="ghost"
              onClick={() => setWishlistOpen(!isWishlistOpen)}
            />
            {wishlistCount > 0 && (
              <Box
                position="absolute"
                top="0"
                right="0"
                bg="red.500"
                color="white"        // 🔥 White text
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
              variant="ghost"
              onClick={() => setCartOpen(!isCartOpen)}
            />
            {cartCount > 0 && (
              <Box
                position="absolute"
                top="0"
                right="0"
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
      <Box display={{ base: "block", md: "none" }} px={4} pb={3}>
        <HeaderSearch />
      </Box>

      {/* DRAWER */}
      <Drawer placement="left" onClose={handleToggle} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              <Img src={logo} width="120px" />
            </DrawerHeader>
            <Divider />
            <DrawerBody>
              <VStack align="left" spacing={4}>
                <Text cursor="pointer" onClick={() => navigate("/")}>
                  Featured Products
                </Text>
                <Divider />
                <Text>All Categories</Text>
                <Divider />
                <Text onClick={() => navigate("/about")}>ABOUT</Text>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      <ShoppingCartDrawer isCartOpen={isCartOpen} setCartOpen={setCartOpen} />
      <WishlistDrawer isWishlistOpen={isWishlistOpen} setWishlistOpen={setWishlistOpen} />
    </Box>
  );
};

export default Header;