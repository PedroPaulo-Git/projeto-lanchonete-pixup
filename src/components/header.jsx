import React from "react";
import Image from "next/image";
import { IoIosSearch } from "react-icons/io";
import { FiMapPin } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";

const header = ({setmodalAddressOpen}) => {
  return (
    <div>
      <div className="w-full flex items-center px-6 gap-4 ">
        <IoIosSearch />
        <input
          className="w-full h-14 focus:outline-none focus:ring-0"
          placeholder="Buscar no cardápio"
          type="text"
        />
      </div>
      <div className="bg-amber-600 h-40 relative"style={{ backgroundImage: "url('./banner.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* <Image
            src="https://dummyimage.com/200x200/000/fff"
            width={200}
            height={200}
            className="p-1 rounded-full"
            alt="Imagem placeholder"
          /> */}
        <div className="bg-white flex border-4 border-white overflow-hidden rounded-full h-24 w-24 absolute -bottom-8 left-4 items-center justify-center text-center">
        <Image
  src="/Logo.jpg"
  width={100} // Defina um valor base
  height={100}
  className="p-1 rounded-full w-24 h-24 object-cover scale-125 border-2 border-white" // A classe ainda pode alterar o tamanho
  alt="Imagem placeholder"
/>
        </div>
      </div>

      <div className="mt-8 px-4">
        <h1 className="font-bold text-3xl">Grill Burgueria</h1>
        <span>
          <p className="text-gray-700">Rua Quatro, 86</p>
          {/* <li className="text-sm">Mais informações</li> */}
          <span className="flex justify-between ">
            <p className="text-red-500 max-w-[60%] text-sm">
              {/* Loja fechada no momento, abre hoje ás 00:00 */}
            </p>
              {/* <p className="bg-gray-200 text-gray-400 text-xs p-1 text-center w-24 ">Entrega e Retirada</p> */}

          </span>
          <div className="border-[1px] rounded-lg py-3 px-3 mt-4 justify-between flex items-center w-full border-gray-300 ">
            <span className="flex items-center text-lg gap-2">
              <FiMapPin />
              <p onClick={()=>setmodalAddressOpen(true)}>Calcular taxa de entrega</p> 
            </span>
              <IoIosArrowForward />
           
          </div>
        </span>
      </div>
    </div>
  );
};

export default header;
