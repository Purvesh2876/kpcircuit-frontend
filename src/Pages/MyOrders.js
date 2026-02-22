import React, { useEffect, useState } from "react";
import {
    Box,
    Flex,
    Image,
    Text,
    VStack,
    Heading,
    Badge,
    Icon,
    Divider,
    Center,
    Spinner,
    Container,
    Stack,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    HStack,
    Button,
    InputGroup,
    InputLeftElement,
    Input,
} from "@chakra-ui/react";
import {
    MdChevronRight,
    MdLocalShipping,
    MdPayment,
    MdSearch,
} from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";
import { getMyOrders } from "../actions/api";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();

    const ordersPerPage = 5;

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const { data } = await getMyOrders(
                    currentPage,
                    ordersPerPage,
                    searchTerm
                );

                if (data.success) {
                    setOrders(data.orders);
                    setTotalPages(data.pagination.totalPages);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchOrders, 400);
        return () => clearTimeout(debounce);
    }, [currentPage, searchTerm]);

    const statusColor = (status) => {
        switch (status) {
            case "placed":
                return "gray";
            case "packed":
                return "orange";
            case "shipped":
                return "blue";
            case "delivered":
                return "green";
            case "cancelled":
                return "red";
            default:
                return "gray";
        }
    };

    if (loading)
        return (
            <Center h="60vh">
                <Spinner size="xl" />
            </Center>
        );

    return (
        <Container maxW="container.lg" py={10}>
            <VStack spacing={6} align="stretch">
                <Flex justify="space-between" align="center">
                    <Heading size="lg">My Orders</Heading>

                    <InputGroup maxW="250px">
                        <InputLeftElement pointerEvents="none">
                            <Icon as={MdSearch} color="gray.400" />
                        </InputLeftElement>
                        <Input
                            placeholder="Search by Order ID..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </InputGroup>
                </Flex>

                {orders.map((order) => (
                    <Box
                        key={order._id}
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        bg="white"
                    >
                        {/* Header */}
                        <Flex
                            bg="gray.50"
                            p={4}
                            justify="space-between"
                            align="center"
                            flexWrap="wrap"
                        >
                            <VStack align="start" spacing={0}>
                                <Text fontSize="sm">
                                    Order ID: <b>{order.orderId}</b>
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                </Text>
                            </VStack>

                            <VStack align="end" spacing={1}>
                                <Badge colorScheme={statusColor(order.orderStatus)}>
                                    {order.orderStatus.toUpperCase()}
                                </Badge>

                                <Badge
                                    colorScheme={
                                        order.paymentStatus === "paid" ? "green" : "red"
                                    }
                                >
                                    {order.paymentStatus.toUpperCase()}
                                </Badge>
                            </VStack>
                        </Flex>

                        {/* Items */}
                        <Box p={4}>
                            <Stack spacing={4}>
                                {order.items.map((item, index) => (
                                    <Flex
                                        key={index}
                                        justify="space-between"
                                        align="center"
                                    >
                                        <HStack>
                                            <Image
                                                src={
                                                    item.product?.images?.[0]
                                                        ? `http://localhost:5000/uploads/${item.product.images[0]}`
                                                        : "https://via.placeholder.com/80"
                                                }
                                                boxSize="70px"
                                                objectFit="cover"
                                                borderRadius="md"
                                            />
                                            <VStack align="start" spacing={0}>
                                                <Text fontWeight="semibold">
                                                    {item.product?.name}
                                                </Text>
                                                <Text fontSize="sm" color="gray.500">
                                                    Qty: {item.quantity}
                                                </Text>
                                            </VStack>
                                        </HStack>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                onOpen();
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    </Flex>
                                ))}
                            </Stack>
                        </Box>
                    </Box>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                    <Flex justify="center" gap={2}>
                        {[...Array(totalPages)].map((_, i) => (
                            <Button
                                key={i}
                                size="sm"
                                onClick={() => setCurrentPage(i + 1)}
                                colorScheme={currentPage === i + 1 ? "blue" : "gray"}
                            >
                                {i + 1}
                            </Button>
                        ))}
                    </Flex>
                )}
            </VStack>

            {/* Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Order Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {selectedOrder && (
                            <VStack align="stretch" spacing={4}>
                                <Text fontWeight="bold">
                                    Shipping Address
                                </Text>

                                <Box>
                                    <Text>{selectedOrder.shippingInfo.name}</Text>
                                    <Text>
                                        {selectedOrder.shippingInfo.address},{" "}
                                        {selectedOrder.shippingInfo.city}
                                    </Text>
                                    <Text>
                                        Pincode: {selectedOrder.shippingInfo.pincode}
                                    </Text>
                                    <Text>
                                        Mobile: {selectedOrder.shippingInfo.mobile}
                                    </Text>
                                </Box>

                                <Divider />

                                <Text fontWeight="bold">Payment</Text>
                                <Text>Total Paid: ₹{selectedOrder.totalAmount}</Text>
                                <Text fontSize="xs" color="gray.500">
                                    Transaction ID: {selectedOrder.orderId}
                                </Text>
                            </VStack>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default MyOrders;
