import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useEffect } from 'react';
import { Home, Info, MapPin, Wrench, Mail, Package, LogOut, History, ShoppingCart } from 'lucide-react';
import { Button } from '../Button';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
  onOpenHistory?: () => void;
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenHistory, onOpenCart }) => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const navBg = useTransform(
    scrollY,
    [0, 100],
    ['rgba(10, 10, 10, 0)', 'rgba(10, 10, 10, 0.95)']
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', icon: Home, href: '#home' },
    { name: 'About Us', icon: Info, href: '#about' },
    { name: 'Branches', icon: MapPin, href: '#branches' },
    { name: 'Services', icon: Wrench, href: '#services' },
    { name: 'Contact', icon: Mail, href: '#contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{ backgroundColor: navBg }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-luxury shadow-lg shadow-primary/10' : 'backdrop-blur-sm'
      } border-b ${scrolled ? 'border-primary/30' : 'border-primary/10'}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="relative">
              <Package className="w-9 h-9 text-primary neon-glow" strokeWidth={2.5} />
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute inset-0 bg-pink-glow rounded-lg blur-lg"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-pink-medium to-pink-dark bg-clip-text text-transparent gradient-shift">
                DermaStation
              </h1>
              <p className="text-xs text-gray-400 tracking-wide">Smart Skincare Hub</p>
            </div>
          </motion.div>

          {/* Nav links */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-gray-300 hover:text-primary transition-all duration-300 group relative"
              >
                <item.icon className="w-4 h-4 group-hover:scale-125 group-hover:drop-shadow-[0_0_8px_rgba(255,27,141,0.8)] transition-all" />
                <span className="font-medium">{item.name}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-pink-dark group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          {/* Right side actions */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            {/* History icon */}
            {user && (
              <button
                onClick={onOpenHistory}
                title="Analysis History"
                className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary transition-all hover:bg-primary/10"
              >
                <History className="w-5 h-5" />
              </button>
            )}

            {/* Cart icon */}
            <button
              onClick={onOpenCart}
              title="My Routine"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary transition-all hover:bg-primary/10"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ background: '#FFB3D9', color: '#0D0D0D' }}
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="w-px h-5 mx-1" style={{ background: 'rgba(255,179,217,0.2)' }} />

            {/* User greeting + sign out */}
            {user && (
              <span className="hidden sm:block text-sm text-gray-400">
                Hi, <span className="text-primary font-medium">{user.first_name || user.username}</span>
              </span>
            )}
            {user ? (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-primary border border-primary/20 hover:border-primary/50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            ) : (
              <Button variant="primary" size="sm" className="btn-luxury-glow">
                Get Started
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};
