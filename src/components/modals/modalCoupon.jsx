import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import ModalCouponSuccess from "./modalCouponSuccess";
import ModalCouponFail from "./modalCouponFail";

const coupons = {
  DESCONTO10: 10.0,
  DESCONTO20: 20.0,
  // FRETEGRATIS: 15.0,
};

const ModalCoupon = ({ handleCoupon }) => {
  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState("");
  const [cartTotal, setCartTotal] = useState(0);
  const [showCouponSuccess,setShowCouponSuccess] = useState(false)
  const [showCouponFail,setShowCouponFail] = useState(false)
  
  useEffect(() => {
    const storedTotal = parseFloat(localStorage.getItem("cartTotal")) || 0;
    setCartTotal(storedTotal);
  }, []);
  
  const applyCoupon = () => {
    const discount = coupons[couponCode.toUpperCase()];
    if (discount) {
      const newTotal = Math.max(cartTotal - discount, 0);
      //localStorage.setItem("cartTotal", newTotal);
      localStorage.setItem("couponApplied", JSON.stringify({ code: couponCode, discount }));
     // setCartTotal(newTotal);
      setMessage(`Cupom aplicado! Novo total: R$ ${newTotal.toFixed(2)}`);
      setShowCouponSuccess(true)
      setTimeout(() => {
        setShowCouponSuccess(false)
      }, 1000);
      setTimeout(() => {
        handleCoupon()
      }, 1500);
    
    } else {
      setShowCouponFail(true)
      setTimeout(() => {
        setShowCouponFail(false)
      }, 2000);
      setMessage("Cupom inválido!");
    }
  };

  return (
    <div className="z-50 px-4 h-screen w-screen bg-white absolute top-0">
      <header>
        <div className="py-4 items-center flex justify-between border-b-[1px] border-gray-200">
          <p>Cupons</p>
          <IoClose className="text-lg" onClick={handleCoupon} />
        </div>
      </header>
      <div className="mt-4 space-y-2">
        <p className="font-semibold text-lg">Tem um cupom?</p>
        <span className="flex justify-between items-center text-center">
          <input
            className="border-[1px] border-gray-300 px-2 w-[70%]"
            placeholder="CÓDIGO DO CUPOM"
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button
            className="px-2 p-1 text-sm bg-black rounded-sm text-white"
            onClick={applyCoupon}
          >
            APLICAR
          </button>
        </span>
        {showCouponSuccess && <ModalCouponSuccess/>}
        {showCouponFail && <ModalCouponFail/>}
      </div>
    </div>
  );
};

export default ModalCoupon;
