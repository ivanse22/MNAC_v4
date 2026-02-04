import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Camera, Zap, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { hapticService } from '../services/hapticService';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (isOpen) {
      startScanner();
    } else {
      stopScanner();
    }
    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const startScanner = async () => {
    setError(null);
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length) {
        setHasPermission(true);
        const cameraId = devices[0].id;
        
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode("qr-reader", {
            verbose: false,
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
          });
        }

        await scannerRef.current.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            handleScanSuccess(decodedText);
          },
          (errorMessage) => {
            // Ignoramos errores de frame vacío
          }
        );
      } else {
        setError("No se detectaron cámaras.");
      }
    } catch (err) {
      console.error(err);
      setError("Permiso de cámara denegado o error de inicialización.");
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner", err);
      }
    }
  };

  const handleScanSuccess = (text: string) => {
    hapticService.success();
    stopScanner();
    onClose();
    
    // Formato esperado: mnac:art-id (ej: mnac:art-0)
    // O simplemente el ID si es un QR simple
    const artId = text.replace('mnac:', '');
    
    // Navegación
    navigate(`/artwork/${artId}`);
  };

  const handleSimulateScan = () => {
    // Para probar en simulador sin cámara real o sin QR físico
    handleScanSuccess("art-0"); // Pantocrátor
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-black/50 backdrop-blur-md absolute top-0 w-full z-10 pt-safe">
        <h3 className="text-white font-sans font-bold text-xl">Escanear Obra</h3>
        <button 
          onClick={onClose} 
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Camera Viewport */}
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
         {error ? (
           <div className="text-center px-8">
              <div className="w-16 h-16 bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Camera size={32} />
              </div>
              <p className="text-gray-300 mb-6">{error}</p>
              <button onClick={handleSimulateScan} className="bg-mnac-red text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs">
                Probar Modo Demo
              </button>
           </div>
         ) : (
           <>
             <div id="qr-reader" className="w-full h-full object-cover"></div>
             {/* Overlay visual de escaneo */}
             <div className="absolute inset-0 pointer-events-none border-[40px] border-black/50 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-mnac-gold/50 rounded-3xl relative animate-pulse">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-mnac-gold -mt-1 -ml-1 rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-mnac-gold -mt-1 -mr-1 rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-mnac-gold -mb-1 -ml-1 rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-mnac-gold -mb-1 -mr-1 rounded-br-xl"></div>
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500/50 shadow-[0_0_10px_rgba(255,0,0,0.5)]"></div>
                </div>
             </div>
             <p className="absolute bottom-32 text-white/70 text-sm font-light uppercase tracking-widest animate-pulse">
                Apunta al código QR de la obra
             </p>
           </>
         )}
      </div>

      {/* Footer Controls */}
      <div className="p-8 pb-safe bg-black/80 backdrop-blur-xl flex justify-around items-center">
         <button className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
               <Zap size={18} />
            </div>
            <span className="text-[10px] uppercase font-bold">Flash</span>
         </button>
         
         <button 
           onClick={handleSimulateScan}
           className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
         >
            <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
               <span className="text-[10px] font-black">DEMO</span>
            </div>
         </button>

         <button className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
               <ImageIcon size={18} />
            </div>
            <span className="text-[10px] uppercase font-bold">Imagen</span>
         </button>
      </div>
    </div>
  );
};

export default QRScannerModal;