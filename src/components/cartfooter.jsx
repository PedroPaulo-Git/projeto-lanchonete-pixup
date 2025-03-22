"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Correto para Next.js 13+
import { IoClose } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { BiSolidCoupon } from "react-icons/bi";
import { useCart } from "@/app/context/contextComponent";

import UserInfoModal from "./modals/modalUser";
import ModalCoupon from "./modals/modalCoupon";

export default function CartFooter({ setmodalAddressOpen }) {
  const { cartItems, clearCart, removeFromCart } = useCart();
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  // const [showPaymentStatus, setShowPaymentStatus] = useState(false);
  //const [paymentId, setPaymentId] = useState(null);
  //const [status, setStatus] = useState('');
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [userData, setUserData] = useState(false);

  // Função para converter preço em número
  const parsePrice = (price) => {
    if (typeof price === "string") {
      // Remover "R$" e substituir vírgula por ponto
      return parseFloat(price.replace(/[^\d,]/g, "").replace(",", "."));
    }
    if (typeof price === "number") {
      return price;
    }
    console.log(price);
    console.warn(`Preço inválido: ${price}`);
    return 0;
  };

  // Cálculo do subtotal (item principal + complementos)
  // const subtotal = cartItems.reduce((acc, item) => {
  //   // Preço do item principal
  //   const itemPrice = parsePrice(item.price);

  //   // Preço dos complementos
  //   const complementsPrice = Object.values(item.complements || {}).reduce(
  //     (acc, complement) => {
  //       const complementPrice = parsePrice(complement.price);
  //       return acc + complementPrice * complement.quantity;
  //     },
  //     0
  //   );

  //   // Preço total do item (item principal + complementos)
  //   const totalItemPrice = itemPrice * item.quantity + complementsPrice;

  //   return acc + totalItemPrice;
  // }, 0);
  const deliveryFee = 3; // Taxa de entrega

  //const total = subtotal + deliveryFee;
  // const discount = total * 0.7;
const [subtotal, setSubtotal] = useState(0);
const [total, setTotal] = useState(0);
const [cartTotal, setCartTotal] = useState(0)
  // useEffect(() => {
  //   // Recalcula o total sempre que cartItems mudar
  //   const newSubtotal = cartItems.reduce((acc, item) => {
  //     const itemPrice = parsePrice(item.price);
  //     const complementsPrice = Object.values(item.complements || {}).reduce(
  //       (acc, complement) => {
  //         return acc + parsePrice(complement.price) * complement.quantity;
  //       },
  //       0
  //     );

  //     return acc + (itemPrice * item.quantity + complementsPrice);
  //   }, 0);

  //   const newTotal = newSubtotal + 3; // Adiciona taxa de entrega
  //   setCartTotal(newTotal);
  // }, [cartItems]);
  const [discount,setDiscount] = useState()
  useEffect(() => {
    // Recalcula o subtotal sempre que cartItems mudar
    const newSubtotal = cartItems.reduce((acc, item) => {
      const itemPrice = parsePrice(item.price);
      const complementsPrice = Object.values(item.complements || {}).reduce(
        (acc, complement) => acc + parsePrice(complement.price) * complement.quantity,
        0
      );
  
      return acc + (itemPrice * item.quantity + complementsPrice);
    }, 0);
    const savedCouponLocalStorage = JSON.parse(localStorage.getItem("couponApplied")) || { discount: 0 };
    const savedCoupon = savedCouponLocalStorage.discount || 0
    
  
    
    // console.log("DESCONTO ",discount)
    // console.log("DESCONTO ",savedCoupon)
    setSubtotal(newSubtotal);

    if(savedCoupon){
      const newTotal = newSubtotal + deliveryFee - discount;
      localStorage.setItem("cartTotal", newTotal.toFixed(2));
      setCartTotal(newTotal);
      // console.log(newTotal)
      //setDiscount(savedCoupon);
      // console.log("DESCONTO 1 ",savedCoupon)
      // console.log("DESCONTO 2 ",discount)
    }
    else{
      const newTotal = newSubtotal + deliveryFee;
      localStorage.setItem("cartTotal", newTotal.toFixed(2));
      setCartTotal(newTotal);
    }
    
  }, [cartItems,subtotal]);
  
  useEffect(() => {
    // Verifica mudanças no cartTotal armazenado
    const checkCartTotal = () => {
      const storedTotal = parseFloat(localStorage.getItem("cartTotal")) || 0;
     
      setTotal(storedTotal);
    }; 
    const checkDiscount = () => {

      const savedCouponLocalStorage = JSON.parse(localStorage.getItem("couponApplied")) || {} ;
      const savedCoupon = savedCouponLocalStorage.discount || 0
      //const newTotal = subtotal + deliveryFee - discount;
      
      //setCartTotal(newTotal);
      setDiscount(savedCoupon);
      // console.log(savedCouponLocalStorage)
      // console.log("DESCONTO 1 -------------",savedCoupon)
      // console.log("DESCONTO 2 -----------",discount)
      if(discount){
        const newTotal = subtotal + deliveryFee - discount ;
        localStorage.setItem("cartTotal", newTotal.toFixed(2));
      }
      else{
        // const newTotal = subtotal + deliveryFee;
        // localStorage.setItem("cartTotal", newTotal.toFixed(2));
        // setCartTotal(newTotal);
      }
    };
  
    checkCartTotal();
    checkDiscount() // Verifica na montagem
  
    const interval = setInterval(() => {
      checkCartTotal(); // Verifica a cada segundo
      checkDiscount()
    }, 1000);
  
    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, [discount,subtotal]);
  
  // console.log("discount : 30% ", discount);












  useEffect(() => {
    // Verifica se o usuário já forneceu os dados
    const userData = localStorage.getItem("userData");
    console.log(userData)

    if (!userData) {
      setShowUserInfoModal(true); // Se não tiver dados, exibe o modal
    }
  }, []);

  const handleCoupon = () => {
    

      setShowCouponModal(!showCouponModal);
      setIsCartOpen(!isCartOpen);
      console.log(showCouponModal)
  }
  const handleContinue = () => {
    // if (!localStorage.getItem("userData")) {
    //   setShowUserInfoModal(true);
    //   return;
    // }
    const userData = localStorage.getItem("userData");
    console.log(userData)
    if (!userData) {
      setShowUserInfoModal(true); // Se não tiver dados, exibe o modal
    }

    // // Calculando o total corretamente, incluindo a taxa de entrega
    // const subtotal = cartItems.reduce((acc, item) => {
    //   const itemPrice = parseFloat(
    //     item.price.replace("R$", "").replace(",", ".")
    //   );
    //   if (isNaN(itemPrice)) {
    //     console.warn("Preço inválido:", item.price);
    //     return acc;
    //   }
    //   return acc + itemPrice * item.quantity;
    // }, 0);

    // // Garantir que o subtotal seja um número válido
    // if (isNaN(subtotal)) {
    //   console.error("Subtotal inválido:", subtotal);
    //   return;
    // }

    // // Adicionando a taxa de entrega
    // const total = subtotal + deliveryFee;

    // // Salvando no localStorage apenas se for um número válido
    // localStorage.setItem("cartTotal", total > 0 ? total.toFixed(2) : "0.00");

    router.push(`/checkout`);
    setIsCartOpen(!isCartOpen);
  };












  const handleToggleCart = () => {
    window.scrollTo(0, 0);
    setIsCartOpen(!isCartOpen);
    if (!isCartOpen) {
      setScrollPosition(window.scrollY);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      window.scrollTo(0, scrollPosition);
    }
  };

  
  const handleToggleAddress = () => {
    setIsCartOpen(!isCartOpen);
    setmodalAddressOpen(true);

    if (!isCartOpen) {
      setScrollPosition(window.scrollY);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      window.scrollTo(0, scrollPosition);
    }

    if (!setmodalAddressOpen) {
      document.body.style.overflow = "auto";
    }
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    console.log(`Item removido: ${itemId}`);
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      setIsCartOpen(false);
      document.body.style.overflow = "auto"; // Libera a rolagem
    }
  }, [cartItems.length]);

  const handleClearCart = () => {
    clearCart();
    localStorage.removeItem("couponApplied"); 
    setIsCartOpen(false);
    document.body.style.overflow = "auto";
    window.scrollTo(0, scrollPosition);
  };

  if (cartItems.length === 0) return null;

  return (
    <>
     {showCouponModal && (<>
      <ModalCoupon handleCoupon={handleCoupon}/>
      </>)}
         <div className="z-20 sm:max-w-2xl sm:left-1/2 sm:-translate-x-1/2 sm:mx-auto fixed bottom-16 left-0 w-full bg-[#181717] text-white p-4 flex justify-between items-center">
        <p className="text-sm font-semibold">{cartItems.length} item(s)</p>
        <button onClick={handleToggleCart} className="text-sm font-semibold">
          Ver sacola
        </button>
        <p className="text-sm font-semibold">R$ {total.toFixed(2)}</p>
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
          {/* {showPaymentStatus && <PaymentStatus paymentId={paymentId} />} */}
          <div className="bg-white w-full h-full overflow-y-auto">
            <div className="items-center justify-between text-center border-b-[1px] border-gray-200 p-3 py-4 flex">
              <h3 className="font-normal text-md text-[#212529] text-lg">
                Grill Burguer
              </h3>

              <button className="text-2xl" onClick={handleToggleCart}>
                <IoClose />
              </button>
              {/* <h3>Status do pagamento: {status}</h3> */}
            </div>
            <div className="border-b-[1px] py-4 px-3 justify-between flex items-center w-full border-gray-200">
              <span className="flex items-center text-lg gap-2">
                <FiMapPin />
                <p
                  onClick={handleToggleAddress}
                  className="font-semibold text-sm"
                >
                  Calcular taxa de entrega
                </p>
              </span>
              <IoIosArrowForward />
            </div>

            <div className="space-y-4 bg-gray-50 p-3 text-sm">
              <div className="flex justify-between items-center">
                <p className="font-semibold">Sua sacola</p>
                <p onClick={handleClearCart} className="text-xs">
                  LIMPAR
                </p>
              </div>
              {/* {console.log("CART ITEMS", cartItems)}
              {console.log("DISCOUNT", discount)} */}
              {cartItems.map((item, index) => {
                const itemPrice = parsePrice(item.price);
                const complementsPrice = Object.keys(
                  item.complements || {}
                ).reduce((acc, complementKey) => {
                  const complement = item.complements[complementKey];
                  const complementPrice = parsePrice(complement.price);
                  return acc + complementPrice * complement.quantity;
                }, 0);

                const totalItemPrice =
                  itemPrice * item.quantity + complementsPrice;

                return (
                  <div
                    key={index}
                    className={`bg-white min-h-[120px] items-center gap-4 border-b border-gray-200 p-3 cursor-pointer space-y-2 ${index === cartItems.length - 1 ? "mb-80" : ""}`}
                  >
                    <div className="flex justify-between text-[#212529] h-10 gap-5">
                      <h3 className="font-semibold text-md text-[#212529]">
                        {item.quantity}x {item.name}
                      </h3>
                      <p className="font-semibold mt-1 mr-1">
                        R${totalItemPrice.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex justify-between relative">
                      {item.complements &&
                        Object.keys(item.complements).length > 0 && (
                          <div>
                            {Object.keys(item.complements).map(
                              (complementKey, i) => {
                                const complement =
                                  item.complements[complementKey];
                                if (complement.quantity > 0) {
                                  // Só exibe complementos com quantidade maior que 0
                                  return (
                                    <div key={i} className="pb-2">
                                      <div className="flex justify-between">
                                        <div className="flex flex-col ">
                                          <span className="text-sm text-gray-500">
                                            {complement.quantity}x{" "}
                                            {complementKey}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                return null; // Não renderiza se a quantidade for 0
                              }
                            )}
                          </div>
                        )}

                      <img
                        src={item.image}
                        alt={item.name}
                        className=" absolute right-0 -top-2 w-16 h-14 rounded-lg object-cover ml-auto"
                      />
                    </div>
                    <span className="font-medium space-x-4 ">
                      <button className="text-red-800 mt-4">Editar</button>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-gray-500 mt-4"
                      >
                        Remover
                      </button>
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="bg-white fixed w-full bottom-0 p-3 border-t-[1px] border-gray-100 ">
              <div className="text-sm ">
                <div className="flex justify-between mb-1">
                  <p>Subtotal</p>
                  <p>R$ {subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between mb-1">
                  <p className="text-gray-500">Taxa de entrega</p>
                  <p className="text-gray-500">R$ {deliveryFee.toFixed(2)}</p>
                </div>
                {discount > 0 && (
                  <>
                  <div className="flex justify-between mb-1">
                  <p className="text-gray-500">Cupom aplicado</p>
                  <p className="text-gray-500">- R$ {discount.toFixed(2)}</p>
                </div>
                </>)}
                <div className="flex justify-between font-semibold">
                  <p>Total</p>
                  <p>R$ {total.toFixed(2)}</p>
                </div>
              </div>





              
              {showUserInfoModal && (
                <UserInfoModal onSubmit={() => setShowUserInfoModal(false)} />
              )}






              <div className="justify-between mt-1 flex flex-col">
           
                {!discount > 0 && (
                <div onClick={handleCoupon} className="flex items-center justify-between py-4 border-t-[1px] border-gray-200 gap-3  bg-white px-2 text-gray-700 mt-2">
                  <div className="flex items-center gap-3">
                  <BiSolidCoupon />
                  <span className="">
                    <p className="font-semibold text-xs">Tem um cupom?</p>
                    <p className=" text-xs">Clique e insira o código</p>
                  </span>
                    </div>
                  <IoIosArrowForward/>
                </div>
               )}
                  {discount > 0 && (
                <div onClick={handleCoupon} className="flex items-center justify-between py-4 border-t-[1px] border-gray-200 gap-3  bg-white px-2 text-gray-700 mt-2">
                  <div className="flex items-center gap-3">
                  <BiSolidCoupon />
                  <span className="">
                    <p className="font-semibold text-xs">Cupom aplicado !</p>
                  
                  </span>
                    </div>
                 
                </div>
               )}
               
                <button
                  className="bg-[#181717] text-white px-4 py-3 rounded-sm font-semibold text-sm"
                  onClick={handleContinue}
                  //  disabled={!isMounted}
                >
                  Continuar Pedido
                </button>
                <button
                  onClick={handleClearCart}
                  className="text-gray-600 pt-2 px-4 rounded-full text-sm"
                >
                  Limpar Carrinho
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

   
    </>
  );
}
