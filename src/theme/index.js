import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      success: '#4CAF50',
      error: '#dc3545',
      primary: '#007bff',
      hover: '#45a049'
    }
  },
  components: {
    Input: {
      variants: {
        filled: {
          field: {
            backgroundColor: 'white',
            border: '1px solid',
            borderColor: '#ccc',
            _hover: {
              borderColor: 'brand.primary'
            }
          }
        }
      }
    },
    Button: {
      variants: {
        primary: {
          bg: 'brand.primary',
          color: 'white',
          _hover: { bg: 'blue.600' }
        },
        success: {
          bg: 'brand.success',
          color: 'white',
          _hover: { bg: 'brand.hover' }
        },
        danger: {
          bg: 'brand.error',
          color: 'white',
          _hover: { bg: 'red.600' }
        }
      }
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: 'black'
        },
        header: {
          color: 'white'
        },
        closeButton: {
          color: 'white'
        }
      }
    }
  }
});

export default theme;
