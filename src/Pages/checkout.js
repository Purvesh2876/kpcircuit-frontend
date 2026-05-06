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
    Spinner,
    SimpleGrid,
    IconButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCart, removeFromCart, createOrder, getSingleUser, saveAddress, deleteAddress } from "../actions/api";
import { useCustomToast } from "../hooks/useCustomToast";

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
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [savingAddress, setSavingAddress] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        pincode: "",
    });

    const toast = useCustomToast();
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

    /* -------------------- FETCH SAVED ADDRESSES -------------------- */
    const fetchSavedAddresses = async () => {
        try {
            const res = await getSingleUser();
            if (res.success) {
                setSavedAddresses(res.data.savedAddresses || []);
            }
        } catch { }
    };

    useEffect(() => {
        fetchCart();
        fetchSavedAddresses();
    }, []);

    /* -------------------- REMOVE CART ITEM -------------------- */
    const handleRemove = async (productId) => {
        try {
            await removeFromCart(productId);
            await fetchCart();
            window.dispatchEvent(new Event("cartUpdated"));
        } catch {
            toast({ title: "Failed to remove item", status: "error", duration: 3000 });
        }
    };

    /* -------------------- HANDLE INPUT -------------------- */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setSelectedAddressId(null);
    };

    /* -------------------- USE SAVED ADDRESS -------------------- */
    const handleSelectAddress = (addr) => {
        setFormData({
            firstName: addr.firstName || "",
            lastName: addr.lastName || "",
            phone: addr.phone || "",
            email: addr.email || "",
            address: addr.address || "",
            city: addr.city || "",
            pincode: addr.pincode || "",
        });
        setSelectedAddressId(addr._id);
    };

    /* -------------------- SAVE CURRENT ADDRESS -------------------- */
    const handleSaveAddress = async () => {
        const { firstName, phone, email, address, city, pincode } = formData;
        if (!firstName || !phone || !email || !address || !city || !pincode) {
            return toast({ title: "Fill all fields before saving", status: "warning", duration: 3000 });
        }
        setSavingAddress(true);
        try {
            const res = await saveAddress(formData);
            setSavedAddresses(res.data);
            setSelectedAddressId(null);
            setFormData({ firstName: "", lastName: "", phone: "", email: "", address: "", city: "", pincode: "" });
            toast({ title: "Address saved", status: "success", duration: 3000 });
        } catch (error) {
            toast({
                title: error.response?.data?.message || "Could not save address",
                status: "error",
                duration: 3000,
            });
        } finally {
            setSavingAddress(false);
        }
    };

    /* -------------------- DELETE SAVED ADDRESS -------------------- */
    const handleDeleteAddress = async (addressId) => {
        try {
            const res = await deleteAddress(addressId);
            setSavedAddresses(res.data);
            if (selectedAddressId === addressId) setSelectedAddressId(null);
            toast({ title: "Address removed", status: "success", duration: 2000 });
        } catch {
            toast({ title: "Could not remove address", status: "error", duration: 3000 });
        }
    };

    /* -------------------- VALIDATION -------------------- */
    const validateForm = () => {
        const { phone, email, address, city, pincode } = formData;
        if (!phone || !email || !address || !city || !pincode) {
            toast({ title: "Please fill all billing details", status: "warning", duration: 3000 });
            return false;
        }
        if (!/^\d{10}$/.test(phone)) {
            toast({ title: "Invalid phone number", status: "warning" });
            return false;
        }
        if (!/^\d{6}$/.test(pincode)) {
            toast({ title: "Invalid pincode", status: "warning" });
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

        const sdkLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
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
                key: `${process.env.REACT_APP_RAZORPAY_KEY_ID}`,
                amount: data.razorpayOrder.amount,
                currency: "INR",
                name: "KP Circuit City",
                order_id: data.razorpayOrder.id,

                handler: async function (response) {
                    try {
                        const verifyResponse = await axios.post(
                            `${process.env.REACT_APP_API_URL}/order/verify`,
                            response,
                            { withCredentials: true }
                        );
                        toast({ title: "Payment Successful", status: "success", duration: 4000 });
                        const orderId = verifyResponse.data.orderId;
                        window.dispatchEvent(new Event("cartUpdated"));
                        navigate(`/order-success/${orderId}`);
                    } catch {
                        toast({ title: "Payment verification failed", status: "error" });
                    }
                },

                prefill: {
                    name: formData.firstName + " " + formData.lastName,
                    email: formData.email,
                    contact: formData.phone,
                },

                theme: { color: "#004d3d" },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            paymentObject.on("payment.failed", function () {
                toast({ title: "Payment Failed", status: "error", duration: 4000 });
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
        <Box bg="gray.50" minH="100vh">
            <Box maxW="1280px" mx="auto" px={{ base: 5, md: 10 }} py={{ base: 10, md: 16 }}>
                <Flex direction={{ base: "column", lg: "row" }} align="flex-start" gap={{ base: 14, lg: 20 }}>

                    {/* ================= LEFT SIDE — BILLING ================= */}
                    <Box flex="1.6" w="100%">
                        <Text fontSize="20px" fontWeight="600" letterSpacing="1px" mb={8}>
                            BILLING DETAILS
                        </Text>

                        {/* ---- SAVED ADDRESSES ---- */}
                        {savedAddresses.length > 0 && (
                            <Box mb={8}>
                                <Text fontSize="13px" fontWeight="600" color="gray.500" letterSpacing="0.5px" mb={4}>
                                    SAVED ADDRESSES
                                </Text>
                                <SimpleGrid columns={{ base: 1, md: savedAddresses.length > 1 ? 2 : 1 }} spacing={3}>
                                    {savedAddresses.map((addr) => {
                                        const isSelected = selectedAddressId === addr._id;
                                        return (
                                            <Box
                                                key={addr._id}
                                                border="1.5px solid"
                                                borderColor={isSelected ? "brand.500" : "#d8d3cc"}
                                                borderRadius="6px"
                                                p={4}
                                                bg={isSelected ? "brand.50" : "white"}
                                                cursor="pointer"
                                                position="relative"
                                                onClick={() => handleSelectAddress(addr)}
                                                _hover={{ borderColor: "brand.400" }}
                                                transition="all 0.15s"
                                            >
                                                <IconButton
                                                    icon={<DeleteIcon />}
                                                    size="xs"
                                                    variant="ghost"
                                                    colorScheme="red"
                                                    position="absolute"
                                                    top={2}
                                                    right={2}
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr._id); }}
                                                    aria-label="Remove address"
                                                />
                                                <Text fontWeight="600" fontSize="14px" mb={1} pr={6}>
                                                    {addr.firstName} {addr.lastName}
                                                </Text>
                                                <Text fontSize="13px" color="gray.600">{addr.address}</Text>
                                                <Text fontSize="13px" color="gray.600">{addr.city} — {addr.pincode}</Text>
                                                <Text fontSize="13px" color="gray.500" mt={1}>{addr.phone}</Text>
                                                {isSelected && (
                                                    <Text fontSize="12px" color="brand.500" fontWeight="600" mt={2}>
                                                        ✓ Selected
                                                    </Text>
                                                )}
                                            </Box>
                                        );
                                    })}
                                </SimpleGrid>
                                <Divider mt={6} mb={6} borderColor="#e6e1da" />
                                <Text fontSize="13px" fontWeight="600" color="gray.500" letterSpacing="0.5px" mb={4}>
                                    OR ENTER A DIFFERENT ADDRESS
                                </Text>
                            </Box>
                        )}

                        {/* ---- BILLING FORM ---- */}
                        <VStack spacing={4} align="stretch">
                            <Flex gap={6} direction={{ base: "column", md: "row" }}>
                                <Box flex="1">
                                    <Text fontSize="13px" fontWeight="500" mb={2}>First Name *</Text>
                                    <Input
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        bg="white" h="50px"
                                        border="1px solid #d8d3cc" borderRadius="4px"
                                        _hover={{ borderColor: "#bfb8ae" }}
                                        _focus={{ borderColor: "brand.500", boxShadow: "none" }}
                                    />
                                </Box>
                                <Box flex="1">
                                    <Text fontSize="13px" fontWeight="500" mb={2}>Last Name</Text>
                                    <Input
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        bg="white" h="50px"
                                        border="1px solid #d8d3cc" borderRadius="4px"
                                        _hover={{ borderColor: "#bfb8ae" }}
                                        _focus={{ borderColor: "brand.500", boxShadow: "none" }}
                                    />
                                </Box>
                            </Flex>

                            <Flex gap={6} direction={{ base: "column", md: "row" }}>
                                <Box flex="1">
                                    <Text fontSize="13px" fontWeight="500" mb={2}>Phone *</Text>
                                    <Input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        bg="white" h="50px"
                                        border="1px solid #d8d3cc" borderRadius="4px"
                                        _hover={{ borderColor: "#bfb8ae" }}
                                        _focus={{ borderColor: "brand.500", boxShadow: "none" }}
                                    />
                                </Box>
                                <Box flex="1">
                                    <Text fontSize="13px" fontWeight="500" mb={2}>Email *</Text>
                                    <Input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        bg="white" h="50px"
                                        border="1px solid #d8d3cc" borderRadius="4px"
                                        _hover={{ borderColor: "#bfb8ae" }}
                                        _focus={{ borderColor: "brand.500", boxShadow: "none" }}
                                    />
                                </Box>
                            </Flex>

                            <Box>
                                <Text fontSize="13px" fontWeight="500" mb={2}>Street Address *</Text>
                                <Input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    bg="white" h="50px"
                                    border="1px solid #d8d3cc" borderRadius="4px"
                                    _hover={{ borderColor: "#bfb8ae" }}
                                    _focus={{ borderColor: "#000", boxShadow: "none" }}
                                />
                            </Box>

                            <Flex gap={6} direction={{ base: "column", md: "row" }}>
                                <Box flex="1">
                                    <Text fontSize="13px" fontWeight="500" mb={2}>City *</Text>
                                    <Input
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        bg="white" h="50px"
                                        border="1px solid #d8d3cc" borderRadius="4px"
                                        _hover={{ borderColor: "#bfb8ae" }}
                                        _focus={{ borderColor: "brand.500", boxShadow: "none" }}
                                    />
                                </Box>
                                <Box flex="1">
                                    <Text fontSize="13px" fontWeight="500" mb={2}>PIN Code *</Text>
                                    <Input
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        bg="white" h="50px"
                                        border="1px solid #d8d3cc" borderRadius="4px"
                                        _hover={{ borderColor: "#bfb8ae" }}
                                        _focus={{ borderColor: "brand.500", boxShadow: "none" }}
                                    />
                                </Box>
                            </Flex>

                            {/* ---- SAVE ADDRESS BUTTON ---- */}
                            {savedAddresses.length < 3 && (
                                <Box pt={2}>
                                    <Button
                                        variant="outline"
                                        colorScheme="brand"
                                        size="sm"
                                        borderRadius="4px"
                                        isLoading={savingAddress}
                                        loadingText="Saving..."
                                        onClick={handleSaveAddress}
                                    >
                                        + Save this address
                                    </Button>
                                    <Text fontSize="11px" color="gray.400" mt={1}>
                                        {3 - savedAddresses.length} slot{3 - savedAddresses.length !== 1 ? "s" : ""} remaining
                                    </Text>
                                </Box>
                            )}
                        </VStack>
                    </Box>

                    {/* ================= RIGHT SIDE — ORDER SUMMARY ================= */}
                    <Box
                        flex="1" w="100%"
                        bg="brand.50" borderRadius="6px"
                        px={{ base: 6, md: 8 }} py={{ base: 8, md: 10 }}
                    >
                        <Text textAlign="center" fontWeight="600" mb={8} letterSpacing="1px">
                            YOUR ORDER
                        </Text>

                        <Box bg="white" borderRadius="4px" p={6}>
                            <Flex justify="space-between" fontSize="13px" fontWeight="600" pb={3} borderBottom="1px solid #e6e1da">
                                <Text>PRODUCT</Text>
                                <Text>SUBTOTAL</Text>
                            </Flex>

                            {cartItems.map((item) => (
                                <Flex key={item.product._id} justify="space-between" align="center" py={4} borderBottom="1px solid #eee">
                                    <Flex align="center" gap={4}>
                                        <Image
                                            src={`/uploads${item.product.images[0]}`}
                                            boxSize="52px" borderRadius="4px" objectFit="cover"
                                        />
                                        <Box>
                                            <Text fontSize="14px" fontWeight="500">{item.product.name}</Text>
                                            <Text fontSize="12px" color="gray.500">Qty: {item.quantity}</Text>
                                        </Box>
                                    </Flex>
                                    <Flex align="center" gap={3}>
                                        <Text fontSize="14px">₹ {item.priceAtAdd}</Text>
                                        <DeleteIcon
                                            fontSize="13px" cursor="pointer" color="#b3aaa0"
                                            _hover={{ color: "#000" }}
                                            onClick={() => handleRemove(item.product._id)}
                                        />
                                    </Flex>
                                </Flex>
                            ))}

                            <Box pt={6}>
                                <Flex justify="space-between" mb={3}>
                                    <Text fontSize="14px">Subtotal</Text>
                                    <Text fontSize="14px">₹ {cartTotal}</Text>
                                </Flex>
                                <Flex justify="space-between" mb={4}>
                                    <Text fontSize="14px">Shipping</Text>
                                    <Text fontSize="14px">Free shipping</Text>
                                </Flex>
                                <Divider borderColor="#e6e1da" mb={4} />
                                <Flex justify="space-between" mb={8}>
                                    <Text fontWeight="600">Total</Text>
                                    <Text fontWeight="700" fontSize="18px">₹ {cartTotal}</Text>
                                </Flex>

                                <Button
                                    w="100%" h="50px"
                                    bg="brand.500" color="white"
                                    borderRadius="4px" _hover={{ bg: "brand.800" }}
                                    onClick={handlePayment}
                                    isLoading={processing}
                                    isDisabled={cartItems.length === 0}
                                >
                                    Place Order
                                </Button>

                                <Text fontSize="12px" textAlign="center" mt={4} color="#6f665c">
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
