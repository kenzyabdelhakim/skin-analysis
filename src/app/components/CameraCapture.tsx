import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './Button';
import { Camera, X, RotateCcw, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Camera permission denied. Please allow camera access in your browser settings.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('No camera found. Please connect a camera and try again.');
        } else {
          setError('Unable to access camera. Please check your device settings.');
        }
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCaptured(false);
    setCapturedImage(null);
    setError(null);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedImage(imageDataUrl);
        setIsCaptured(true);
      }
    }
  };

  const retakePhoto = () => {
    setIsCaptured(false);
    setCapturedImage(null);
  };

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      stopCamera();
      onClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-black-light border border-primary/30 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-primary/20">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Camera className="w-6 h-6 text-primary" />
                Take Photo
              </h3>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Camera View */}
            <div className="relative bg-black aspect-video">
              {error ? (
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-white mb-2">Camera Error</h4>
                    <p className="text-gray-300 mb-4">{error}</p>
                    <Button variant="primary" onClick={startCamera}>
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {!isCaptured ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={capturedImage || ''}
                      alt="Captured"
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Camera overlay guide */}
                  {!isCaptured && !error && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-80 border-2 border-primary/50 rounded-full" />
                      </div>
                      <div className="absolute bottom-4 left-0 right-0 text-center">
                        <p className="text-white text-sm bg-black/50 inline-block px-4 py-2 rounded-full">
                          Position your face within the circle
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Controls */}
            {!error && (
              <div className="p-6 flex justify-center gap-4">
                {!isCaptured ? (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={capturePhoto}
                    className="gap-2 min-w-[200px]"
                  >
                    <Camera className="w-5 h-5" />
                    Capture Photo
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={retakePhoto}
                      className="gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Retake
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={confirmCapture}
                      className="gap-2 min-w-[200px]"
                    >
                      Use This Photo
                    </Button>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
