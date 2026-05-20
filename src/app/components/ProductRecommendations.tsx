import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './Button';
import { Card } from './Card';
import { ShoppingBag, Star, Check, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  reason: string;
  benefits: string[];
}

interface ProductRecommendationsProps {
  skinType: string;
  detectedIssues: string[];
}

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  skinType,
  detectedIssues
}) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);

  const products: Product[] = [
    {
      id: '1',
      name: 'Gentle Hydrating Cleanser',
      category: 'Cleanser',
      price: 24.99,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
      reason: `Perfect for ${skinType} skin`,
      benefits: ['Gentle formula', 'Maintains pH balance', 'Non-stripping']
    },
    {
      id: '2',
      name: 'Balancing Toner',
      category: 'Toner',
      price: 19.99,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
      reason: detectedIssues.includes('Redness') ? 'Calms redness and irritation' : 'Balances skin pH',
      benefits: ['Alcohol-free', 'Soothing botanicals', 'Pore refining']
    },
    {
      id: '3',
      name: 'Niacinamide Serum',
      category: 'Serum',
      price: 32.99,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1620916297067-e046a2f1b5c5?w=400&h=400&fit=crop',
      reason: detectedIssues.includes('Dark Spots') ? 'Targets dark spots and hyperpigmentation' : 'Brightens and evens skin tone',
      benefits: ['10% Niacinamide', 'Brightening', 'Pore minimizing']
    },
    {
      id: '4',
      name: 'Lightweight Moisturizer',
      category: 'Moisturizer',
      price: 28.99,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1611930021592-a8cfd5319ceb?w=400&h=400&fit=crop',
      reason: `Optimized for ${skinType} skin hydration`,
      benefits: ['Non-comedogenic', 'Fast absorbing', 'Long-lasting hydration']
    },
    {
      id: '5',
      name: 'SPF 50 Sunscreen',
      category: 'Sunscreen',
      price: 26.99,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop',
      reason: 'Essential daily protection for all skin types',
      benefits: ['Broad spectrum', 'No white cast', 'Antioxidant boost']
    },
    {
      id: '6',
      name: 'Acne Treatment Gel',
      category: 'Treatment',
      price: 21.99,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=400&fit=crop',
      reason: detectedIssues.includes('Acne') ? 'Targets acne and prevents breakouts' : 'Spot treatment for blemishes',
      benefits: ['2% Salicylic acid', 'Fast-acting', 'Reduces inflammation']
    }
  ];

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectedProductDetails = products.filter(p => selectedProducts.includes(p.id));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl mb-2">Recommended Products</h2>
          <p className="text-muted-foreground">
            Personalized for your {skinType} skin
            {detectedIssues.length > 0 && ` and ${detectedIssues.join(', ')}`}
          </p>
        </div>
        {selectedProducts.length >= 2 && (
          <Button
            variant={compareMode ? 'primary' : 'secondary'}
            onClick={() => setCompareMode(!compareMode)}
          >
            {compareMode ? 'Exit Compare' : `Compare (${selectedProducts.length})`}
          </Button>
        )}
      </div>

      {compareMode && selectedProducts.length >= 2 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card glass className="p-8">
            <h3 className="mb-6">Product Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4">Feature</th>
                    {selectedProductDetails.map(product => (
                      <th key={product.id} className="p-4">
                        <div className="text-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 rounded-xl mx-auto mb-2 object-cover"
                          />
                          <div className="font-medium">{product.name}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-4">Price</td>
                    {selectedProductDetails.map(product => (
                      <td key={product.id} className="p-4 text-center">
                        ${product.price}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">Rating</td>
                    {selectedProductDetails.map(product => (
                      <td key={product.id} className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 fill-primary text-primary" />
                          {product.rating}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-4">Category</td>
                    {selectedProductDetails.map(product => (
                      <td key={product.id} className="p-4 text-center">
                        {product.category}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4">Key Benefits</td>
                    {selectedProductDetails.map(product => (
                      <td key={product.id} className="p-4">
                        <ul className="space-y-1 text-sm">
                          {product.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center gap-1">
                              <Check className="w-3 h-3 text-primary" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      ) : null}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => {
          const isSelected = selectedProducts.includes(product.id);
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                glass
                hoverable
                className={`
                  p-6 relative transition-all duration-300
                  ${isSelected ? 'ring-2 ring-primary' : ''}
                `}
              >
                <button
                  onClick={() => toggleProductSelection(product.id)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:scale-110 transition-transform"
                >
                  {isSelected ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                <div className="relative mb-4 rounded-2xl overflow-hidden aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full text-sm text-white">
                    {product.category}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="font-medium">{product.rating}</span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-2xl font-medium text-primary">
                      ${product.price}
                    </span>
                  </div>

                  <div className="bg-blush/30 rounded-xl p-3 mb-4">
                    <p className="text-sm">
                      <span className="font-medium">Why this works:</span> {product.reason}
                    </p>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {product.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button variant="primary" className="w-full gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Buy Now
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center"
      >
        <Card glass className="p-6 max-w-2xl mx-auto">
          <h4 className="mb-2">Complete Your Routine</h4>
          <p className="text-sm text-muted-foreground mb-4">
            For best results, use products in this order: Cleanser → Toner → Serum → Moisturizer → Sunscreen (AM only)
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="secondary" size="sm">
              Save Routine
            </Button>
            <Button variant="ghost" size="sm">
              Share Results
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
