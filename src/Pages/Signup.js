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
    Link,
    Image,
    SimpleGrid,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { signup } from '../actions/api';
import { useCustomToast } from '../hooks/useCustomToast';
import logo from '../logo.png';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        mobile: '',
        dob: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toast = useCustomToast();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'mobile') {
            const formattedValue = value.replace(/\D/g, '').slice(0, 10);
            setFormData({ ...formData, [name]: formattedValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await signup(
                formData.username,
                formData.name,
                formData.email,
                formData.password,
                formData.mobile,
                formData.dob
            );
            toast({
                title: 'Welcome to the Club!',
                description: 'Signup successful. Please verify your email.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            localStorage.setItem('email', formData.email);
            navigate('/otp');
        } catch (error) {
            toast({
                title: 'Signup Failed',
                description: error.response?.data?.error || 'Something went wrong.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Flex minH="100vh" direction={{ base: 'column', md: 'row' }}>
            {/* Left Side: Branding */}
            {/* <Flex
                flex={1}
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
                    <Image src={logo} h="100px" filter="brightness(0) invert(1)" />
                </Box>
                <Heading size="2xl" mb={4} fontWeight="extrabold" lineHeight="1.2">
                    Join KP Circuit City
                </Heading>
                <Text fontSize="xl" maxW="400px" opacity={0.9} lineHeight="tall">
                    Unlock premium access to the best tech deals, personalized gadgets, and a world-class shopping experience.
                </Text>
            </Flex> */}

            {/* Right Side: Form */}
            <Flex flex={1.5} align="center" justify="center" p={6} bg="white">
                <Box
                    w="full"
                    maxW="600px"
                    p={{ base: 4, md: 8 }}
                >
                    <Box textAlign="center" mb={10}>
                        <Image src={logo} h="40px" mx="auto" display={{ base: 'block', md: 'none' }} mb={6} />
                        <Heading size="lg" color="gray.800" fontWeight="bold">Create Your Account</Heading>
                        <Text color="gray.500" mt={2} fontSize="md">Ready to start your premium tech journey?</Text>
                    </Box>

                    <form onSubmit={handleSignup}>
                        <Stack spacing={5}>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                                <FormControl isRequired>
                                    <FormLabel fontSize="sm" fontWeight="bold" color="gray.700">Username</FormLabel>
                                    <Input
                                        name="username"
                                        placeholder="johndoe"
                                        value={formData.username}
                                        onChange={handleChange}
                                        borderRadius="xl"
                                        bg="gray.50"
                                        _focus={{ bg: 'white', borderColor: 'brand.500' }}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel fontSize="sm" fontWeight="bold" color="gray.700">Full Name</FormLabel>
                                    <Input
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        borderRadius="xl"
                                        bg="gray.50"
                                        _focus={{ bg: 'white', borderColor: 'brand.500' }}
                                    />
                                </FormControl>
                            </SimpleGrid>

                            <FormControl isRequired>
                                <FormLabel fontSize="sm" fontWeight="bold" color="gray.700">Email Address</FormLabel>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    borderRadius="xl"
                                    bg="gray.50"
                                    _focus={{ bg: 'white', borderColor: 'brand.500' }}
                                />
                            </FormControl>

                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                                <FormControl isRequired>
                                    <FormLabel fontSize="sm" fontWeight="bold" color="gray.700">Mobile Number</FormLabel>
                                    <Input
                                        name="mobile"
                                        placeholder="10 digit number"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        borderRadius="xl"
                                        bg="gray.50"
                                        _focus={{ bg: 'white', borderColor: 'brand.500' }}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel fontSize="sm" fontWeight="bold" color="gray.700">Date of Birth</FormLabel>
                                    <Input
                                        name="dob"
                                        type="date"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        borderRadius="xl"
                                        bg="gray.50"
                                        _focus={{ bg: 'white', borderColor: 'brand.500' }}
                                    />
                                </FormControl>
                            </SimpleGrid>

                            <FormControl isRequired>
                                <FormLabel fontSize="sm" fontWeight="bold" color="gray.700">Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Min. 8 characters"
                                        value={formData.password}
                                        onChange={handleChange}
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

                            <Button
                                type="submit"
                                colorScheme="brand"
                                size="lg"
                                w="full"
                                h="14"
                                borderRadius="xl"
                                isLoading={isLoading}
                                mt={6}
                                fontSize="md"
                                fontWeight="bold"
                                boxShadow="0 4px 14px 0 rgba(0, 77, 61, 0.39)"
                                _hover={{
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 6px 20px rgba(0, 77, 61, 0.45)',
                                }}
                            >
                                Let's Get Started
                            </Button>
                        </Stack>
                    </form>

                    <Box textAlign="center" mt={8}>
                        <Text color="gray.600" fontSize="sm">
                            Already have an account?{' '}
                            <Link as={RouterLink} to="/login" color="brand.600" fontWeight="bold">
                                Sign In
                            </Link>
                        </Text>
                    </Box>
                </Box>
            </Flex>
        </Flex>
    );
};

export default Signup;