import React, { useEffect, useState } from "react";
import {
    Box,
    Heading,
    VStack,
    FormControl,
    FormLabel,
    Textarea,
    Button,
    Container,
    Spinner,
    Center,
    Checkbox,
    Stack,
    Image,
    Text,
    Flex,
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    useToast,
    Input,
    HStack,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, createReturnRequest } from "../actions/api";

const RequestReturn = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [reason, setReason] = useState("");
    const [type, setType] = useState("REPLACEMENT");
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            try {
                const { order } = await getOrderById(orderId);
                setOrder(order);

                // Pre-select all returnable items
                const returnableItems = order.items
                    .filter(item => item.product.isReturnable)
                    .map(item => ({
                        product: item.product._id,
                        quantity: 1, // Default quantity
                        maxQuantity: item.quantity,
                        name: item.product.name,
                        image: item.product.images[0],
                        isReplaceable: item.product.isReplaceable,
                    }));
                setSelectedItems(returnableItems);

            } catch (err) {
                console.error(err);
                toast({
                    title: "Error fetching order",
                    description: "Could not retrieve order details.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, toast]);

    const handleItemToggle = (item) => {
        setSelectedItems(prev => {
            const isSelected = prev.some(i => i.product === item.product._id);
            if (isSelected) {
                return prev.filter(i => i.product !== item.product._id);
            } else {
                return [
                    ...prev,
                    {
                        product: item.product._id,
                        quantity: 1,
                        maxQuantity: item.quantity,
                        name: item.product.name,
                        image: item.product.images[0],
                        isReplaceable: item.product.isReplaceable,
                    },
                ];
            }
        });
    };

    const handleQuantityChange = (productId, newQuantity) => {
        setSelectedItems(prev =>
            prev.map(item =>
                item.product === productId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const handleImageChange = (e) => {
        setImages([...e.target.files]);
    };

    const handleSubmit = async () => {
        if (selectedItems.length === 0) {
            toast({ title: "Please select at least one item to return.", status: "warning" });
            return;
        }
        if (!reason) {
            toast({ title: "Please provide a reason for the return.", status: "warning" });
            return;
        }
        if (type === 'REPLACEMENT' && selectedItems.some(i => !i.isReplaceable)) {
            toast({ title: "One or more selected items are not replaceable. Please choose Refund.", status: "warning", duration: 6000 });
            return;
        }

        setIsSubmitting(true);
        try {
            const returnData = {
                orderId,
                items: selectedItems.map(({ product, quantity }) => ({ product, quantity })),
                reason,
                type,
                images,
            };

            await createReturnRequest(returnData);

            toast({
                title: "Return request submitted.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            navigate("/myorders");

        } catch (error) {
            console.error("Return request error:", error);
            toast({
                title: "Submission failed.",
                description: error.response?.data?.message || "There was an error submitting your request.",
                status: "error",
                duration: 7000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    if (loading) {
        return <Center h="60vh"><Spinner size="xl" /></Center>;
    }

    if (!order) {
        return <Center h="60vh"><Text>Order not found.</Text></Center>;
    }

    // Filter out non-returnable items for display
    const returnableOrderItems = order.items.filter(item => item.product.isReturnable);

    return (
        <Container maxW="container.md" py={10}>
            <VStack spacing={8} align="stretch">
                <Heading>Request Return for Order #{order.orderId}</Heading>

                <Box p={5} borderWidth="1px" borderRadius="lg">
                    <Heading size="md" mb={4}>Select Items</Heading>
                    <Stack spacing={5}>
                        {returnableOrderItems.map(item => {
                            const selected = selectedItems.find(i => i.product === item.product._id);
                            return (
                                <Flex key={item.product._id} align="center" justify="space-between">
                                    <HStack spacing={4}>
                                        <Checkbox
                                            isChecked={!!selected}
                                            onChange={() => handleItemToggle(item)}
                                            size="lg"
                                        />
                                        <Image src={`/uploads/${item.product.images[0]}`} boxSize="60px" borderRadius="md" />
                                        <VStack align="start" spacing={0}>
                                            <Text fontWeight="bold">{item.product.name}</Text>
                                            <Text fontSize="sm">Purchased: {item.quantity}</Text>
                                        </VStack>
                                    </HStack>
                                    {selected && (
                                        <NumberInput
                                            size="sm"
                                            maxW={20}
                                            value={selected.quantity}
                                            min={1}
                                            max={item.quantity}
                                            onChange={(_, valNum) => handleQuantityChange(item.product._id, valNum)}
                                        >
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    )}
                                </Flex>
                            );
                        })}
                    </Stack>
                </Box>

                <FormControl isRequired>
                    <FormLabel>Reason for Return</FormLabel>
                    <Textarea
                        placeholder="e.g., 'Item was damaged during shipping'"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Preferred Outcome</FormLabel>
                    <Box p={3} bg="blue.50" borderRadius="md" borderLeft="4px solid" borderColor="blue.500">
                        <Text fontWeight="bold" color="blue.700">REPLACEMENT</Text>
                        <Text fontSize="xs" color="blue.600">
                            Note: We primarily offer replacements. If the item is out of stock after we collect your return, a refund will be processed automatically.
                        </Text>
                    </Box>
                </FormControl>

                <FormControl>
                    <FormLabel>Upload Images (Optional)</FormLabel>
                    <Input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        p={1.5}
                        accept="image/*"
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>You can upload images to show damage or other issues.</Text>
                </FormControl>

                <Button
                    colorScheme="blue"
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                    loadingText="Submitting..."
                >
                    Submit Request
                </Button>
            </VStack>
        </Container>
    );
};

export default RequestReturn;
