import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Input,
    VStack,
    HStack,
    Image,
    Text,
    Spinner,
    Button,
    InputGroup,
    InputRightElement,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { searchProducts } from "../actions/api";
import { SearchIcon } from "@chakra-ui/icons";

const HeaderSearch = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();
    const containerRef = useRef(null);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (query.trim().length > 1) {
                fetchResults();
            } else {
                setResults([]);
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [query]);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const res = await searchProducts(query);
            console.log("Search response:", res); // 👈 ADD THIS
            setResults(res.products || []);
            setShowDropdown(true);
        } catch (err) {
            console.log("Search failed");
        } finally {
            setLoading(false);
        }
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!containerRef.current?.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Redirect to products page
    const redirectToProducts = () => {
        if (!query.trim()) return;
        navigate(`/products?search=${query}`);
        setShowDropdown(false);
    };

    return (
        <Box position="relative" ref={containerRef} w="100%">
            {/* <Input
                placeholder="Search for products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && redirectToProducts()}
                bg="white"
                border="1px solid"
                borderColor="gray.300"
                _focus={{
                    borderColor: "gray.500",
                    boxShadow: "none",
                }}
                borderRadius="full"
                height="42px"
            /> */}
            <InputGroup>
                <Input
                    type="text"
                    name="search-query"
                    autoComplete="off"
                    placeholder="Search for products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && redirectToProducts()}
                    bg="gray.100"
                    border="none"
                    borderRadius="full"
                    height="48px"
                    px={6}
                    fontSize="sm"
                />

                <InputRightElement height="100%" mr={1}>
                    <SearchIcon
                        cursor="pointer"
                        color="gray.500"
                        onClick={redirectToProducts}
                        _hover={{ color: "brand.500" }}
                    />
                </InputRightElement>
            </InputGroup>

            {showDropdown && query.length > 1 && (
                <Box
                    position="absolute"
                    top="100%"
                    left="0"
                    right="0"
                    bg="white"
                    shadow="lg"
                    borderRadius="0 0 12px 12px"
                    zIndex="1000"
                    mt="2px"
                >
                    {loading ? (
                        <Box p={4} textAlign="center">
                            <Spinner size="sm" />
                        </Box>
                    ) : (
                        <VStack align="stretch" spacing={0}>
                            {results.map((product) => (
                                <HStack
                                    key={product._id}
                                    p={3}
                                    spacing={3}
                                    _hover={{ bg: "gray.100", cursor: "pointer" }}
                                    onClick={() => {
                                        navigate(`/productDetails/${product._id}`);
                                        setQuery("");
                                        setShowDropdown(false);
                                    }}
                                >
                                    <Image
                                        src={product.mainImage}
                                        boxSize="45px"
                                        objectFit="cover"
                                        borderRadius="6px"
                                    />
                                    <Box>
                                        <Text fontSize="sm" noOfLines={1}>
                                            {product.name}
                                        </Text>
                                        <Text fontSize="xs" color="gray.600">
                                            ₹{product.price}
                                        </Text>
                                    </Box>
                                </HStack>
                            ))}

                            {/* SHOW MORE BUTTON */}
                            {/* {results.length === 4 && ( */}
                            <Box p={3} borderTop="1px solid #eee">
                                <Button
                                    size="sm"
                                    width="100%"
                                    bg="brand.500"
                                    color="white"
                                    _hover={{ bg: "brand.800" }}
                                    onClick={redirectToProducts}
                                >
                                    Show more results
                                </Button>
                            </Box>
                            {/* )} */}
                        </VStack>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default HeaderSearch;