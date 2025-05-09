
import React from 'react';
import MenuItemCard from '@/components/MenuItemCard';
import { motion } from 'framer-motion';

const CategorySection = ({ category }) => {
  return (
    <motion.section 
      className="mb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6 rustic-title text-center text-primary">{category.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {category.items.map(item => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </motion.section>
  );
};

export default CategorySection;
