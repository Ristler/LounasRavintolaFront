import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    console.log("Cart items saved to local storage:", cartItems);
  }, [cartItems]);

  const addToCart = (food) => {
    // Debug logging
    console.log("Attempting to add food item:", food);
    console.log("Current cart items:", cartItems);
    
    // Ensure food has a valid ID
    if (!food._id) {
      console.error("Food item has no ID:", food);
      return;
    }
    
    setCartItems(prev => {
      // Log the comparison that's happening
      console.log(`Comparing new item ID: ${food._id} (${typeof food._id}) with existing cart items`);
      
      // Check if the item is already in cart
      // Use strict equality (===) instead of loose equality (==)
      const existingItemIndex = prev.findIndex(item => 
        String(item.id) === String(food._id)
      );
      
      console.log("Found at index:", existingItemIndex);
      
      if (existingItemIndex !== -1) {
        // Item exists, create a new array with updated quantity
        console.log("Updating quantity of existing item");
        const updatedCart = [...prev];
        
        // If quantity property doesn't exist, add it
        if (!updatedCart[existingItemIndex].quantity) {
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: 1
          };
        }
        
        // Increment quantity
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };
        
        return updatedCart;
      } else {
        // Item doesn't exist, add it with quantity 1
        console.log("Adding new item to cart");
        
        // Ensure we're creating a new item with a clean structure
        const newItem = {
          id: food._id,
          name: food.name,
          price: food.price,
          photo: food.photo || food.image || '',
          quantity: 1
        };
        
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (foodId) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.id === foodId);
      
      if (existingItemIndex !== -1 && prev[existingItemIndex].quantity > 1) {
        // If quantity > 1, decrease quantity
        const updatedCart = [...prev];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity - 1
        };
        return updatedCart;
      } else {
        // If quantity is 1 or undefined, remove item
        return prev.filter(item => item.id !== foodId);
      }
    });
  };
  
  // Function to completely remove an item regardless of quantity
  const removeItemCompletely = (foodId) => {
    setCartItems(prev => prev.filter(item => item.id !== foodId));
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemQuantity = item.quantity || 1;
      return total + (item.price * itemQuantity);
    }, 0);
  };
  
  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      removeItemCompletely,
      getCartTotal,
      getCartItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};