import React, { useEffect, useState } from "react";
import {
    Box,
    Text,
    Heading,
    Flex,
    VStack,
    Divider,
    Button,
    Spinner,
    Image,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getOrderById } from "../actions/api";

const OrderSuccessPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [secondsLeft, setSecondsLeft] = useState(15);

    // Fetch order
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // const { data } = await axios.get(
                //   `${process.env.REACT_APP_API_URL}/order/${id}`
                // );
                const data = await getOrderById(id);
                setOrder(data.order);
            } catch (error) {
                console.error("Failed to fetch order:", error);
                // navigate("/");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, navigate]);

    // Countdown + Redirect
    useEffect(() => {
        if (!order) return;

        const countdown = setInterval(() => {
            setSecondsLeft((prev) => prev - 1);
        }, 1000);

        const redirectTimer = setTimeout(() => {
            navigate("/");
        }, 15000);

        return () => {
            clearInterval(countdown);
            clearTimeout(redirectTimer);
        };
    }, [order, navigate]);

    if (loading) {
        return (
            <Flex minH="100vh" align="center" justify="center">
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (!order) return null;

    const shortOrderId = order._id.slice(-8).toUpperCase();
    const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return (
        <Box bg="#f5f1eb" minH="100vh" py={{ base: 10, md: 16 }} px={6}>
            <Box maxW="1000px" mx="auto">

                {/* Confirmation Section */}
                <VStack spacing={4} mb={14}>
                    <Text fontSize="48px">✓</Text>

                    <Heading fontWeight="600" textAlign="center">
                        Order Confirmed
                    </Heading>

                    <Text color="gray.600" textAlign="center">
                        Thank you for your purchase. Your order has been successfully placed.
                    </Text>

                    <Text fontSize="13px" color="gray.500">
                        You will be redirected to homepage in {secondsLeft}s
                    </Text>
                </VStack>

                {/* Main Card */}
                <Box bg="white" borderRadius="8px" p={{ base: 6, md: 10 }} boxShadow="sm">

                    {/* Order Info */}
                    <Flex
                        justify="space-between"
                        wrap="wrap"
                        gap={6}
                        mb={10}
                    >
                        <Box>
                            <Text fontSize="12px" color="gray.500">Order ID</Text>
                            <Text fontWeight="600">{shortOrderId}</Text>
                        </Box>

                        <Box>
                            <Text fontSize="12px" color="gray.500">Placed On</Text>
                            <Text fontWeight="600">{formattedDate}</Text>
                        </Box>

                        <Box>
                            <Text fontSize="12px" color="gray.500">Payment Status</Text>
                            <Text fontWeight="600" color="green.600">
                                {order.paymentStatus}
                            </Text>
                        </Box>

                        <Box>
                            <Text fontSize="12px" color="gray.500">Order Status</Text>
                            <Text fontWeight="600">
                                {order.orderStatus}
                            </Text>
                        </Box>
                    </Flex>

                    <Divider mb={8} />

                    {/* Shipping Address */}
                    <Box mb={10}>
                        <Text fontWeight="600" mb={3}>
                            Shipping Address
                        </Text>

                        <Text fontSize="14px">
                            {order.shippingInfo.name}
                        </Text>
                        <Text fontSize="14px">
                            {order.shippingInfo.address}
                        </Text>
                        <Text fontSize="14px">
                            {order.shippingInfo.city} - {order.shippingInfo.pincode}
                        </Text>
                    </Box>

                    <Divider mb={8} />

                    {/* Items */}
                    <Box mb={10}>
                        <Text fontWeight="600" mb={5}>
                            Order Items
                        </Text>

                        {order.items.map((item) => (
                            <Flex
                                key={item._id}
                                justify="space-between"
                                align="center"
                                mb={6}
                                wrap="wrap"
                                gap={4}
                            >
                                <Flex align="center" gap={4}>
                                    <Image
                                        src={`/uploads${item.product.images?.[0]}`}
                                        boxSize="60px"
                                        objectFit="cover"
                                        borderRadius="6px"
                                    />

                                    <Box>
                                        <Text fontWeight="500">
                                            {item.product.name}
                                        </Text>
                                        <Text fontSize="13px" color="gray.500">
                                            Qty: {item.quantity}
                                        </Text>
                                    </Box>
                                </Flex>

                                <Text fontWeight="500">
                                    ₹ {item.totalPrice}
                                </Text>
                            </Flex>
                        ))}
                    </Box>

                    <Divider mb={6} />

                    {/* Total */}
                    <Flex justify="space-between" mb={2}>
                        <Text>Subtotal</Text>
                        <Text>₹ {order.totalAmount}</Text>
                    </Flex>

                    <Flex justify="space-between" mb={6}>
                        <Text>Shipping</Text>
                        <Text>Free</Text>
                    </Flex>

                    <Divider mb={6} />

                    <Flex justify="space-between">
                        <Text fontWeight="600" fontSize="18px">
                            Total Paid
                        </Text>
                        <Text fontWeight="700" fontSize="18px">
                            ₹ {order.totalAmount}
                        </Text>
                    </Flex>

                    {/* Continue Button */}
                    <Button
                        mt={10}
                        w="100%"
                        h="50px"
                        bg="#8b2c24"
                        color="white"
                        borderRadius="4px"
                        _hover={{ bg: "#74231d" }}
                        onClick={() => navigate("/")}
                    >
                        Continue Shopping
                    </Button>

                </Box>
            </Box>
        </Box>
    );
};

export default OrderSuccessPage;