
import React from 'react';
import { ShoppingCart, Beef as Burger } from 'lucide-react';
import { useCart } from '@/hooks/useCart.jsx';

const Header = ({ onCartClick, children }) => {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-varanda-brown-dark sticky top-0 z-40 shadow-md">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Burger className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold rustic-title text-primary">
              VARANDA JK
            </h1>
          </div>
          <button
            onClick={onCartClick}
            className="relative p-2 rounded-full hover:bg-varanda-gold-light/20 transition-colors"
            aria-label="Abrir carrinho"
          >
            <ShoppingCart className="h-7 w-7 text-primary" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
        {children && <div className="pb-2">{children}</div>}
      </div>
    </header>
  );
};

export default Header;
