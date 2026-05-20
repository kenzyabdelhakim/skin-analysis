import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../Button';
import { Card } from '../Card';
import { Upload, Camera, Scan, Zap, Brain, CheckCircle2, AlertCircle } from 'lucide-react';
import { CameraCapture } from '../CameraCapture';

interface SkinAnalysisSectionProps {
  onImageUpload: (imageDataUrl: string) => void;
  isAnalyzing?: boolean;
  error?: string | null;
}

const scanSteps = [
  { icon: Scan, text: 'Scanning image quality...' },
  { icon: Brain, text: 'AI analyzing skin type...' },
  { icon: Zap, text: 'Detecting skin concerns...' },
  { icon: CheckCircle2, text: 'Generating results...' }
];

export const SkinAnalysisSection: React.FC<SkinAnalysisSectionProps> = ({ 
  onImageUpload,
  isAnalyzing: externalIsAnalyzing = false,
  error = null
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const isAnalyzing = externalIsAnalyzing;

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleAnalyze = () => {
    if (preview) {
      setCurrentStep(0);

      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= scanSteps.length - 1) {
            clearInterval(stepInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 800);

      onImageUpload(preview);
    }
  };

  const handleCameraCapture = (imageDataUrl: string) => {
    setPreview(imageDataUrl);
    setIsCameraOpen(false);
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-black via-black-light to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,27,141,0.1),transparent_70%)]" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-5 py-2 glass-luxury rounded-full mb-6 neon-border"
          >
            <span className="text-primary font-medium tracking-wide">🔬 AI Analysis</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
            AI Skin Analysis
          </h2>
          <p className="text-xl text-gray-300">
            Upload a clear photo of your face for instant analysis
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 md:p-12 glass-luxury backdrop-blur-xl border-primary/30 neon-border">
            {!preview ? (
              <div>
                <div className="border-2 border-dashed border-primary/40 rounded-3xl p-12 text-center glass-luxury hover:border-primary transition-all duration-300 hover:bg-primary/5 luxury-card">
                  <motion.div
                    animate={{
                      y: [0, -15, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity
                    }}
                  >
                    <div className="relative inline-block mb-6">
                      <Upload className="w-24 h-24 text-primary neon-glow" />
                      <motion.div
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.6, 1, 0.6]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity
                        }}
                        className="absolute inset-0 bg-pink-glow rounded-full blur-2xl"
                      />
                    </div>
                  </motion.div>

                  <h3 className="text-3xl font-bold text-white mb-4">Upload Your Photo</h3>
                  <p className="text-gray-300 mb-8 text-lg">
                    Drag & drop or choose from your device
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant="primary"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2 btn-luxury-glow pulse-glow"
                    >
                      <Upload className="w-5 h-5" />
                      Choose File
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setIsCameraOpen(true)}
                      className="gap-2 glass-luxury border-primary/40 hover:border-primary/80 text-white"
                    >
                      <Camera className="w-5 h-5" />
                      Take Photo
                    </Button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                <div className="mt-8 glass-luxury rounded-2xl p-6 border border-primary/20">
                  <h4 className="font-semibold mb-4 text-white text-lg">💡 Tips for Best Results:</h4>
                  <ul className="space-y-3 text-sm text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span> Use natural or bright lighting
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span> Face the camera directly
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span> Remove makeup if possible
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span> Ensure your face is clearly visible
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <div className="relative rounded-3xl overflow-hidden mb-6">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-contain mx-auto"
                  />

                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center"
                    >
                      <div className="text-center text-white">
                        <motion.div
                          animate={{
                            rotate: 360
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear'
                          }}
                          className="w-32 h-32 mx-auto mb-6 relative"
                        >
                          <div className="absolute inset-0 border-4 border-primary rounded-full" />
                          <div className="absolute inset-2 border-4 border-pink-light rounded-full" />
                          <div className="absolute inset-4 border-4 border-primary rounded-full" />

                          {[...Array(8)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-8 bg-gradient-to-b from-primary to-transparent"
                              style={{
                                left: '50%',
                                top: 0,
                                transformOrigin: '0 64px'
                              }}
                              animate={{
                                rotate: [i * 45, i * 45 + 360],
                                opacity: [0.3, 1, 0.3]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'linear',
                                delay: i * 0.1
                              }}
                            />
                          ))}
                        </motion.div>

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-3 justify-center"
                          >
                            {(() => {
                              const StepIcon = scanSteps[currentStep].icon;
                              return (
                                <>
                                  <StepIcon className="w-6 h-6" />
                                  <span className="text-lg">{scanSteps[currentStep].text}</span>
                                </>
                              );
                            })()}
                          </motion.div>
                        </AnimatePresence>

                        <div className="flex gap-2 justify-center mt-6">
                          {scanSteps.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index <= currentStep ? 'bg-primary w-8' : 'bg-white/30'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {!isAnalyzing && (
                  <div className="flex gap-4 justify-center">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setPreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                        if (cameraInputRef.current) cameraInputRef.current.value = '';
                      }}
                      className="glass-luxury border-primary/30 hover:border-primary/60 text-white"
                    >
                      Change Photo
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleAnalyze}
                      className="gap-2 btn-luxury-glow pulse-glow"
                    >
                      <Scan className="w-5 h-5" />
                      Start Analysis
                    </Button>
                  </div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-5 glass-luxury border border-red-500/50 rounded-xl flex items-start gap-3"
                  >
                    <AlertCircle className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
                    <div>
                      <h4 className="font-semibold text-red-300 mb-1 text-lg">Analysis Failed</h4>
                      <p className="text-sm text-gray-300">{error}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAnalyze}
                        className="mt-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        Try Again
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Camera Modal */}
      <CameraCapture
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </section>
  );
};
