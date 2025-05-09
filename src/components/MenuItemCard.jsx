
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import { Label } from '@/components/ui/label.jsx';
import { useCart } from '@/hooks/useCart.jsx';
import { useToast } from '@/components/ui/use-toast.js';
import { PlusCircle, ImageOff } from 'lucide-react';
import { motion } from 'framer-motion';

const MenuItemCard = ({ item }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const parsedOptions = Array.isArray(item.options) ? item.options : [];

  const [selectedOption, setSelectedOption] = useState(parsedOptions.length > 0 ? parsedOptions[0].value : null);
  const [checkboxOptionSelected, setCheckboxOptionSelected] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    const itemToAdd = {
      ...item,
      price: parseFloat(item.price),
      imageUrl: item.url_imagem, 
    };
    
    let finalPrice = itemToAdd.price;
    let optionDescription = selectedOption ? parsedOptions.find(opt => opt.value === selectedOption)?.label : null;

    if (item.has_checkbox_option && checkboxOptionSelected) {
      if (item.nome === 'Anéis de Cebola JK') { 
        finalPrice += 3.00; 
      }
      const checkboxDesc = item.checkbox_label ? item.checkbox_label.split('(')[0].trim() : 'Opção selecionada';
      optionDescription = optionDescription ? `${optionDescription}, ${checkboxDesc}` : checkboxDesc;
    }
    
    const itemWithFinalPrice = {
      ...itemToAdd,
      price: finalPrice,
      selectedOption: optionDescription, 
    };

    addToCart(itemWithFinalPrice, 1, selectedOption, item.has_checkbox_option ? checkboxOptionSelected : null);
    
    toast({
      title: "Adicionado ao Carrinho!",
      description: `${item.nome}${optionDescription ? ` (${optionDescription})` : ''} foi adicionado.`,
      duration: 3000,
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden h-full flex flex-col bg-varanda-brown-light border-varanda-beige-dark hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="p-0 relative">
          {imageError || !item.url_imagem ? (
            <div className="w-full h-48 bg-varanda-brown flex items-center justify-center">
              <ImageOff className="h-16 w-16 text-varanda-beige-dark" />
            </div>
          ) : (
            <img 
              src={item.url_imagem} 
              alt={item.nome} 
              className="w-full h-48 object-cover" 
              onError={handleImageError}
            />
          )}
          <div className="p-4">
            <CardTitle className="text-xl rustic-title text-primary">{item.nome}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4 pt-0">
          {item.descricao && <CardDescription className="text-sm text-varanda-beige mb-2">{item.descricao}</CardDescription>}
          <p className="text-lg font-semibold text-varanda-gold">R$ {parseFloat(item.price).toFixed(2)}</p>
          
          {item.options_title && parsedOptions.length > 0 && (
            <div className="mt-3">
              <Label className="text-sm font-medium text-varanda-beige">{item.options_title}</Label>
              <RadioGroup defaultValue={selectedOption} onValueChange={setSelectedOption} className="mt-1 space-y-1">
                {parsedOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${item.id}-${option.value}`} />
                    <Label htmlFor={`${item.id}-${option.value}`} className="text-sm text-varanda-beige font-normal">{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {item.has_checkbox_option && item.checkbox_label && (
            <div className="mt-3 flex items-center space-x-2">
              <Checkbox 
                id={`${item.id}-checkbox`} 
                checked={checkboxOptionSelected}
                onCheckedChange={setCheckboxOptionSelected}
              />
              <Label htmlFor={`${item.id}-checkbox`} className="text-sm text-varanda-beige font-normal">{item.checkbox_label}</Label>
            </div>
          )}

        </CardContent>
        <CardFooter className="p-4">
          <Button onClick={handleAddToCart} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MenuItemCard;
