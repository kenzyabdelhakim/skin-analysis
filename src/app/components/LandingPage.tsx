import { motion } from 'motion/react';
import { Button } from './Button';
import { Card } from './Card';
import { Sparkles, Scan, ShoppingBag, Shield } from 'lucide-react';

interface LandingPageProps {
  onStartAnalysis: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAnalysis }) => {
  return (
    <div className="min-h-screen w-full overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-glass-bg border-b border-glass-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-semibold text-xl">SkinAI</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </motion.div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Analyze Your Skin with AI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Personalized skincare insights in seconds. Discover your skin type and get tailored product recommendations.
            </p>
            <Button size="lg" onClick={onStartAnalysis} className="mb-12">
              Start Analysis
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative max-w-3xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blush to-lavender p-1">
              <div className="bg-background rounded-3xl p-12 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse" />
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="relative z-10"
                >
                  <Scan className="w-32 h-32 mx-auto text-primary opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-40 h-40 rounded-full border-4 border-primary"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl text-center mb-12"
          >
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Scan,
                title: 'Skin Type Detection',
                description: 'AI analyzes your skin to determine if it\'s dry, normal, or oily with precision confidence scores.'
              },
              {
                icon: Sparkles,
                title: 'Issue Analysis',
                description: 'Detects acne, dark spots, wrinkles, redness, and pore size with detailed probability scores.'
              },
              {
                icon: ShoppingBag,
                title: 'Smart Recommendations',
                description: 'Get personalized product suggestions tailored to your unique skin profile and concerns.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card glass hoverable className="p-8 h-full">
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl mb-6">Trusted by Thousands</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our AI-powered analysis is built on advanced machine learning models trained on diverse skin types and conditions.
            </p>
            <div className="flex flex-wrap justify-center gap-12 text-center">
              <div>
                <div className="text-4xl mb-2">98%</div>
                <div className="text-muted-foreground">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-4xl mb-2">50K+</div>
                <div className="text-muted-foreground">Analyses</div>
              </div>
              <div>
                <div className="text-4xl mb-2">4.9/5</div>
                <div className="text-muted-foreground">User Rating</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <p>AI-powered skin analysis is for informational purposes only. Consult a dermatologist for medical concerns.</p>
          <p className="mt-4">© 2026 SkinAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
