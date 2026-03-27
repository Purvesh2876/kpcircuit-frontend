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
    Link,
    Image,
    Divider,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { login, forgotPassword } from '../actions/api';
import GoogleSignIn from './GoogleSignIn';
import logo from '../logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isForgotMode, setIsForgotMode] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await login(email, password);
            if (response.success) {
                toast({
                    title: 'Welcome Back!',
                    description: response.message || 'Login successful.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                navigate('/');
            }
        } catch (error) {
            toast({
                title: 'Login Failed',
                description: error.response?.data?.message || 'Invalid credentials.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            return toast({
                title: "Error",
                description: "Email is required for password recovery.",
                status: "warning"
            });
        }
        setIsLoading(true);
        try {
            const res = await forgotPassword(email);
            toast({
                title: "Email Sent",
                description: res.message,
                status: "success"
            });
            setIsForgotMode(false);
        } catch (error) {
            toast({
                title: "Failed",
                description: error.response?.data?.message || "Something went wrong",
                status: "error"
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Flex minH="100vh" direction={{ base: 'column', md: 'row' }}>
            {/* Left Side: Branding */}
            {/* <Flex
                flex={1.2}
                bgGradient="linear(to-br, brand.600, brand.400)"
                color="white"
                direction="column"
                justify="center"
                align="center"
                p={10}
                textAlign="center"
                display={{ base: 'none', md: 'flex' }}
            >
                <Box mb={8}>
                    <Image src={logo} h="120px" filter="brightness(0) invert(1)" />
                </Box>
                <Heading size="2xl" mb={4} fontWeight="extrabold" lineHeight="1.2">
                    Experience the Future <br /> of Tech
                </Heading>
                <Text fontSize="xl" maxW="450px" opacity={0.9} lineHeight="tall">
                    Your premium destination for high-end gadgets and custom electronic solutions. Secure. Reliable. Innovative.
                </Text>
            </Flex> */}

            {/* Right Side: Form */}
            <Flex flex={1} align="center" justify="center" p={6} bg="white">
                <Box
                    w="full"
                    maxW="450px"
                    p={{ base: 4, md: 8 }}
                >
                    <Box textAlign="center" mb={10}>
                        <Image src={logo} h="50px" mx="auto" display={{ base: 'block', md: 'none' }} mb={6} />
                        <Heading size="lg" color="gray.800" fontWeight="bold">
                            {isForgotMode ? "Recover Password" : "Welcome Back"}
                        </Heading>
                        <Text color="gray.500" mt={2} fontSize="md">
                            {isForgotMode ? "We'll send a recovery link to your email" : "Sign in to manage your orders and profile"}
                        </Text>
                    </Box>

                    <form onSubmit={isForgotMode ? handleForgotPassword : handleLogin}>
                        <Stack spacing={6}>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" fontWeight="bold" color="gray.700">Email Address</FormLabel>
                                <Input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    size="lg"
                                    borderRadius="xl"
                                    bg="gray.50"
                                    _focus={{ bg: 'white', borderColor: 'brand.500' }}
                                />
                            </FormControl>

                            {!isForgotMode && (
                                <FormControl isRequired>
                                    <Flex justify="space-between" align="center" mb={2}>
                                        <FormLabel fontSize="sm" fontWeight="bold" color="gray.700" mb={0}>Password</FormLabel>
                                        <Link
                                            as="button"
                                            type="button"
                                            fontSize="xs"
                                            color="brand.600"
                                            fontWeight="bold"
                                            onClick={() => setIsForgotMode(true)}
                                        >
                                            Forgot Password?
                                        </Link>
                                    </Flex>
                                    <InputGroup size="lg">
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Min. 8 characters"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            borderRadius="xl"
                                            bg="gray.50"
                                            _focus={{ bg: 'white', borderColor: 'brand.500' }}
                                        />
                                        <InputRightElement h="full">
                                            <IconButton
                                                size="sm"
                                                variant="ghost"
                                                icon={showPassword ? <FiEyeOff /> : <FiEye />}
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            />
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>
                            )}

                            <Button
                                type="submit"
                                colorScheme="brand"
                                size="lg"
                                w="full"
                                h="14"
                                borderRadius="xl"
                                isLoading={isLoading}
                                fontSize="md"
                                fontWeight="bold"
                                boxShadow="0 4px 14px 0 rgba(0, 77, 61, 0.39)"
                                _hover={{
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 6px 20px rgba(0, 77, 61, 0.45)',
                                }}
                            >
                                {isForgotMode ? "Send Reset Link" : "Sign In"}
                            </Button>

                            {isForgotMode && (
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsForgotMode(false)}
                                    size="sm"
                                >
                                    Return to Login
                                </Button>
                            )}
                        </Stack>
                    </form>

                    <Flex align="center" my={8}>
                        <Divider />
                        <Text px={3} color="gray.400" fontSize="xs" fontWeight="bold">OR</Text>
                        <Divider />
                    </Flex>

                    <Flex direction="column" align="center" gap={4}>
                        <GoogleSignIn />

                        <Text color="gray.600" fontSize="sm">
                            {isForgotMode ? "" : (
                                <>
                                    Don't have an account?{' '}
                                    <Link as={RouterLink} to="/signup" color="brand.600" fontWeight="bold">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </Text>
                    </Flex>
                </Box>
            </Flex>
        </Flex>
    );
};

export default Login;