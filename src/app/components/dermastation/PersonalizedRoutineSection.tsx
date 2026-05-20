import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Sparkles, CheckCircle2, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface Product {
  id: string;
  name: string;
  image: string;
  price: string;
  reason: string;
  tags: string[];
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem, items } = useCart();
  const [flash, setFlash] = useState(false);
  const inCart = items.some((i) => i.id === product.id);

  function handleAdd() {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image, priceNum: 0 });
    setFlash(true);
    setTimeout(() => setFlash(false), 1500);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.8 }}
      className="recommendation-card-luxury group"
    >
      {/* Recommended Badge */}
      <div className="absolute -top-3 -right-3 z-10">
        <div className="bg-gradient-to-br from-primary to-pink-medium px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span className="text-xs font-medium text-white tracking-wide">Recommended</span>
        </div>
      </div>

      {/* Product Image */}
      <div className="relative overflow-hidden rounded-t-editorial mb-6 bg-black/20">
        <div className="aspect-square flex items-center justify-center p-8">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop';
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Product Info */}
      <div className="px-6 pb-6 space-y-4">
        <h3 className="text-lg font-light text-soft-white leading-snug tracking-luxury min-h-[3.5rem]">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-light gradient-baby-pink">{product.price}</span>
        </div>
        <div className="recommendation-reason">
          <p className="text-sm text-soft-white leading-relaxed font-light">{product.reason}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="px-3 py-1 text-xs glass-editorial rounded-full border-baby-pink text-primary tracking-wide">
              {tag}
            </span>
          ))}
        </div>

        {/* Add to Routine button */}
        <div className="pt-4">
          <button
            onClick={handleAdd}
            className="w-full product-button-primary group/btn relative overflow-hidden"
            style={inCart ? { opacity: 0.85 } : {}}
          >
            <AnimatePresence mode="wait">
              {flash ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Added!
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                  {inCart ? 'Add Again' : 'Add to Routine'}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface PersonalizedRoutineSectionProps {
  skinType?: string;
  concerns?: string[];
}

export const PersonalizedRoutineSection: React.FC<PersonalizedRoutineSectionProps> = ({ 
  skinType, 
  concerns = [] 
}) => {
  // Product database
  const productDatabase = {
    'shaan-gel': {
      id: 'shaan-gel',
      name: 'Shaan Soothing Gel 200 gm',
      image: '/images/shaan-gel.png',
      price: 'LE 220.00',
      baseReason: 'Triple efficacy moisturizer for face and body',
      tags: ['Oily Skin', 'Combination Skin', 'Moisturizer']
    },
    'bobai-sunscreen': {
      id: 'bobai-sunscreen',
      name: 'Bobai Sunscreen Extra Lightening Gel SPF 50',
      image: '/images/bobai-sunscreen.png',
      price: 'LE 350.00',
      baseReason: 'Essential daily protection for all skin types',
      tags: ['SPF 50', 'All Skin Types', 'UV Protection']
    },
    'glamy-lab': {
      id: 'glamy-lab',
      name: 'GLAMY LAB Whitening Cream SPF 30 50 gm',
      image: '/images/glamy-lab.png',
      price: 'LE 460.00',
      baseReason: 'Targets dark spots and improves skin tone',
      tags: ['Dark Spots', 'Brightening', 'SPF 30']
    },
    'clary-cleanser': {
      id: 'clary-cleanser',
      name: 'Clary Cleanser 300 ml',
      image: '/images/clary-cleanser.png',
      price: 'LE 280.50',
      baseReason: 'Deep cleansing with brightening effect',
      tags: ['Acne', 'Redness', 'All Skin Types']
    }
  };

  // Smart recommendation logic
  const getRecommendedProducts = (): Product[] => {
    const recommended = new Set<string>();
    const products: Product[] = [];

    // Always recommend sunscreen
    recommended.add('bobai-sunscreen');

    // Skin type based recommendations
    if (skinType === 'oily' || skinType === 'combination') {
      recommended.add('shaan-gel');
    }

    // Concern based recommendations
    concerns.forEach(concern => {
      const concernLower = concern.toLowerCase();
      
      if (concernLower.includes('acne') || concernLower.includes('redness')) {
        recommended.add('clary-cleanser');
      }
      
      if (concernLower.includes('dark spot') || concernLower.includes('dark_spot') || 
          concernLower.includes('uneven') || concernLower.includes('pigment')) {
        recommended.add('glamy-lab');
      }
    });

    // Build product list with personalized reasons
    recommended.forEach(productId => {
      const product = productDatabase[productId as keyof typeof productDatabase];
      if (product) {
        let reason = product.baseReason;
        
        // Customize reason based on detection
        if (productId === 'shaan-gel' && skinType) {
          reason = `Perfect for ${skinType} skin. ${product.baseReason}`;
        }
        
        if (productId === 'clary-cleanser' && concerns.length > 0) {
          const matchedConcerns = concerns.filter(c => 
            c.toLowerCase().includes('acne') || c.toLowerCase().includes('redness')
          );
          if (matchedConcerns.length > 0) {
            reason = `Helps with ${matchedConcerns.join(' and ')}. ${product.baseReason}`;
          }
        }
        
        if (productId === 'glamy-lab' && concerns.length > 0) {
          const matchedConcerns = concerns.filter(c => 
            c.toLowerCase().includes('dark spot') || c.toLowerCase().includes('dark_spot')
          );
          if (matchedConcerns.length > 0) {
            reason = `Specifically targets dark spots. ${product.baseReason}`;
          }
        }

        products.push({
          ...product,
          reason
        });
      }
    });

    return products;
  };

  const recommendedProducts = getRecommendedProducts();

  // Don't render if no data
  if (!skinType && concerns.length === 0) {
    return null;
  }

  return (
    <section className="section-spacer section-charcoal relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(248,168,201,0.05),transparent_70%)]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass-editorial rounded-full mb-8 border-baby-pink"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm tracking-luxury-wide uppercase">AI-Powered Recommendations</span>
          </motion.div>
          
          <h2 className="editorial-heading mb-6">
            Your Personalized Skincare Routine
          </h2>
          
          <p className="editorial-body max-w-2xl mx-auto">
            Based on your {skinType && <span className="text-primary font-medium">{skinType} skin</span>}
            {skinType && concerns.length > 0 && ' and '}
            {concerns.length > 0 && (
              <span className="text-primary font-medium">
                {concerns.length} detected concern{concerns.length > 1 ? 's' : ''}
              </span>
            )}
            , we've curated the perfect routine for you
          </p>
        </motion.div>

        {/* Recommended Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {recommendedProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 glass-editorial rounded-editorial-lg p-8 border-baby-pink max-w-3xl mx-auto"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-light text-soft-white mb-2 tracking-luxury">
                Why These Products?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                Our AI analyzed your skin and selected products that work synergistically to address your specific needs. 
                This routine is designed to give you optimal results while maintaining your skin's natural balance.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
