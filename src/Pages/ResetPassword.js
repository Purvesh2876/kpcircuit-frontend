import React, { useState } from 'react';
import {
    Box,
    Flex,
    Heading,
    Text,
    Input,
    Button,
    Stack,
    FormControl,
    FormLabel,
    InputGroup,
    InputRightElement,
    IconButton,
    useToast,
    Image,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../actions/api';
import logo from '../logo.png';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { token } = useParams();
    const toast = useToast();
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast({
                title: "Error",
                description: "Passwords do not match.",
                status: "error"
            });
        }
        setIsLoading(true);
        try {
            const res = await resetPassword(token, password, confirmPassword);
            toast({
                title: "Success",
                description: res.message,
                status: "success"
            });
            navigate('/login');
        } catch (error) {
            toast({
                title: "Failed",
                description: error.response?.data?.message || "Invalid or expired token.",
                status: "error"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg="gray.50" p={6}>
            <Box
                w="full"
                maxW="450px"
                bg="white"
                p={8}
                borderRadius="2xl"
                boxShadow="xl"
                border="1px solid"
                borderColor="gray.100"
            >
                <Box textAlign="center" mb={10}>
                    <Image src={logo} h="50px" mx="auto" mb={6} />
                    <Heading size="lg" color="brand.600" fontWeight="bold">New Password</Heading>
                    <Text color="gray.500" mt={2}>Set your new secure password</Text>
                </Box>

                <form onSubmit={handleReset}>
                    <Stack spacing={5}>
                        <FormControl isRequired>
                            <FormLabel color="gray.600">New Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Min. 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    borderRadius="lg"
                                    bg="gray.50"
                                />
                                <InputRightElement h="full">
                                    <IconButton
                                        size="sm"
                                        variant="ghost"
                                        icon={showPassword ? <FiEyeOff /> : <FiEye />}
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label="Toggle password"
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel color="gray.600">Confirm Password</FormLabel>
                            <Input
                                type="password"
                                placeholder="Repeat new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                borderRadius="lg"
                                bg="gray.50"
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="brand"
                            size="lg"
                            w="full"
                            h="14"
                            borderRadius="lg"
                            isLoading={isLoading}
                            boxShadow="lg"
                            _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
                        >
                            Update Password
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Flex>
    );
};

export default ResetPassword;
