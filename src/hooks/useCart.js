
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();
const DELIVERY_FEE = 5.00;
const WHATSAPP_NUMBER = "5538999273737"; 

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('varandaJkCart');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('varandaJkCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, quantity = 1, selectedOption = null, hasCheckboxOptionSelected = false) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        cartItem => cartItem.id === item.id && cartItem.selectedOption === selectedOption && cartItem.hasCheckboxOptionSelected === hasCheckboxOptionSelected
      );
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id && cartItem.selectedOption === selectedOption && cartItem.hasCheckboxOptionSelected === hasCheckboxOptionSelected
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prevItems, { ...item, quantity, selectedOption, uniqueId: Date.now(), hasCheckboxOptionSelected }];
    });
  };

  const removeFromCart = (uniqueId) => {
    setCartItems(prevItems => prevItems.filter(item => item.uniqueId !== uniqueId));
  };

  const updateQuantity = (uniqueId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(uniqueId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.uniqueId === uniqueId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + DELIVERY_FEE;

  const generateWhatsAppMessage = (customerName, customerAddress) => {
    let message = `Olá, VARANDA JK! Gostaria de fazer o seguinte pedido:\n\n`;
    cartItems.forEach(item => {
      message += `${item.quantity}x ${item.name}`;
      if (item.selectedOption) {
        message += ` (Opção: ${item.selectedOption})`;
      }
      if (item.hasCheckboxOptionSelected && item.checkboxLabel) {
         message += ` (Com Queijo)`;
      }
      message += ` - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\nSubtotal: R$ ${subtotal.toFixed(2)}\n`;
    message += `Taxa de Entrega: R$ ${DELIVERY_FEE.toFixed(2)}\n`;
    message += `*Total do Pedido: R$ ${total.toFixed(2)}*\n\n`;
    message += `Nome do Cliente: ${customerName}\n`;
    message += `Endereço de Entrega: ${customerAddress}\n\n`;
    message += `Aguardando confirmação. Obrigado!`;
    
    return encodeURIComponent(message);
  };
  
  const getWhatsAppLink = (customerName, customerAddress) => {
    const message = generateWhatsAppMessage(customerName, customerAddress);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  };


  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      subtotal, 
      DELIVERY_FEE, 
      total,
      getWhatsAppLink
    }}>
      {children}
    </CartContext.Provider>
  );
};
