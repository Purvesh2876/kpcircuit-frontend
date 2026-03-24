import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
    Box,
    Flex,
    Text,
    VStack,
    Heading,
    Badge,
    Center,
    Spinner,
    Container,
    Image,
    HStack,
    Divider,
    Icon,
    Circle,
} from "@chakra-ui/react";
import { MdCheck, MdRadioButtonUnchecked } from "react-icons/md";
import { getReturnById } from "../actions/api";

const ReturnDetails = () => {
    const { id } = useParams();
    const [returnReq, setReturnReq] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getReturnById(id);
                if (data.success) {
                    setReturnReq(data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDetails();
    }, [id]);

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

    const getTimelineStatuses = () => {
        // Defines the ideal flow
        return ["REQUESTED", "APPROVED", "PICKED", "RECEIVED", "COMPLETED"];
    };

    if (loading) {
        return (
            <Center h="60vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!returnReq) {
        return <Center h="60vh"><Text>Return request not found.</Text></Center>;
    }

    const { statusHistory, items, order } = returnReq;
    const isRejected = returnReq.status === "REJECTED";
    const timeline = isRejected ? ["REQUESTED", "REJECTED"] : getTimelineStatuses();

    return (
        <Container maxW="container.md" py={10}>
            <VStack spacing={6} align="stretch">
                <Heading size="md">Return / Replacement Details</Heading>

                {/* Details Card */}
                <Box p={6} borderWidth="1px" borderRadius="lg" bg="white">
                    <Flex justify="space-between" mb={4} wrap="wrap">
                        <VStack align="start" spacing={1}>
                            <Text color="gray.500" fontSize="sm">Return ID</Text>
                            <Text fontWeight="bold">{returnReq._id.substring(returnReq._id.length - 8).toUpperCase()}</Text>
                        </VStack>
                        <VStack align="start" spacing={1}>
                            <Text color="gray.500" fontSize="sm">Order ID</Text>
                            <Text fontWeight="bold">{order?.orderId}</Text>
                        </VStack>
                        <VStack align="start" spacing={1}>
                            <Text color="gray.500" fontSize="sm">Type</Text>
                            <Badge colorScheme={returnReq.type === 'REFUND' ? 'purple' : 'teal'}>{returnReq.type}</Badge>
                        </VStack>
                        <VStack align="start" spacing={1}>
                            <Text color="gray.500" fontSize="sm">Current Status</Text>
                            <Badge colorScheme={statusColor(returnReq.status)}>{returnReq.status}</Badge>
                        </VStack>
                    </Flex>

                    <Divider my={4} />

                    <Text fontWeight="bold" mb={2}>Reason</Text>
                    <Text fontSize="sm">{returnReq.reason}</Text>

                    {returnReq.refundStatus && (
                        <Box mt={4}>
                            <Text fontWeight="bold" mb={1}>Refund Status</Text>
                            <Badge colorScheme={returnReq.refundStatus === "PROCESSED" ? "green" : "orange"}>
                                {returnReq.refundStatus}
                            </Badge>
                        </Box>
                    )}

                    {returnReq.replacementOrder && (
                        <Box mt={4}>
                            <Text fontWeight="bold" mb={1}>Replacement Order Link</Text>
                            {/* Assumes Replacement Order has an ID we can link to if it shows in MyOrders. 
                                We don't link directly to it here as it might just appear in "My Orders", but we show it. */}
                            <Text fontSize="sm" color="blue.500" as={RouterLink} to="/myorders">
                                Track Replacement Order in My Orders
                            </Text>
                        </Box>
                    )}
                </Box>

                {/* Tracking Timeline */}
                <Box p={6} borderWidth="1px" borderRadius="lg" bg="white">
                    <Heading size="sm" mb={6}>Status Timeline</Heading>
                    <VStack align="flex-start" spacing={0} position="relative">
                        {/* A vertical line connecting dots */}
                        <Box
                            position="absolute"
                            left="11px"
                            top="10px"
                            bottom="10px"
                            width="2px"
                            bg="gray.200"
                            zIndex={0}
                        />

                        {timeline.map((step, idx) => {
                            // Find if this step is reached
                            const historyItem = statusHistory.find(s => s.status === step);
                            const isCompleted = !!historyItem;

                            return (
                                <HStack
                                    key={step}
                                    spacing={4}
                                    pb={idx === timeline.length - 1 ? 0 : 8}
                                    align="flex-start"
                                    position="relative"
                                    zIndex={1}
                                    w="full"
                                >
                                    <Box pt={0.5} bg="white">
                                        {isCompleted ? (
                                            <Circle size="24px" bg="green.500" color="white">
                                                <Icon as={MdCheck} boxSize={4} />
                                            </Circle>
                                        ) : (
                                            <Circle size="24px" bg="gray.200" color="gray.500">
                                                <Icon as={MdRadioButtonUnchecked} boxSize={4} />
                                            </Circle>
                                        )}
                                    </Box>
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight={isCompleted ? "bold" : "normal"} color={isCompleted ? "black" : "gray.500"}>
                                            {step.replace("_", " ")}
                                        </Text>
                                        {isCompleted && historyItem && (
                                            <Text fontSize="xs" color="gray.500">
                                                {new Date(historyItem.timestamp).toLocaleString("en-IN")}
                                            </Text>
                                        )}
                                    </VStack>
                                </HStack>
                            );
                        })}
                    </VStack>
                </Box>

                {/* Items Card */}
                <Box p={6} borderWidth="1px" borderRadius="lg" bg="white">
                    <Heading size="sm" mb={4}>Items in Request</Heading>
                    <VStack align="stretch" spacing={4}>
                        {items.map((item, index) => (
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
                    </VStack>
                </Box>

            </VStack>
        </Container>
    );
};

export default ReturnDetails;
