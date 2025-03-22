// contexts/CartContext.js
"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [modalAddressOpen, setmodalAddressOpen] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);

  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Atualizar localStorage sempre que cartItems mudar
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    const total = cartItems.reduce((acc, item) => acc + item.totalItemPrice, 0);
    localStorage.setItem("cartTotal", Math.max(total, 0)); // Evita valores negativos
  }, [cartItems]);

  const parsePrice = (price) => {
    if (typeof price === "string") {
      return parseFloat(price.replace(/[^\d,]/g, "").replace(",", "."));
    }
    return price || 0;
  };

  const addToCart = useCallback((item, quantity, complements) => {
    const itemPrice = parsePrice(item.price);

    const complementsPrice = Object.values(complements || {}).reduce(
      (acc, complement) =>
        acc + parsePrice(complement.price) * complement.quantity,
      0
    );

    const totalItemPrice = itemPrice * quantity + complementsPrice;

    setCartItems((prev) => [
      ...prev,
      {
        ...item,
        id: `${item.id}-${Date.now()}`, // Garante um ID único para cada novo item
        quantity,
        complements,
        totalItemPrice,
      },
    ]);
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCartItems((prev) => {
      const updatedCart = prev.filter((item) => item.id !== itemId);
  
      // Obtém o cupom aplicado do localStorage
      const coupon = JSON.parse(localStorage.getItem("couponApplied")) || null;
      const discount = coupon ? coupon.discount : 0;
  
      // Recalcula o total do carrinho após a remoção
      let total = updatedCart.reduce((acc, item) => acc + item.totalItemPrice, 0);
  
      // Aplica o desconto se houver um cupom
      total = Math.max(total - discount, 0);
  
      localStorage.setItem("cartTotal", total);
  
      return updatedCart;
    });
  }, []);
  
  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem("cartTotal"); // Limpa o cartTotal do localStorage
    localStorage.removeItem("couponApplied"); // Remove o cupom do localStorage
  }, []);
  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        clearCart,
        removeFromCart,
        modalAddressOpen,
        setmodalAddressOpen,
        savedAddress,
        setSavedAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
