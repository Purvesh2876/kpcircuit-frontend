import React, { useEffect, useState } from "react";
import {
    Box,
    Flex,
    Image,
    Text,
    VStack,
    Heading,
    Badge,
    Center,
    Spinner,
    Container,
    Stack,
    HStack,
    Button,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { getMyReturns } from "../actions/api";

const MyReturns = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReturns = async () => {
            setLoading(true);
            try {
                const data = await getMyReturns();
                if (data.success) {
                    setReturns(data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReturns();
    }, []);

    const statusColor = (status) => {
        switch (status) {
            case "REQUESTED": return "yellow";
            case "APPROVED": return "blue";
            case "REJECTED": return "red";
            case "PICKED": return "orange";
            case "RECEIVED": return "purple";
            case "COMPLETED": return "green";
            default: return "gray";
        }
    };

    if (loading) {
        return (
            <Center h="60vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    return (
        <Container maxW="container.lg" py={10}>
            <VStack spacing={6} align="stretch">
                <Heading size="lg">My Returns & Replacements</Heading>

                {returns.length === 0 ? (
                    <Center py={10}>
                        <Text fontSize="lg" color="gray.500">You have no return requests.</Text>
                    </Center>
                ) : (
                    returns.map((req) => (
                        <Box
                            key={req._id}
                            borderWidth="1px"
                            borderRadius="lg"
                            overflow="hidden"
                            bg="white"
                            p={4}
                        >
                            <Flex justify="space-between" align="center" flexWrap="wrap" mb={4}>
                                <VStack align="start" spacing={0}>
                                    <Text fontWeight="bold">
                                        Return ID: {req._id.substring(req._id.length - 8).toUpperCase()}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        Order ID: {req.order?.orderId}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                        Requested on: {new Date(req.createdAt).toLocaleDateString("en-IN")}
                                    </Text>
                                </VStack>
                                <VStack align="end" spacing={2}>
                                    <Badge colorScheme={req.type === 'REFUND' ? 'purple' : 'teal'}>
                                        {req.type}
                                    </Badge>
                                    <Badge colorScheme={statusColor(req.status)}>
                                        {req.status}
                                    </Badge>
                                </VStack>
                            </Flex>

                            <Stack spacing={4} mb={4}>
                                {req.items.map((item, index) => (
                                    <HStack key={index} spacing={4}>
                                        <Image
                                            src={
                                                item.product?.images?.[0]
                                                    ? `/uploads/${item.product.images[0]}`
                                                    : "https://via.placeholder.com/80"
                                            }
                                            boxSize="60px"
                                            objectFit="cover"
                                            borderRadius="md"
                                        />
                                        <VStack align="start" spacing={0}>
                                            <Text fontWeight="semibold" fontSize="sm">
                                                {item.product?.name || "Product Name"}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                Qty: {item.quantity}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                ))}
                            </Stack>

                            <Flex borderTopWidth="1px" pt={4} justify="flex-end">
                                <Button
                                    as={RouterLink}
                                    to={`/return-details/${req._id}`}
                                    size="sm"
                                    colorScheme="blue"
                                >
                                    Track Status
                                </Button>
                            </Flex>
                        </Box>
                    ))
                )}
            </VStack>
        </Container>
    );
};

export default MyReturns;
