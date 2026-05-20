import { motion } from 'motion/react';
import { Button } from '../Button';
import { Card } from '../Card';
import { ShoppingBag, Star, Heart } from 'lucide-react';

interface ProductsSectionProps {
  skinType?: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  badge?: string;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ skinType }) => {
  const products: Product[] = [
    {
      id: '1',
      name: 'Gentle Hydrating Cleanser',
      category: 'Cleanser',
      description: 'pH-balanced formula that cleanses without stripping natural oils',
      price: 24.99,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
      badge: 'Bestseller'
    },
    {
      id: '2',
      name: 'Balancing Rose Toner',
      category: 'Toner',
      description: 'Alcohol-free toner with rose water and hyaluronic acid',
      price: 19.99,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop'
    },
    {
      id: '3',
      name: 'Vitamin C Brightening Serum',
      category: 'Serum',
      description: '15% Vitamin C with ferulic acid for radiant skin',
      price: 34.99,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1620916297067-e046a2f1b5c5?w=400&h=400&fit=crop',
      badge: 'New'
    },
    {
      id: '4',
      name: 'Nourishing Day Moisturizer',
      category: 'Moisturizer',
      description: 'Lightweight hydration with SPF 30 protection',
      price: 28.99,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1611930021592-a8cfd5319ceb?w=400&h=400&fit=crop'
    },
    {
      id: '5',
      name: 'Invisible Sunscreen SPF 50',
      category: 'Sunscreen',
      description: 'Broad spectrum protection with no white cast',
      price: 26.99,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop',
      badge: 'Recommended'
    },
    {
      id: '6',
      name: 'Overnight Repair Cream',
      category: 'Night Cream',
      description: 'Rich formula with peptides and retinol for overnight renewal',
      price: 32.99,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=400&fit=crop'
    }
  ];

  return (
    <section id="services" className="section-spacer section-dark-gray relative overflow-hidden">
      {/* Minimal Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,179,217,0.04),transparent_70%)]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 glass-editorial rounded-full mb-8 border-baby-pink"
          >
            <span className="text-primary text-sm tracking-luxury-wide uppercase">Premium Collection</span>
          </motion.div>
          <h2 className="editorial-heading mb-6">
            Premium Skincare Products
          </h2>
          <p className="editorial-body max-w-2xl mx-auto">
            {skinType
              ? `Curated recommendations for ${skinType} skin`
              : 'Professional-grade products for every skin type'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.8 }}
              className="fade-in-editorial"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <Card className="overflow-hidden h-full flex flex-col editorial-card hover-scale-editorial">
                <div className="relative overflow-hidden image-zoom-scroll">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-72 object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {product.badge && (
                    <div className="absolute top-6 left-6 px-4 py-2 glass-editorial text-primary rounded-full text-xs tracking-luxury-wide uppercase border-baby-pink">
                      {product.badge}
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="absolute top-6 right-6 w-12 h-12 glass-editorial rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border-baby-pink"
                  >
                    <Heart className="w-5 h-5 text-primary" />
                  </motion.button>

                  <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="editorial-button w-full text-xs flex items-center justify-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      Quick Add
                    </button>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-primary tracking-luxury-wide uppercase border-baby-pink px-3 py-1.5 rounded-full glass-editorial">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-sm font-light text-soft-white">{product.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-light text-soft-white mb-3 tracking-luxury">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6 flex-1 leading-relaxed font-light">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-primary/10">
                    <span className="text-3xl font-light gradient-baby-pink">
                      ${product.price}
                    </span>
                    <button className="text-primary hover:text-pink-medium text-sm tracking-luxury uppercase transition-colors">
                      Details →
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <button className="editorial-button baby-pink-glow">
            View All Products
          </button>
        </motion.div>
      </div>
    </section>
  );
};
