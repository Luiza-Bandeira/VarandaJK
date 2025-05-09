
import React, { useState, useEffect, useRef } from 'react';
import { CartProvider } from '@/hooks/useCart.jsx';
import Header from '@/components/Header.jsx';
import CategorySection from '@/components/CategorySection.jsx';
import Cart from '@/components/Cart.jsx';
import OrderModal from '@/components/OrderModal.jsx';
import { Toaster } from '@/components/ui/toaster.jsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs.jsx"
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { supabase } from '@/lib/supabaseClient.js';

const DynamicIcon = ({ name, ...props }) => {
  const IconComponent = LucideIcons[name];
  if (!IconComponent) {
    return <LucideIcons.UtensilsCrossed {...props} />;
  }
  return <IconComponent {...props} />;
};

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const mainContentRef = useRef(null);
  const [menuCategories, setMenuCategories] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categorias')
          .select('*')
          .order('ordem', { ascending: true });

        if (categoriesError) {
          console.error('Erro ao buscar categorias:', categoriesError);
          throw categoriesError;
        }

        const { data: productsData, error: productsError } = await supabase
          .from('produtos')
          .select('*')
          .eq('disponivel', true);

        if (productsError) {
          console.error('Erro ao buscar produtos:', productsError);
          throw productsError;
        }

        const itemsByCategoryId = productsData.reduce((acc, product) => {
          const categoryId = product.categoria_id;
          if (!acc[categoryId]) {
            acc[categoryId] = [];
          }
          
          const parsedProduct = {
            ...product,
            price: parseFloat(product.preco), 
            options: product.options, // Já deve ser JSONB do banco
            imageUrl: product.url_imagem // Usar url_imagem diretamente
          };
          acc[categoryId].push(parsedProduct);
          return acc;
        }, {});
        
        setMenuCategories(categoriesData || []);
        setMenuItems(itemsByCategoryId);

        if (categoriesData && categoriesData.length > 0) {
          setActiveTab(categoriesData[0].id_singular);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do cardápio:', error.message);
        // Poderia adicionar um estado de erro aqui para mostrar na UI
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const handleCheckout = () => {
    setIsCartOpen(false); 
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
  };
  
  useEffect(() => {
    if (isCartOpen || isOrderModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto'; 
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto'; 
    };
  }, [isCartOpen, isOrderModalOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-varanda-brown-dark">
        <LucideIcons.Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <CartProvider>
      <div className={`min-h-screen flex flex-col bg-background ${isCartOpen || isOrderModalOpen ? 'overflow-hidden fixed inset-0' : ''}`}>
        <Header onCartClick={handleCartClick}>
          {menuCategories.length > 0 && (
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList 
                className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 bg-varanda-brown-dark p-1 rounded-lg"
              >
              {menuCategories.map(category => (
                  <TabsTrigger 
                  key={category.id_singular} 
                  value={category.id_singular} 
                  className="rustic-title text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg text-varanda-beige hover:bg-varanda-gold-light/20 transition-all duration-200 ease-in-out flex items-center justify-center py-2.5"
                  >
                  <DynamicIcon name={category.icone_lucide || 'UtensilsCrossed'} className="mr-2 h-5 w-5" />
                  {category.nome}
                  </TabsTrigger>
              ))}
              </TabsList>
            </Tabs>
          )}
        </Header>
        
        <main ref={mainContentRef} className="flex-grow container mx-auto px-4 py-8" style={{ paddingTop: '1rem' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 pt-4" 
          >
            <LucideIcons.UtensilsCrossed className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold rustic-title text-primary">Nosso Cardápio</h1>
            <p className="text-lg text-varanda-beige mt-2">Delícias artesanais feitas com carinho!</p>
          </motion.div>
          
          {menuCategories.length > 0 && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {menuCategories.map(category => (
                <TabsContent key={category.id_singular} value={category.id_singular} className="focus-visible:ring-0 focus-visible:ring-offset-0">
                  <CategorySection 
                    category={{
                      id: category.id_singular,
                      name: category.nome,
                      items: menuItems[category.id] || []
                    }} 
                  />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </main>

        <footer className="bg-varanda-brown-dark text-center p-6 text-varanda-beige-dark mt-auto">
          <p>&copy; {new Date().getFullYear()} VARANDA JK. Todos os direitos reservados.</p>
          <p className="text-sm">Cardápio digital por Hostinger Horizons</p>
        </footer>
        
        <AnimatePresence>
          {isCartOpen && <Cart isOpen={isCartOpen} onClose={handleCloseCart} onCheckout={handleCheckout} />}
        </AnimatePresence>
        
        <OrderModal isOpen={isOrderModalOpen} onClose={handleCloseOrderModal} />
        <Toaster />
      </div>
    </CartProvider>
  );
}

export default App;
