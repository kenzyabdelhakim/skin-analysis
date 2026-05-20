import { motion } from 'motion/react';
import { Button } from '../Button';
import { Sparkles, Droplets, Sun, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeroSectionProps {
  onStartAnalysis: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartAnalysis }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const floatingIcons = [
    { Icon: Sparkles, delay: 0, position: 'top-20 left-[10%]' },
    { Icon: Droplets, delay: 0.5, position: 'top-40 right-[15%]' },
    { Icon: Sun, delay: 1, position: 'bottom-40 left-[20%]' },
    { Icon: Shield, delay: 1.5, position: 'bottom-20 right-[10%]' }
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden section-charcoal">
      {/* Cinematic Background Container */}
      <div className="hero-background-container">
        {/* Animated Background Image with Parallax */}
        <div 
          className="hero-background-image hero-background-parallax"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        />
        
        {/* Dark Gradient Overlay for Text Readability */}
        <div className="hero-gradient-overlay" />
        
        {/* Animated Pink Glow Overlay */}
        <div className="hero-pink-glow-overlay" />
        
        {/* Vignette Effect */}
        <div className="hero-vignette" />
        
        {/* Floating Dust Particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="floating-dust-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              '--float-x': `${(Math.random() - 0.5) * 200}px`,
              '--float-y': `${-Math.random() * 300 - 100}px`,
            } as React.CSSProperties}
          />
        ))}
        
        {/* Soft Light Reflections */}
        <div 
          className="hero-light-reflection"
          style={{
            top: '20%',
            right: '15%',
            animationDelay: '0s'
          }}
        />
        <div 
          className="hero-light-reflection"
          style={{
            bottom: '25%',
            right: '25%',
            animationDelay: '4s'
          }}
        />
      </div>

      {/* Minimal Floating Icons */}
      {floatingIcons.slice(0, 2).map(({ Icon, delay, position }, index) => (
        <motion.div
          key={index}
          className={`absolute ${position} opacity-20 z-[5]`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.15, 0.25, 0.15],
            scale: [1, 1.1, 1],
            y: [0, -15, 0]
          }}
          transition={{
            delay,
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Icon className="w-8 h-8 text-primary minimal-icon" strokeWidth={1} />
        </motion.div>
      ))}

      {/* Content Layer */}
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center hero-content-layer pt-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 glass-editorial rounded-full border-baby-pink"
          >
            <span className="text-primary text-sm tracking-luxury-wide uppercase">AI-Powered Analysis</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="editorial-heading"
          >
            <span className="text-soft-white">Smart Skincare</span>
            <br />
            <span className="gradient-baby-pink">
              Starts Here
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="editorial-body max-w-lg"
          >
            Get instant AI skin analysis and personalized product recommendations delivered through our smart vending stations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={onStartAnalysis}
              className="editorial-button baby-pink-glow flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Analyze Your Skin
            </button>
            <button 
              className="glass-editorial px-8 py-4 rounded-lg text-primary border-baby-pink hover:bg-primary/5 transition-all text-sm tracking-luxury-wide uppercase"
            >
              Find a Station
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-12 mt-16 pt-8 border-t border-primary/10"
          >
            <div className="text-center fade-in-editorial delay-100">
              <div className="text-4xl font-light gradient-baby-pink mb-1">50K+</div>
              <div className="text-xs text-muted-foreground tracking-luxury uppercase">Happy Customers</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
            <div className="text-center fade-in-editorial delay-200">
              <div className="text-4xl font-light gradient-baby-pink mb-1">98%</div>
              <div className="text-xs text-muted-foreground tracking-luxury uppercase">Accuracy Rate</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
            <div className="text-center fade-in-editorial delay-300">
              <div className="text-4xl font-light gradient-baby-pink mb-1">24/7</div>
              <div className="text-xs text-muted-foreground tracking-luxury uppercase">Available</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right side - Empty space for vending machine visibility */}
        <div className="hidden lg:block" />
      </div>
    </section>
  );
};
