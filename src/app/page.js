"use client";
import { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import Menu from "../components/menu";
import ModalAddress from "../components/modals/modalAddress";
import WhatsappButton from "../components/WhatsappButton";
import { useCart } from "./context/contextComponent";
export default function Home() {
  const { modalAddressOpen, setmodalAddressOpen } = useCart();
  const [showWhatsapp, setShowWhatsapp] = useState(false);

  // useEffect(() => {
  //   // Espera 10 segundos para exibir o botão
  //   const showTimer = setTimeout(() => {
  //     setShowWhatsapp(true);

  //     // Esconde o botão após 5 segundos
  //     const hideTimer = setTimeout(() => {
  //       //setShowWhatsapp(false);
  //     }, 5000);

  //     return () => clearTimeout(hideTimer);
  //   }, 100);

  //   return () => clearTimeout(showTimer);
  // }, []);
  return (
    <div className="sm:max-w-2xl sm:mx-auto">
      {modalAddressOpen && (
        <ModalAddress
          setmodalAddressOpen={setmodalAddressOpen}
          // modalAddressOpen={modalAddressOpen}
        />
      )}
      {!modalAddressOpen && (
        <div className="">
          <Header setmodalAddressOpen={setmodalAddressOpen} />
          <Menu setmodalAddressOpen={setmodalAddressOpen} />
          <Footer />
          {/* <WhatsappButton /> */}
        </div>
      )}
    </div>
  );
}
