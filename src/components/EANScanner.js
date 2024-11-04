import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga';
import '../styles/scanner.css';

const EANScanner = ({ onDetected }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (scannerRef.current) {
        Quagga.init({
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: scannerRef.current,
            constraints: {
              facingMode: "environment",
              width: { min: 450 },
              height: { min: 300 },
              aspectRatio: { min: 1, max: 2 }
            },
          },
          locator: {
            patchSize: "medium",
            halfSample: true
          },
          numOfWorkers: 2,
          decoder: {
            readers: ["code_128_reader"]
          },
          locate: true
        }, function(err) {
          if (err) {
            console.error("Scanner initialization failed:", err);
            return;
          }
          Quagga.start();
        });

        Quagga.onDetected((result) => {
          if (result && result.codeResult) {
            onDetected(result.codeResult.code);
            Quagga.stop();
          }
        });
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
      Quagga.stop();
    };
  }, [onDetected]);

  return (
    <div className="scanner-container">
      <div ref={scannerRef} className="scanner-viewport" />
      <div className="scanner-laser" />
    </div>
  );
};

export default EANScanner;
