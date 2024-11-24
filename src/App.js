import { ChakraProvider } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import GiftCardForm from './components/GiftCardForm';
import LoginForm from './components/LoginForm';
import theme from './theme';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const appVersion = process.env.REACT_APP_VERSION || 'unknown';

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
                <>
                    <LoginForm setIsAuthenticated={setIsAuthenticated} />
                    <p style={{ textAlign: 'center', marginTop: '10px' }}>Version: {appVersion}</p>
                </>
            )}
        </ChakraProvider>
    );
}

export default App;