import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './Card';
import { Scan, Sparkles, Brain, CheckCircle2 } from 'lucide-react';

const analysisSteps = [
  { icon: Scan, text: 'Analyzing image quality...', duration: 1000 },
  { icon: Brain, text: 'Detecting skin type...', duration: 1200 },
  { icon: Sparkles, text: 'Identifying skin concerns...', duration: 1500 },
  { icon: CheckCircle2, text: 'Generating recommendations...', duration: 1300 }
];

export const AnalysisLoading: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let elapsed = 0;
    const totalDuration = analysisSteps.reduce((sum, step) => sum + step.duration, 0);

    const interval = setInterval(() => {
      elapsed += 50;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      let cumulativeDuration = 0;
      for (let i = 0; i < analysisSteps.length; i++) {
        cumulativeDuration += analysisSteps[i].duration;
        if (elapsed < cumulativeDuration) {
          setCurrentStep(i);
          break;
        }
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <Card glass className="p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

          <div className="relative z-10 space-y-8">
            <div className="text-center mb-12">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl mb-4"
              >
                Analyzing Your Skin...
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground"
              >
                Our AI is examining your skin with precision
              </motion.p>
            </div>

            <div className="relative">
              <div className="relative w-64 h-64 mx-auto mb-8">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  className="absolute inset-0 rounded-full border-4 border-primary/20"
                />

                <motion.div
                  animate={{
                    scale: [1.1, 1, 1.1],
                    rotate: [360, 180, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  className="absolute inset-4 rounded-full border-4 border-accent/30"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      y: [-5, 5, -5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    <Scan className="w-24 h-24 text-primary" />
                  </motion.div>
                </div>

                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-8 bg-gradient-to-b from-primary to-transparent"
                    style={{
                      left: '50%',
                      top: 0,
                      transformOrigin: '0 128px'
                    }}
                    animate={{
                      rotate: [i * 45, i * 45 + 360],
                      opacity: [0.2, 0.8, 0.2]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: i * 0.1
                    }}
                  />
                ))}
              </div>

              <div className="w-full bg-muted rounded-full h-2 overflow-hidden mb-6">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {analysisSteps.map((step, index) => (
                    index === currentStep && (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-4 justify-center"
                      >
                        <motion.div
                          animate={{
                            rotate: [0, 360]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear'
                          }}
                        >
                          <step.icon className="w-6 h-6 text-primary" />
                        </motion.div>
                        <span className="text-lg">{step.text}</span>
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>

                <div className="flex justify-center gap-2 mt-6">
                  {analysisSteps.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`
                        w-2 h-2 rounded-full transition-all duration-300
                        ${index <= currentStep ? 'bg-primary' : 'bg-muted'}
                      `}
                      animate={index === currentStep ? { scale: [1, 1.5, 1] } : {}}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm text-muted-foreground"
            >
              This usually takes just a few seconds...
            </motion.p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
