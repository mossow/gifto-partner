import { ChakraProvider } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import GiftCardForm from './components/GiftCardForm';
import LoginForm from './components/LoginForm';
import theme from './theme';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <ChakraProvider theme={theme}>
            {isAuthenticated ? (
                <GiftCardForm setIsAuthenticated={setIsAuthenticated} />
            ) : (
                <LoginForm setIsAuthenticated={setIsAuthenticated} />
            )}
        </ChakraProvider>
    );
}

export default App;