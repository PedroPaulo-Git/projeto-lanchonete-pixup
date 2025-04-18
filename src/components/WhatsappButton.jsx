import React from 'react'
import { IoLogoWhatsapp } from "react-icons/io5";
const WhatsappButton = () => {
  return (
    
    <div className="group relative">
          <a
            className="hover:w-14 hover:h-14 hover:bg-green-400 transition-all flex justify-center text-lg
                mb-18 mr-4 rounded-full items-center w-8 h-8 shadow-black shadow-lg bg-green-400
               fixed bottom-0 z-10 right-0"
               href="http://wa.me/5543991543136?text=Gostaria%20de%20entrar%20em%20contato%20!" >
            <IoLogoWhatsapp />
          </a>
          <a
            className="block sm:hidden group-hover:block
             text-xs fixed bottom-[75px] px-2 py-1 z-0 right-10
               bg-green-400"
               href="http://wa.me/5543991543136?text=Gostaria%20de%20entrar%20em%20contato%20!">
            <span className="pr-2">TIRAR DÚVIDAS</span>
          </a>
        </div>
  )
}

export default WhatsappButton