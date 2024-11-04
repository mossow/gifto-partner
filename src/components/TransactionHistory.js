import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Box,
  Spacer
} from '@chakra-ui/react';

const TransactionHistory = ({ transactions, onClose }) => {
  const formatCardNumber = (pan) => {
    if (!pan) return '';
    return `${pan.slice(0, 4)}...${pan.slice(-4)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('et-EE', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Viimased tehingud</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            {transactions.map((tx) => (
              <Box 
                key={tx.id} 
                p={4} 
                bg="white" 
                borderRadius="lg" 
                boxShadow="sm"
                borderWidth="1px"
                _hover={{ boxShadow: 'md' }}
              >
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" color="gray.600">
                    {formatDate(tx.Date)}
                  </Text>
                  <Text 
                    fontSize="lg" 
                    fontWeight="bold"
                    color={tx.Amount > 0 ? 'green.500' : 'red.500'}
                  >
                    {tx.Amount.toFixed(2)} €
                  </Text>
                </HStack>
                <Text fontWeight="medium" color="brand.primary">
                  {formatCardNumber(tx.pan)}
                </Text>
              </Box>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TransactionHistory;