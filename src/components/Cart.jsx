
import React from 'react';
import { useCart } from '@/hooks/useCart.jsx';
import { Button } from '@/components/ui/button.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';
import { X, Plus, Minus, ShoppingBag, Utensils, ImageOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const CartItemImage = ({ src, alt }) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError || !src) {
    return (
      <div className="w-20 h-20 bg-varanda-brown flex items-center justify-center rounded-md mr-4">
        <ImageOff className="h-10 w-10 text-varanda-beige-dark" />
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className="w-20 h-20 object-cover rounded-md mr-4" 
      onError={handleImageError}
    />
  );
};

const Cart = ({ isOpen, onClose, onCheckout }) => {
  const { cartItems, removeFromCart, updateQuantity, subtotal, DELIVERY_FEE, total } = useCart();

  if (!isOpen) return null;

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex justify-end" 
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-md bg-varanda-brown-dark shadow-xl z-50 flex flex-col h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-varanda-beige-dark">
          <h2 className="text-2xl font-semibold rustic-title text-primary flex items-center">
            <ShoppingBag className="mr-3 h-7 w-7"/> Seu Pedido
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar carrinho">
            <X className="h-6 w-6 text-primary" />
          </Button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
            <Utensils className="h-20 w-20 text-varanda-gold-light mb-4" />
            <p className="text-xl text-varanda-beige">Seu carrinho está vazio.</p>
            <p className="text-sm text-varanda-beige-dark mt-2">Adicione itens do cardápio para começar!</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-grow p-6">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.uniqueId}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex items-start justify-between py-4 border-b border-varanda-brown"
                  >
                    <CartItemImage src={item.imageUrl} alt={item.name} />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-varanda-beige">{item.name}</h3>
                      {item.selectedOption && <p className="text-xs text-varanda-beige-dark">Opção: {item.selectedOption}</p>}
                      {item.hasCheckboxOptionSelected && item.checkbox_label && <p className="text-xs text-varanda-beige-dark">{item.checkbox_label.split('(')[0].trim()}</p>}
                      <p className="text-sm text-primary">R$ {parseFloat(item.price).toFixed(2)}</p>
                      <div className="flex items-center mt-2">
                        <Button variant="outline" size="icon" className="h-7 w-7 border-primary text-primary hover:bg-primary/10" onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="mx-3 text-varanda-beige">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7 border-primary text-primary hover:bg-primary/10" onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => removeFromCart(item.uniqueId)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>

            <div className="p-6 border-t border-varanda-beige-dark space-y-3 bg-varanda-brown">
              <div className="flex justify-between text-varanda-beige">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-varanda-beige">
                <span>Taxa de Entrega</span>
                <span>R$ {DELIVERY_FEE.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-primary">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <Button onClick={onCheckout} size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4 transition-transform hover:scale-105">
                Finalizar Pedido
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Cart;
