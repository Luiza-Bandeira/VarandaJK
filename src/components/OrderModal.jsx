
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx';
import { useCart } from '@/hooks/useCart.jsx';
import { useToast } from '@/components/ui/use-toast.js';

const paymentOptions = [
  { value: "Dinheiro", label: "Dinheiro" },
  { value: "Cartão", label: "Cartão (Crédito/Débito)" },
  { value: "Pix", label: "Pix" },
];

const OrderModal = ({ isOpen, onClose }) => {
  const { getWhatsAppLink, clearCart, total } = useCart();
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0].value);

  const handleSendOrder = () => {
    if (!customerName.trim() || !customerAddress.trim()) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, preencha seu nome e endereço.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
     if (!paymentMethod) {
      toast({
        title: "Forma de Pagamento",
        description: "Por favor, selecione uma forma de pagamento.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const whatsappUrl = getWhatsAppLink(customerName, customerAddress, paymentMethod);
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Pedido Enviado!",
      description: "Seu pedido foi enviado por WhatsApp. Limpando carrinho...",
      duration: 5000,
    });
    clearCart();
    onClose();
    setCustomerName('');
    setCustomerAddress('');
    setPaymentMethod(paymentOptions[0].value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
            onClose();
        }
    }}>
      <DialogContent className="sm:max-w-md bg-varanda-brown-light border-varanda-beige-dark text-varanda-beige">
        <DialogHeader>
          <DialogTitle className="text-primary rustic-title">Finalizar Pedido</DialogTitle>
          <DialogDescription className="text-varanda-beige-dark">
            Preencha seus dados para enviar o pedido via WhatsApp.
            O valor total do seu pedido é R$ {total.toFixed(2)} (incluindo R$ 5,00 de taxa de entrega).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-varanda-beige">
              Nome
            </Label>
            <Input
              id="name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="col-span-3 bg-varanda-brown border-varanda-beige-dark text-varanda-beige placeholder:text-varanda-beige-dark focus:ring-varanda-gold"
              placeholder="Seu nome completo"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right text-varanda-beige">
              Endereço
            </Label>
            <Input
              id="address"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="col-span-3 bg-varanda-brown border-varanda-beige-dark text-varanda-beige placeholder:text-varanda-beige-dark focus:ring-varanda-gold"
              placeholder="Rua, Número, Bairro, Referência"
            />
          </div>
           <div className="grid grid-cols-4 items-start gap-4 pt-2">
            <Label className="text-right text-varanda-beige pt-1">
              Pagamento
            </Label>
            <RadioGroup 
                value={paymentMethod} 
                onValueChange={setPaymentMethod} 
                className="col-span-3 space-y-2"
            >
                {paymentOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`payment-${option.value}`} className="border-primary text-primary focus:ring-varanda-gold data-[state=checked]:bg-primary"/>
                    <Label htmlFor={`payment-${option.value}`} className="text-sm text-varanda-beige font-normal">{option.label}</Label>
                  </div>
                ))}
            </RadioGroup>
          </div>
        </div>
        <DialogFooter className="sm:justify-between mt-2">
          <DialogClose asChild>
             <Button type="button" variant="secondary" className="bg-varanda-beige-light text-varanda-brown hover:bg-varanda-beige-light/80">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSendOrder} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Enviar Pedido por WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
