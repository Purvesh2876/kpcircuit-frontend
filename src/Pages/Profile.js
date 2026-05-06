import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Text,
    Button,
    Container,
    Stack,
    VStack,
    Divider,
    Flex,
    Avatar,
    Icon,
    SimpleGrid,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Card,
    CardBody,
    Tag,
    HStack,
    GridItem,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    IconButton
} from '@chakra-ui/react';
import "@fontsource/pt-sans";
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiCalendar, FiLogOut, FiEdit, FiShield, FiPackage, FiEye, FiEyeOff } from 'react-icons/fi';
import { getSingleUser, logout, updatePassword, deactivateAccount } from '../actions/api';
import { useCustomToast } from '../hooks/useCustomToast';

const Profile = () => {

    // const [signupForm, setSignupForm] = useState({ email: '', password: '', mobile: '', name: '', dob: '' });
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [dob, setDob] = useState('');
    const toast = useCustomToast();
    const navigate = useNavigate();

    // Password update state
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeactivating, setIsDeactivating] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (index) => {
        setTabIndex(index);
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const onUpdatePassword = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast({
                title: "Passwords do not match",
                status: "error",
                duration: 3000
            });
        }

        if (passwords.newPassword.length < 8) {
            return toast({
                title: "Security Requirement",
                description: "New password must be at least 8 characters long",
                status: "warning",
                duration: 3000
            });
        }

        setIsUpdating(true);
        try {
            const res = await updatePassword(passwords.oldPassword, passwords.newPassword);
            toast({
                title: "Success",
                description: res.message,
                status: "success",
                duration: 5000
            });
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Something went wrong",
                status: "error",
                duration: 5000
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const onDeactivateAccount = async () => {
        if (!window.confirm("Are you sure you want to deactivate your account? This will log you out and you'll need to sign in again to reactivate.")) {
            return;
        }

        setIsDeactivating(true);
        try {
            const res = await deactivateAccount();
            toast({
                title: "Account Deactivated",
                description: res.message,
                status: "success",
                duration: 5000
            });
            localStorage.removeItem('email');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Could not deactivate account",
                status: "error",
                duration: 5000
            });
        } finally {
            setIsDeactivating(false);
        }
    };

    const fetchUser = async () => {
        const response = await getSingleUser();
        console.log('User response:', response);
        if (response.success === true) {
            console.log('User responsesadkwjhhhhhhhhhh');
            setUsername(response.data.username);
            setName(response.data.name);
            setEmail(response.data.email);
            setMobile(response.data.mobile);
            setDob(response.data.dob);
        } else {
            // Handle unsuccessful login (show error message, etc.)
            console.error('Login failed:', response.data.message);
        }
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleLogout = async () => {
        const response = await logout();
        toast({
            title: 'Logout Successful',
            description: 'You have successfully logged out.',
            status: 'success',
            duration: 5000,
            isClosable: true,
        });
        localStorage.removeItem('email');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <Container maxW="container.lg" py={10}>
            <Stack direction={{ base: "column", md: "row" }} spacing={8} align="flex-start">

                {/* --- Left Sidebar / Avatar Card --- */}
                <Card variant="outline" w={{ base: "100%", md: "300px" }} borderRadius="20px" overflow="hidden" boxShadow="sm">
                    <Box bgGradient="linear(to-r, brand.600, brand.400)" h="100px" />
                    <CardBody pt={0} textAlign="center">
                        <Flex direction="column" align="center" mt="-50px">
                            <Avatar
                                size="2xl"
                                name={name}
                                border="4px solid white"
                                bg="brand.500"
                                color="white"
                                fontWeight="bold"
                                mb={4}
                            />
                            <Heading size="md" color="gray.800">{name}</Heading>
                            <Text color="gray.500" fontSize="sm" mt={1}>@{username}</Text>
                            <Tag mt={4} colorScheme="brand" variant="subtle" px={3} py={1} borderRadius="full">
                                Premium Member
                            </Tag>
                        </Flex>

                        <Divider my={6} />

                        <VStack align="stretch" spacing={2}>
                            <Button
                                leftIcon={<FiEdit />}
                                variant="ghost"
                                justifyContent="flex-start"
                                size="sm"
                                onClick={() => setTabIndex(1)}
                                _hover={{ bg: 'brand.50', color: 'brand.500' }}
                            >
                                Edit Profile
                            </Button>
                            <Button
                                leftIcon={<FiPackage />}
                                variant="ghost"
                                justifyContent="flex-start"
                                size="sm"
                                onClick={() => navigate('/myorders')}
                                _hover={{ bg: 'brand.50', color: 'brand.500' }}
                            >
                                My Orders
                            </Button>
                            <Button
                                leftIcon={<FiLogOut />}
                                variant="ghost"
                                justifyContent="flex-start"
                                size="sm"
                                colorScheme="red"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </VStack>
                    </CardBody>
                </Card>

                {/* --- Right Content Area --- */}
                <Box flex="1" w="100%">
                    <Tabs index={tabIndex} onChange={handleTabChange} variant="enclosed" colorScheme="brand">
                        <TabList mb="1em">
                            <Tab fontWeight="600">Account Overview</Tab>
                            <Tab fontWeight="600">Settings</Tab>
                        </TabList>

                        <TabPanels>
                            {/* OVERVIEW TAB */}
                            <TabPanel p={0} pt={4}>
                                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>

                                    {/* Personal Info Card */}
                                    <Card variant="outline" borderRadius="xl">
                                        <CardBody>
                                            <Flex align="center" mb={6}>
                                                <Icon as={FiUser} boxSize={5} color="brand.500" mr={3} />
                                                <Heading size="sm">Personal Details</Heading>
                                            </Flex>

                                            <VStack align="stretch" spacing={4}>
                                                <Box>
                                                    <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">Full Name</Text>
                                                    <Text fontWeight="500">{name}</Text>
                                                </Box>
                                                <Box>
                                                    <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">Date of Birth</Text>
                                                    <Text fontWeight="500">{formatDate(dob)}</Text>
                                                </Box>
                                            </VStack>
                                        </CardBody>
                                    </Card>

                                    {/* Contact Info Card */}
                                    <Card variant="outline" borderRadius="xl">
                                        <CardBody>
                                            <Flex align="center" mb={6}>
                                                <Icon as={FiMail} boxSize={5} color="brand.500" mr={3} />
                                                <Heading size="sm">Contact Information</Heading>
                                            </Flex>

                                            <VStack align="stretch" spacing={4}>
                                                <Box>
                                                    <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">Email Address</Text>
                                                    <Text fontWeight="500">{email}</Text>
                                                </Box>
                                                <Box>
                                                    <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">Mobile Number</Text>
                                                    <Text fontWeight="500">+91 {mobile}</Text>
                                                </Box>
                                            </VStack>
                                        </CardBody>
                                    </Card>

                                    {/* Account Activity */}
                                    <GridItem colSpan={{ base: 1, lg: 2 }}>
                                        <Card variant="outline" borderRadius="xl">
                                            <CardBody>
                                                <Flex align="center" mb={6}>
                                                    <Icon as={FiShield} boxSize={5} color="brand.500" mr={3} />
                                                    <Heading size="sm">Security & Privacy</Heading>
                                                </Flex>
                                                <Text color="gray.600" fontSize="sm" mb={4}>
                                                    Your account is protected with standard encryption. You can update your password or deactivate your account in the settings tab.
                                                </Text>
                                            </CardBody>
                                        </Card>
                                    </GridItem>
                                </SimpleGrid>
                            </TabPanel>

                            {/* SETTINGS TAB */}
                            <TabPanel p={0} pt={4}>
                                <Card variant="outline" borderRadius="xl">
                                    <CardBody>
                                        <VStack align="stretch" spacing={6}>
                                            <Box>
                                                <Heading size="sm" mb={4}>Security Settings</Heading>
                                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                                    <FormControl isRequired>
                                                        <FormLabel fontSize="sm">Current Password</FormLabel>
                                                        <InputGroup size="md">
                                                            <Input
                                                                name="oldPassword"
                                                                type={showOld ? 'text' : 'password'}
                                                                value={passwords.oldPassword}
                                                                onChange={handlePasswordChange}
                                                                placeholder="Enter current password"
                                                                focusBorderColor="brand.500"
                                                            />
                                                            <InputRightElement h="full">
                                                                <IconButton
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setShowOld(!showOld)}
                                                                    icon={showOld ? <FiEyeOff /> : <FiEye />}
                                                                    aria-label={showOld ? 'Hide password' : 'Show password'}
                                                                />
                                                            </InputRightElement>
                                                        </InputGroup>
                                                    </FormControl>

                                                    <Box display={{ base: "none", md: "block" }} />

                                                    <FormControl isRequired>
                                                        <FormLabel fontSize="sm">New Password</FormLabel>
                                                        <InputGroup size="md">
                                                            <Input
                                                                name="newPassword"
                                                                type={showNew ? 'text' : 'password'}
                                                                value={passwords.newPassword}
                                                                onChange={handlePasswordChange}
                                                                placeholder="Minimum 8 characters"
                                                                focusBorderColor="brand.500"
                                                            />
                                                            <InputRightElement h="full">
                                                                <IconButton
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setShowNew(!showNew)}
                                                                    icon={showNew ? <FiEyeOff /> : <FiEye />}
                                                                    aria-label={showNew ? 'Hide password' : 'Show password'}
                                                                />
                                                            </InputRightElement>
                                                        </InputGroup>
                                                    </FormControl>

                                                    <FormControl isRequired>
                                                        <FormLabel fontSize="sm">Confirm New Password</FormLabel>
                                                        <Input
                                                            name="confirmPassword"
                                                            type={showNew ? 'text' : 'password'}
                                                            value={passwords.confirmPassword}
                                                            onChange={handlePasswordChange}
                                                            placeholder="Repeat new password"
                                                            focusBorderColor="brand.500"
                                                        />
                                                    </FormControl>
                                                </SimpleGrid>

                                                <Button
                                                    mt={8}
                                                    colorScheme="brand"
                                                    isLoading={isUpdating}
                                                    loadingText="Updating..."
                                                    onClick={onUpdatePassword}
                                                    px={8}
                                                >
                                                    Update Password
                                                </Button>
                                            </Box>
                                            <Divider />
                                            <Box>
                                                <Heading size="sm" mb={2} color="red.500">Deactivate Account</Heading>
                                                <Text fontSize="sm" color="gray.500" mb={4}>Permanently delete your account and all of your data. This action cannot be undone.</Text>
                                                <Button
                                                    colorScheme="red"
                                                    variant="outline"
                                                    size="sm"
                                                    isLoading={isDeactivating}
                                                    onClick={onDeactivateAccount}
                                                >
                                                    Deactivate Account
                                                </Button>
                                            </Box>
                                        </VStack>
                                    </CardBody>
                                </Card>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Stack>
        </Container>
    );
};

export default Profile;