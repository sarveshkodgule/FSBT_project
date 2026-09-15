// Experiment 8: Context API in React.js
// Experiment 7: React State Management - Cart with useReducer
import { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

// Cart reducer - Experiment 7
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.payload.items, total: action.payload.totalPrice, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'CLEAR_CART':
      return { ...state, items: [], total: 0 };
    default:
      return state;
  }
};

const initialState = { items: [], total: 0, loading: false };

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const data = await cartAPI.getCart();
      dispatch({ type: 'SET_CART', payload: data });
    } catch {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (gameId, quantity = 1) => {
    const data = await cartAPI.addToCart({ gameId, quantity });
    dispatch({ type: 'SET_CART', payload: data });
  };

  const updateItem = async (gameId, quantity) => {
    const data = await cartAPI.updateCartItem(gameId, { quantity });
    dispatch({ type: 'SET_CART', payload: data });
  };

  const removeItem = async (gameId) => {
    const data = await cartAPI.removeFromCart(gameId);
    dispatch({ type: 'SET_CART', payload: data });
  };

  const clearCart = async () => {
    await cartAPI.clearCart();
    dispatch({ type: 'CLEAR_CART' });
  };

  const cartCount = state.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart: state,
      cartCount,
      fetchCart,
      addToCart,
      updateItem,
      removeItem,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
