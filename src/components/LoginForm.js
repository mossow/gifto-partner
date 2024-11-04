import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Container,
    Heading,
    useToast,
    InputGroup,
    InputRightElement,
    IconButton
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { loginUser } from '../api/giftcard';

const LoginForm = ({ setIsAuthenticated }) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!identifier || !password) {
            toast({
                title: "Tähelepanu",
                description: "Palun täitke kõik väljad",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        setLoading(true);

        try {
            const response = await loginUser(identifier, password);
            localStorage.setItem('token', response.jwt);
            localStorage.setItem('userId', response.user.id);
            setIsAuthenticated(true);
        } catch (error) {
            toast({
                title: 'Viga sisselogimisel',
                description: error.response?.data?.error?.message || 'Palun kontrollige kasutajanime ja parooli',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxW="container.sm" py={8}>
            <Box 
                p={8} 
                bg="white" 
                boxShadow="lg" 
                borderRadius="lg"
                w="100%"
            >
                <VStack spacing={6}>
                    <Heading size="lg">Logi sisse</Heading>
                    <FormControl isRequired>
                        <FormLabel>Kasutajanimi</FormLabel>
                        <Input
                            variant="filled"
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            disabled={loading}
                            placeholder="Sisesta kasutajanimi"
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Parool</FormLabel>
                        <InputGroup>
                            <Input
                                variant="filled"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                placeholder="Sisesta parool"
                            />
                            <InputRightElement>
                                <IconButton
                                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                    onClick={() => setShowPassword(!showPassword)}
                                    variant="ghost"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                />
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>

                    <Button
                        variant="success"
                        width="100%"
                        onClick={handleSubmit}
                        isLoading={loading}
                        loadingText="Sisselogimine..."
                    >
                        Logi sisse
                    </Button>
                </VStack>
            </Box>
        </Container>
    );
};

export default LoginForm;