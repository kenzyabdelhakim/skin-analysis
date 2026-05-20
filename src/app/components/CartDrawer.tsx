import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: Props) {
  const { items, removeItem, updateQty, clearCart, totalItems, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          />

          {/* Drawer */}
          <motion.aside
            key="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm flex flex-col"
            style={{
              background: 'rgba(13,13,13,0.98)',
              borderLeft: '1px solid rgba(255,179,217,0.2)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,179,217,0.15)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,179,217,0.15)' }}
                >
                  <ShoppingBag className="w-4 h-4" style={{ color: '#FFB3D9' }} />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground text-sm">My Routine</h2>
                  <p className="text-xs text-gray-500">
                    {totalItems} product{totalItems !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1 rounded"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-foreground transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,179,217,0.1)' }}
                  >
                    <ShoppingCart className="w-6 h-6" style={{ color: '#FFB3D9' }} />
                  </div>
                  <p className="text-sm font-medium text-foreground">No routine yet</p>
                  <p className="text-xs text-gray-500 text-center">
                    Add products using "Add to Routine"
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                        className="flex gap-3 p-3 rounded-xl"
                        style={{
                          background: 'rgba(22,22,22,0.9)',
                          border: '1px solid rgba(255,179,217,0.12)',
                        }}
                      >
                        {/* Image */}
                        <div
                          className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                          style={{ background: 'rgba(0,0,0,0.4)' }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain p-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground leading-snug line-clamp-2">
                            {item.name}
                          </p>
                          <p className="text-sm font-semibold mt-1" style={{ color: '#FFB3D9' }}>
                            {item.price}
                          </p>

                          {/* Qty controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110"
                              style={{ background: 'rgba(255,179,217,0.15)', color: '#FFB3D9' }}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs text-foreground w-4 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110"
                              style={{ background: 'rgba(255,179,217,0.15)', color: '#FFB3D9' }}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="self-start p-1.5 rounded-lg text-gray-600 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer — total + checkout */}
            {items.length > 0 && (
              <div
                className="px-5 py-4 flex-shrink-0 space-y-3"
                style={{ borderTop: '1px solid rgba(255,179,217,0.15)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total</span>
                  <span className="text-lg font-semibold" style={{ color: '#FFB3D9' }}>
                    LE {totalPrice.toFixed(2)}
                  </span>
                </div>
                <button
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #FFB3D9, #FF99CC)',
                    color: '#0D0D0D',
                  }}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
