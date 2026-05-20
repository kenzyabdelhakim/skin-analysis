import { motion } from 'motion/react';
import { Button } from '../Button';
import { Card } from '../Card';
import { Package, Scan, ShoppingBag, Clock, MapPin, Zap } from 'lucide-react';

export const VendingMachineSection: React.FC = () => {
  const features = [
    {
      icon: Scan,
      title: 'AI Analysis',
      description: 'Scan your face at any DermaStation kiosk for instant skin analysis'
    },
    {
      icon: ShoppingBag,
      title: 'Smart Recommendations',
      description: 'Get personalized product suggestions based on your unique skin profile'
    },
    {
      icon: Package,
      title: 'Instant Dispensing',
      description: 'Products dispensed immediately after purchase - no waiting'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Access skincare solutions anytime, anywhere with our smart vending stations'
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-black via-black-light to-black relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,27,141,0.15),transparent_70%)] gradient-shift" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-5 py-2 glass-luxury rounded-full mb-6 neon-border"
          >
            <span className="text-primary font-medium tracking-wide">🚀 Innovation</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
            Smart Vending, Smarter Skincare
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the future of skincare with our AI-powered vending stations
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <motion.div
                animate={{
                  y: [0, -20, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="relative"
              >
                <Card className="p-12 glass-luxury border-primary/30 backdrop-blur-xl luxury-card neon-border">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-8">
                      <Package className="w-32 h-32 text-primary neon-glow" strokeWidth={1.5} />
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.4, 0.8, 0.4]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity
                        }}
                        className="absolute inset-0 bg-pink-glow rounded-full blur-3xl"
                      />
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-4">
                      DermaStation Kiosk
                    </h3>
                    <p className="text-gray-300 mb-8 text-lg">
                      Next-generation skincare vending with built-in AI analysis
                    </p>

                    <div className="grid grid-cols-3 gap-4 w-full">
                      {[
                        { label: 'Touch Screen', icon: Scan },
                        { label: 'AI Camera', icon: Zap },
                        { label: 'Smart Dispenser', icon: Package }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.1, y: -5 }}
                          className="glass-luxury backdrop-blur-sm rounded-xl p-4 border border-primary/30 hover:border-primary/60 transition-all neon-border"
                        >
                          <item.icon className="w-7 h-7 text-primary mx-auto mb-2 drop-shadow-[0_0_10px_rgba(255,27,141,0.6)]" />
                          <div className="text-xs text-white font-medium">{item.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                animate={{
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="absolute -top-10 -right-10 w-40 h-40 border-4 border-primary/20 rounded-full blur-sm"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 10 }}
              >
                <Card className="p-6 glass-luxury backdrop-blur-xl border-primary/30 hover:border-primary/60 transition-all luxury-card">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-primary to-pink-dark rounded-xl pulse-glow">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-2 text-white text-lg">{feature.title}</h4>
                      <p className="text-sm text-gray-300 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-12 text-center relative overflow-hidden"
          style={{
            background: 'rgba(18,18,18,0.95)',
            border: '1px solid rgba(255,179,217,0.25)',
            boxShadow: '0 0 80px rgba(255,179,217,0.1), inset 0 0 80px rgba(255,179,217,0.03)',
          }}
        >
          {/* Subtle pink dot pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,179,217,1) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
          {/* Pink top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-4 text-foreground">Find a DermaStation Near You</h3>
            <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
              Visit one of our locations to experience AI-powered skincare vending
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="secondary" size="lg" className="gap-2 btn-luxury-glow"
                style={{ background: '#FFB3D9', color: '#0D0D0D' }}>
                <MapPin className="w-5 h-5" />
                View Locations
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="glass-luxury text-foreground"
                style={{ border: '1px solid rgba(255,179,217,0.3)' }}
              >
                Learn More
              </Button>
            </div>

            <div className="flex justify-center gap-12 mt-12">
              <div>
                <div className="text-5xl font-bold text-primary">50+</div>
                <div className="text-muted-foreground mt-1">Locations</div>
              </div>
              <div className="w-px" style={{ background: 'rgba(255,179,217,0.2)' }} />
              <div>
                <div className="text-5xl font-bold text-primary">24/7</div>
                <div className="text-muted-foreground mt-1">Available</div>
              </div>
              <div className="w-px" style={{ background: 'rgba(255,179,217,0.2)' }} />
              <div>
                <div className="text-5xl font-bold text-primary">100+</div>
                <div className="text-muted-foreground mt-1">Products</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
