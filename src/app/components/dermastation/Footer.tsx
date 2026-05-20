import { motion } from 'motion/react';
import { Package, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  const footerSections = [
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Press', 'Blog']
    },
    {
      title: 'Services',
      links: ['Skin Analysis', 'Products', 'Locations', 'Partnership']
    },
    {
      title: 'Support',
      links: ['Help Center', 'Contact', 'Privacy Policy', 'Terms of Service']
    }
  ];

  const socialLinks = [
    { icon: Instagram, href: '#' },
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' }
  ];

  return (
    <footer id="contact" className="bg-gradient-to-b from-black via-black-light to-black border-t border-primary/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,27,141,0.1),transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <Package className="w-9 h-9 text-primary neon-glow" strokeWidth={2.5} />
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-pink-medium to-pink-dark bg-clip-text text-transparent gradient-shift">
                  DermaStation
                </h3>
                <p className="text-xs text-gray-400 tracking-wide">Smart Skincare Hub</p>
              </div>
            </motion.div>

            <p className="text-gray-300 mb-6 max-w-sm leading-relaxed">
              Revolutionizing skincare with AI-powered analysis and smart vending technology.
              Your perfect skin routine, delivered 24/7.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors cursor-pointer">
                <Mail className="w-5 h-5 text-primary" />
                <span>contact@dermastation.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors cursor-pointer">
                <Phone className="w-5 h-5 text-primary" />
                <span>1-800-DERMA-ST</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 hover:text-primary transition-colors cursor-pointer">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Available at 50+ locations nationwide</span>
              </div>
            </div>
          </div>

          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="font-bold mb-4 text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-primary transition-colors relative group"
                    >
                      <span className="relative">
                        {link}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-primary/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2026 DermaStation. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.15, y: -3 }}
                  className="w-11 h-11 rounded-full glass-luxury border border-primary/30 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all neon-border"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
