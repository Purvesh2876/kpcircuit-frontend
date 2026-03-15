import React, { useEffect, useState } from "react";
import {
    Box,
    Flex,
    Heading,
    Input,
    VStack,
    Text,
    Button,
    Divider,
    Image,
    HStack,
    useToast,
    Spinner
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCart, removeFromCart, createOrder } from "../actions/api";

/* -------------------- LOAD RAZORPAY SCRIPT -------------------- */
function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        pincode: "",
    });

    const toast = useToast();
    const navigate = useNavigate();

    /* -------------------- FETCH CART -------------------- */
    const fetchCart = async () => {
        try {
            const response = await getCart();
            setCartItems(response.items);
            setCartTotal(response.totalPrice);
        } catch (error) {
            toast({
                title: error.response?.data?.message || "Failed to load cart",
                status: "error",
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    /* -------------------- REMOVE ITEM -------------------- */
    const handleRemove = async (productId) => {
        try {
            await removeFromCart(productId);
            await fetchCart();

            window.dispatchEvent(new Event("cartUpdated"));
        } catch {
            toast({
                title: "Failed to remove item",
                status: "error",
                duration: 3000,
            });
        }
    };

    /* -------------------- HANDLE INPUT -------------------- */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /* -------------------- VALIDATION -------------------- */
    const validateForm = () => {
        const { name, phone, email, address, city, pincode } = formData;
        console.log(formData);
        if (!phone || !email || !address || !city || !pincode) {
            toast({
                title: "Please fill all billing details",
                status: "warning",
                duration: 3000,
            });
            return false;
        }

        if (!/^\d{10}$/.test(phone)) {
            toast({
                title: "Invalid phone number",
                status: "warning",
            });
            return false;
        }

        if (!/^\d{6}$/.test(pincode)) {
            toast({
                title: "Invalid pincode",
                status: "warning",
            });
            return false;
        }

        return true;
    };

    /* -------------------- HANDLE PAYMENT -------------------- */
    const handlePayment = async () => {
        if (processing) return;
        if (!validateForm()) return;
        if (cartItems.length === 0) return;

        setProcessing(true);

        const sdkLoaded = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!sdkLoaded) {
            toast({ title: "Payment SDK failed to load", status: "error" });
            setProcessing(false);
            return;
        }

        const shippingInfo = {
            name: formData.firstName + " " + formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            pincode: formData.pincode,
        };

        console.log("Shipping Info:", shippingInfo);

        const orderItems = cartItems.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
            priceAtAdd: item.priceAtAdd,
        }));

        const orderData = {
            amount: cartTotal,
            currency: "INR",
            shippingInfo,
            items: orderItems,
        };

        try {
            const data = await createOrder(orderData);
            const options = {
                key: `${process.env.REACT_APP_RAZORPAY_KEY_ID}`, // 🔴 change to live in production
                amount: data.razorpayOrder.amount,
                currency: "INR",
                name: "Nisarg Ecomm",
                order_id: data.razorpayOrder.id,

                handler: async function (response) {
                    try {
                        const verifyResponse = await axios.post(
                            `${process.env.REACT_APP_API_URL}/order/verify`,
                            response
                        );

                        toast({
                            title: "Payment Successful",
                            status: "success",
                            duration: 4000,
                        });
                        const orderId = verifyResponse.data.orderId;
                        window.dispatchEvent(new Event("cartUpdated"));

                        navigate(`/order-success/${orderId}`);
                    } catch (error) {
                        toast({
                            title: "Payment verification failed",
                            status: "error",
                        });
                    }
                },

                prefill: {
                    name: formData.firstName + " " + formData.lastName,
                    email: formData.email,
                    contact: formData.phone,
                },

                theme: { color: "#000000" },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

            paymentObject.on("payment.failed", function () {
                toast({
                    title: "Payment Failed",
                    status: "error",
                    duration: 4000
                });
            });

        } catch (error) {
            toast({
                title: error.response?.data?.message || "Order Failed",
                status: "error",
            });
        }

        setProcessing(false);
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" minH="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    return (
        <Box bg="#f5f1eb" minH="100vh">
            <Box
                maxW="1280px"
                mx="auto"
                px={{ base: 5, md: 10 }}
                py={{ base: 10, md: 16 }}
            >
                <Flex
                    direction={{ base: "column", lg: "row" }}
                    align="flex-start"
                    gap={{ base: 14, lg: 20 }}
                >
                    {/* ================= LEFT SIDE — BILLING ================= */}
                    <Box flex="1.6" w="100%">
                        <Text
                            fontSize="20px"
                            fontWeight="600"
                            letterSpacing="1px"
                            mb={10}
                        >
                            BILLING DETAILS
                        </Text>

                        <VStack spacing={4} align="stretch">
                            {/* Row 1 */}
                            <Flex gap={6} direction={{ base: "column", md: "row" }}>
                                <Box flex="1">
                                    <Text fontSize="13px" fontWeight="500" mb={2}>
                                        First Name *
                                    </Text>
                                    <Input
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        bg="white"
                                        h="50px"
                                        border="1px solid #d8d3cc"
                                        borderRadius="4px"
                                        _hover={{ borderColor: "#bfb8ae" }}
                                        _focus={{
                                            borderColor: "#000",
                                            boxShadow: "none",
                                        }}
                                    />
                                </Box>

                                <Box flex="1">
                                    <Text fontSize="13px" fontWeight="500" mb={2}>
                                        Last Name *
                                    </Text>
                                    <Input
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        bg="white"
                                        h="50px"
                                        border="1px solid #d8d3cc"
                                        borderRadius="4px"
                                        _hover={{ borderColor: "#bfb8ae" }}
                                        _focus={{
                                            borderColor: "#000",
                                            boxShadow: "none",
                                        }}
                                    />
                                </Box>
                            </Flex>

                            {/* Row 2 */}
                            <Flex gap={6} direction={{ base: "column", md: "row" }}>
                                <Box flex="1">
                                    <Text fontSize="13px" fontWeight="500" mb={2}>
                                        Phone *
                                    </Text>
                                    <Input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        bg="white"
                                        h="50px"
                                        border="1px solid #d8d3cc"
                                        borderRadius="4px"
                                        _hover={{ borderColor: "#bfb8ae" }}
                                        _focus={{
                                            borderColor: "#000",
                                            boxShadow: "none",
                                        }}
                                    />
                                </Box>

                                <Box flex="1">
                                    <Text fontSize="13px" fontWeight="500" mb={2}>
                                        Email *
                                    </Text>
                                    <Input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        bg="white"
                                        h="50px"
                                        border="1px solid #d8d3cc"
                                        borderRadius="4px"
                                        _hover={{ borderColor: "#bfb8ae" }}
                                        _focus={{
                                            borderColor: "#000",
                                            boxShadow: "none",
                                        }}
                                    />
                                </Box>
                            </Flex>

                            {/* Address */}
                            <Box>
                                <Text fontSize="13px" fontWeight="500" mb={2}>
                                    Street Address *
                                </Text>
                                <Input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    bg="white"
                                    h="50px"
                                    border="1px solid #d8d3cc"
                                    borderRadius="4px"
                                    _hover={{ borderColor: "#bfb8ae" }}
                                    _focus={{
                                        borderColor: "#000",
                                        boxShadow: "none",
                                    }}
                                />
                            </Box>

                            {/* Row 3 */}
                            <Flex gap={6} direction={{ base: "column", md: "row" }}>
                                <Box flex="1">
                                    <Text fontSize="13px" fontWeight="500" mb={2}>
                                        City *
                                    </Text>
                                    <Input
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        bg="white"
                                        h="50px"
                                        border="1px solid #d8d3cc"
                                        borderRadius="4px"
                                        _hover={{ borderColor: "#bfb8ae" }}
                                        _focus={{
                                            borderColor: "#000",
                                            boxShadow: "none",
                                        }}
                                    />
                                </Box>

                                <Box flex="1">
                                    <Text fontSize="13px" fontWeight="500" mb={2}>
                                        PIN Code *
                                    </Text>
                                    <Input
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        bg="white"
                                        h="50px"
                                        border="1px solid #d8d3cc"
                                        borderRadius="4px"
                                        _hover={{ borderColor: "#bfb8ae" }}
                                        _focus={{
                                            borderColor: "#000",
                                            boxShadow: "none",
                                        }}
                                    />
                                </Box>
                            </Flex>
                        </VStack>
                    </Box>

                    {/* ================= RIGHT SIDE — ORDER SUMMARY ================= */}
                    <Box
                        flex="1"
                        w="100%"
                        bg="#e9dfd2"
                        borderRadius="6px"
                        px={{ base: 6, md: 8 }}
                        py={{ base: 8, md: 10 }}
                    >
                        <Text
                            textAlign="center"
                            fontWeight="600"
                            mb={8}
                            letterSpacing="1px"
                        >
                            YOUR ORDER
                        </Text>

                        <Box bg="white" borderRadius="4px" p={6}>
                            {/* Header */}
                            <Flex
                                justify="space-between"
                                fontSize="13px"
                                fontWeight="600"
                                pb={3}
                                borderBottom="1px solid #e6e1da"
                            >
                                <Text>PRODUCT</Text>
                                <Text>SUBTOTAL</Text>
                            </Flex>

                            {/* Items */}
                            {cartItems.map((item) => (
                                <Flex
                                    key={item.product._id}
                                    justify="space-between"
                                    align="center"
                                    py={4}
                                    borderBottom="1px solid #eee"
                                >
                                    <Flex align="center" gap={4}>
                                        <Image
                                            src={`/uploads${item.product.images[0]}`}
                                            boxSize="52px"
                                            borderRadius="4px"
                                            objectFit="cover"
                                        />

                                        <Box>
                                            <Text fontSize="14px" fontWeight="500">
                                                {item.product.name}
                                            </Text>
                                            <Text fontSize="12px" color="gray.500">
                                                Qty: {item.quantity}
                                            </Text>
                                        </Box>
                                    </Flex>

                                    <Flex align="center" gap={3}>
                                        <Text fontSize="14px">
                                            ₹ {item.priceAtAdd}
                                        </Text>

                                        <DeleteIcon
                                            fontSize="13px"
                                            cursor="pointer"
                                            color="#b3aaa0"
                                            _hover={{ color: "#000" }}
                                            onClick={() =>
                                                handleRemove(item.product._id)
                                            }
                                        />
                                    </Flex>
                                </Flex>
                            ))}

                            {/* Totals */}
                            <Box pt={6}>
                                <Flex justify="space-between" mb={3}>
                                    <Text fontSize="14px">Subtotal</Text>
                                    <Text fontSize="14px">
                                        ₹ {cartTotal}
                                    </Text>
                                </Flex>

                                <Flex justify="space-between" mb={4}>
                                    <Text fontSize="14px">Shipping</Text>
                                    <Text fontSize="14px">
                                        Free shipping
                                    </Text>
                                </Flex>

                                <Divider borderColor="#e6e1da" mb={4} />

                                <Flex justify="space-between" mb={8}>
                                    <Text fontWeight="600">Total</Text>
                                    <Text fontWeight="700" fontSize="18px">
                                        ₹ {cartTotal}
                                    </Text>
                                </Flex>

                                <Button
                                    w="100%"
                                    h="50px"
                                    bg="#8b2c24"
                                    color="white"
                                    borderRadius="4px"
                                    _hover={{ bg: "#74231d" }}
                                    onClick={handlePayment}
                                    isLoading={processing}
                                    isDisabled={cartItems.length === 0}
                                >
                                    Place Order
                                </Button>

                                <Text
                                    fontSize="12px"
                                    textAlign="center"
                                    mt={4}
                                    color="#6f665c"
                                >
                                    Secure payment powered by Razorpay
                                </Text>
                            </Box>
                        </Box>
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
};

export default CheckoutPage;