// pages/SubCategoryList.jsx
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
  Skeleton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { getSubCategoriesByCategory } from "../actions/api";

const SubCategoryList = () => {
  const { categoryId } = useParams(); // We need this to pass to the next page
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubCategories = async () => {
      setLoading(true);
      try {
        const res = await getSubCategoriesByCategory(categoryId);
        setSubCategories(res || []);
      } catch (error) {
        console.error("Error fetching subcategories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubCategories();
  }, [categoryId]);

  // return (
  //   <Box p={{ base: 4, md: 8 }} maxW="1400px" mx="auto">

  //     {/* Breadcrumb for better navigation */}
  //     <Breadcrumb mb={6} fontSize="sm" color="gray.600">
  //       <BreadcrumbItem>
  //         <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
  //       </BreadcrumbItem>
  //       <BreadcrumbItem isCurrentPage>
  //         <BreadcrumbLink>Subcategories</BreadcrumbLink>
  //       </BreadcrumbItem>
  //     </Breadcrumb>

  //     <Heading mb={8} fontFamily="'Quicksand', sans-serif" textAlign="center">
  //       Select a Sub-Category
  //     </Heading>

  //     <SimpleGrid columns={[1, 2, 3, 4]} spacing={8}>
  //       {loading ? (
  //          [1, 2, 3, 4].map((i) => <Skeleton key={i} height="200px" borderRadius="25px" />)
  //       ) : (
  //         subCategories.map((sub) => (
  //           // --- THE KEY CHANGE IS HERE ---
  //           <Link 
  //             key={sub._id} 
  //             to="/products"
  //             state={{ 
  //               // We pass these values to the AllProducts page
  //               preSelectedCategory: categoryId, 
  //               preSelectedSubCategory: sub._id 
  //             }}
  //           >
  //             <Card
  //               shadow="none"
  //               borderRadius="25px"
  //               border="1px solid"
  //               borderColor="gray.100"
  //               transition="all 0.3s ease"
  //               _hover={{ transform: "translateY(-5px)", shadow: "lg" }}
  //               cursor="pointer"
  //             >
  //               <CardBody p={0} borderRadius="25px">
  //                 <Box p={4} pb={0} h="180px" overflow="hidden" position="relative">
  //                   <Image
  //                     src={`/uploads${sub.image}`} // http://76.13.247.39:5000
  //                     h="100%"
  //                     w="100%"
  //                     objectFit="contain"
  //                     alt={sub.name}
  //                     transition="0.3s"
  //                     _hover={{ transform: "scale(1.05)" }}
  //                   />
  //                 </Box>
  //                 <Stack p={4} align="center">
  //                   <Text fontWeight="600" fontSize="lg" fontFamily="'Quicksand', sans-serif">
  //                     {sub.name}
  //                   </Text>
  //                 </Stack>
  //               </CardBody>
  //             </Card>
  //           </Link>
  //         ))
  //       )}
  //     </SimpleGrid>
  //   </Box>
  // );

  return (
    <Box px={{ base: 4, md: 12 }} py={{ base: 8, md: 14 }} maxW="1400px" mx="auto">

      {/* BREADCRUMB */}
      <Breadcrumb mb={10} fontSize="sm" color="gray.500">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink color="black" fontWeight="600">
            Subcategories
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* PAGE TITLE */}
      <Box mb={14}>
        <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700">
          Choose Your Sub-Category
        </Text>
        <Text color="gray.500" mt={2}>
          Explore refined collections tailored to your needs
        </Text>
      </Box>

      {/* GRID */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8}>

        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height="260px" borderRadius="28px" />
          ))
        ) : (
          subCategories.map((sub) => (
            <Link
              key={sub._id}
              to="/products"
              state={{
                preSelectedCategory: categoryId,
                preSelectedSubCategory: sub._id
              }}
            >
              <Box
                position="relative"
                borderRadius="28px"
                overflow="hidden"
                cursor="pointer"
                role="group"
                h="260px"
                transition="all 0.4s ease"
                _hover={{
                  transform: "translateY(-6px)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.08)"
                }}
              >
                {/* IMAGE */}
                <Image
                  src={`/uploads${sub.image}`}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  transition="all 0.6s ease"
                  _groupHover={{
                    transform: "scale(1.08)"
                  }}
                />

                {/* DARK OVERLAY */}
                <Box
                  position="absolute"
                  inset="0"
                  bg="rgba(0,0,0,0.35)"
                  transition="all 0.3s ease"
                  _groupHover={{
                    bg: "rgba(0,0,0,0.55)"
                  }}
                />

                {/* TEXT CONTENT */}
                <Box
                  position="absolute"
                  bottom="30px"
                  left="30px"
                  color="white"
                >
                  <Text fontSize="xl" fontWeight="700">
                    {sub.name}
                  </Text>
                  <Text fontSize="sm" opacity="0.85">
                    Shop Now →
                  </Text>
                </Box>
              </Box>
            </Link>
          ))
        )}
      </SimpleGrid>
    </Box>
  );
};

export default SubCategoryList;