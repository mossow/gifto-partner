import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
    Text,
    IconButton,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    InputGroup,
    InputRightElement,
    Image
} from '@chakra-ui/react';
import { checkBalance, registerPayment, getTransactions } from '../api/giftcard';
import TransactionHistory from './TransactionHistory';
import EANScanner from './EANScanner';

const GiftCardForm = ({ setIsAuthenticated }) => {
    const [pan, setPan] = useState(''); // Gift card number (EAN)
    const [cvv, setCvv] = useState(''); // PIN for the gift card
    const [amount, setAmount] = useState(''); // Payment amount
    const [message, setMessage] = useState(''); // Success/error message
    const [loading, setLoading] = useState(false); // Loading state for the form
    const [showScanner, setShowScanner] = useState(false); // Toggle scanner visibility
    const [balance, setBalance] = useState(null); // State for balance
    const userId = localStorage.getItem('userId');
    const [showTransactions, setShowTransactions] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!pan || !cvv || !amount) {
            toast({
                title: "Tähelepanu",
                description: "Kõik väljad peavad olema täidetud",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        setMessage('');
        const amountInCents = Math.round(amount * 100);

        try {
            const response = await registerPayment(pan, cvv, amountInCents);
            setMessage(`Makse registreeritud: ${response.data.paidAmount / 100} EUR`);
            setAmount('');
            setCvv('');
            setPan('');

        } catch (error) {
            console.error('Payment error:', error);
            const errorMessage = error.response?.data?.error?.message || 'Viga: Makse ebaõnnestus';
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckBalance = async () => {
        if (!pan || !cvv) {
            toast({
                title: "Tähelepanu",
                description: "Kinkekaardi nr ja Pin peavad olema täidetud",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
                variant: "solid",
            });
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await checkBalance(pan, cvv);
            if (response && response.data) {
                const balanceAmount = response.data.amountBalance;
                setBalance(balanceAmount);
                setMessage(`Kinkekaardi saldo: ${balanceAmount / 100} EUR`);
            } else {
                setMessage('Viga: Saldo kontrollimine ebaõnnestus');
            }
        } catch (error) {
            console.error('Balance check error:', error);
            const errorMessage = error.response?.data?.error?.message || 'Viga: Saldo kontrollimine ebaõnnestus';
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleShowTransactions = async () => {
        try {
        const response = await getTransactions();
        setTransactions(response.data);
        setShowTransactions(true);
        } catch (error) {
        console.error('Error fetching transactions:', error);
        setMessage('Tehingute laadimine ebaõnnestus');
        }
    };

    const closeScanner = () => {
        setShowScanner(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsAuthenticated(false);
    };

    return (
        <Container maxW="container.sm" py={5}>
            <VStack spacing={5}>
                <Heading>Gifto kinkekaardid</Heading>
                
                <Box as="form" onSubmit={handleSubmit} width="100%">
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Kinkekaardi nr:</FormLabel>
                            <InputGroup>
                                <Input
                                    type="number"
                                    value={pan}
                                    onChange={(e) => setPan(e.target.value)}
                                    disabled={loading}
                                />
                                <InputRightElement>
                                    <IconButton
                                        variant="scanner"
                                        icon={<Image src="/scanner.svg" alt="Scan" boxSize="20px" />}
                                        onClick={() => setShowScanner(!showScanner)}
                                        disabled={loading}
                                        aria-label="Scan card"
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Pin:</FormLabel>
                            <Input
                                type="number"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                disabled={loading}
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Summa(€):</FormLabel>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={loading}
                            />
                        </FormControl>

                        {message && (
                            <Text
                                color={message.includes('Viga') ? 'red.500' : 'green.500'}
                                width="100%"
                                textAlign="center"
                            >
                                {message}
                            </Text>
                        )}

                        <Button
                            variant="primary"
                            onClick={handleCheckBalance}
                            isDisabled={loading}
                            width="100%"
                        >
                            Vaata saldot
                        </Button>

                        <Button
                            variant="success"
                            onClick={handleSubmit}
                            isLoading={loading}
                            loadingText="Laadin..."
                            width="100%"
                            type="button"
                        >
                            Registreeri makse
                        </Button>

                        <Button
                            variant="primary"
                            onClick={handleShowTransactions}
                            isDisabled={loading}
                            width="100%"
                        >
                            Näita tehinguid
                        </Button>

                        <Button
                            variant="danger"
                            onClick={handleLogout}
                            isDisabled={loading}
                            width="100%"
                        >
                            Logi välja
                        </Button>
                    </VStack>
                </Box>

                <Modal isOpen={showScanner} onClose={closeScanner} size="xl">
                    <ModalOverlay />
                    <ModalContent bg="black">
                        <ModalHeader color="white">Skänni kinkekaart</ModalHeader>
                        <ModalCloseButton color="white" />
                        <ModalBody p={0}>
                            <EANScanner onDetected={(code) => {
                                setPan(code);
                                closeScanner();
                            }} />
                        </ModalBody>
                    </ModalContent>
                </Modal>

                {showTransactions && (
                    <TransactionHistory
                        transactions={transactions}
                        onClose={() => setShowTransactions(false)}
                    />
                )}
            </VStack>
        </Container>
    );
};

export default GiftCardForm;
