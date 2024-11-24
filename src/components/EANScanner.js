import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga';
import '../styles/scanner.css';
import { useToast } from '@chakra-ui/react'; // Importing Chakra UI toast for notifications

const EANScanner = ({ onDetected }) => {
  const scannerRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    if (scannerRef.current) {
      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: scannerRef.current,
            constraints: {
              facingMode: "environment", // Use the back camera
              width: { min: 640 },
              height: { min: 480 },
            },
          },
          decoder: {
            readers: ["code_128_reader"], // Reader type
          },
          locate: true, // Enables barcode locating before decoding
        },
        (err) => {
          if (err) {
            console.error("QuaggaJS initialization failed:", err);
            return;
          }
          Quagga.start();
        }
      );

      Quagga.onDetected((result) => {
        if (result && result.codeResult) {
          const scannedCode = result.codeResult.code;

          if (scannedCode.length === 16) {
            onDetected(scannedCode);
          } else {
            toast({
              title: "Palun kontrolli kinkekaardi numbrit!",
              description: "Leitud number peab olema täpselt 16 numbrit.",
              status: "warning",
              duration: 3000,
              isClosable: true,
            });
            Quagga.stop(); // Stop the scanner and close the modal
          }
        }
      });
    }

    return () => {
      Quagga.stop(); // Stop scanner on component unmount
    };
  }, [onDetected, toast]);

  return (
    <div className="scanner-container">
      <div ref={scannerRef} className="scanner-viewport" />
      <div className="scanner-laser" />
    </div>
  );
};

export default EANScanner;