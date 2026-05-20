import { useState, useRef, DragEvent } from 'react';
import { motion } from 'motion/react';
import { Button } from './Button';
import { Card } from './Card';
import { Upload, Camera, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { CameraCapture } from './CameraCapture';

interface UploadPageProps {
  onImageUpload: (imageDataUrl: string) => void;
  onBack: () => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({ onImageUpload, onBack }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

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

  const handleStartAnalysis = () => {
    if (preview) {
      onImageUpload(preview);
    }
  };

  const handleCameraCapture = (imageDataUrl: string) => {
    setPreview(imageDataUrl);
    setIsCameraOpen(false);
  };

  return (
    <div className="min-h-screen w-full py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl md:text-5xl mb-4">Upload Your Photo</h1>
          <p className="text-lg text-muted-foreground">
            Take a clear, well-lit photo of your face for the best results.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card glass className="p-8 md:p-12">
            {!preview ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
                  ${isDragging ? 'border-primary bg-primary/10 scale-105' : 'border-border hover:border-primary'}
                `}
              >
                <motion.div
                  animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Upload className="w-16 h-16 text-primary mx-auto mb-6" />
                  <h3 className="mb-4">Drag & Drop Your Photo Here</h3>
                  <p className="text-muted-foreground mb-8">or choose an option below</p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant="primary"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <ImageIcon className="w-5 h-5" />
                      Choose File
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setIsCameraOpen(true)}
                      className="gap-2"
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

                  <p className="text-sm text-muted-foreground mt-8">
                    Supported formats: JPG, PNG, WEBP (max 10MB)
                  </p>
                </motion.div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative rounded-2xl overflow-hidden bg-muted">
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-contain mx-auto"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                      if (cameraInputRef.current) cameraInputRef.current.value = '';
                    }}
                  >
                    Change Photo
                  </Button>
                  <Button variant="primary" size="lg" onClick={handleStartAnalysis}>
                    Start Analysis
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="p-6 bg-blush/30 border-blush">
            <h4 className="mb-2">Tips for Best Results:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use natural lighting or bright indoor light</li>
              <li>• Face the camera directly with a neutral expression</li>
              <li>• Remove makeup if possible for more accurate analysis</li>
              <li>• Ensure your entire face is visible and in focus</li>
            </ul>
          </Card>
        </motion.div>
      </div>

      {/* Camera Modal */}
      <CameraCapture
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
};
