import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoIosRefresh } from "react-icons/io";

import { IoIosSearch } from "react-icons/io";
import { FiMapPin } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import BlinkGif from "../assets/BlinkGif.gif";

const header = ({ setmodalAddressOpen }) => {
  //const [localizacao, setLocalizacao] = useState("");
  // useEffect(() => {
  //   const fetchLocation = async () => {
  //     try {
  //       const response = await fetch("https://ipapi.co/json/");
  //       const data = await response.json();
  //       setLocalizacao(`${data.city}`);
  //     } catch (error) {
  //       setLocalizacao("Localização não disponível");
  //     }
  //   };

  //   fetchLocation();
  // }, []);
  // const [localizacao, setLocalizacao] = useState("Carregando localização...");

  useEffect(() => {
    const fetchLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              //setLocalizacao(`${data.address.city || data.address.town}`);
            } catch (error) {}
          },
          async () => {
            // Se o usuário negar permissão, usa a API de IP como fallback
            try {
              const response = await fetch("https://ipapi.co/json/");
              const data = await response.json();
              //setLocalizacao(`${data.city}`);
            } catch (error) {}
          }
        );
      } else {
      }
    };

    fetchLocation();
  }, []);
  return (
    <div className="">
      <div className="w-full flex items-center px-6 gap-4 sm:max-w-2xl sm:mx-auto">
        <IoIosSearch />
        <input
          className="w-full h-14 focus:outline-none focus:ring-0"
          placeholder="Buscar no cardápio"
          type="text"
        />
      </div>
      <div
        className="bg-amber-600 h-40 relative"
        style={{
          backgroundImage: "url('./banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
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
          {/* {localizacao ? (
            <>
              <p className="text-gray-700">
                Entregamos em toda cidade de {localizacao} em até 35 minutos!
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-700">
                Entregamos em toda região em até 35 minutos!
              </p>
            </>
          )} */}
          {/* {localizacao && (<>{localizacao}</>)} */}
          <p className="text-gray-700">
            <span className="font-bold text-green-700 flex items-center gap-1">
              {" "}
              <span className=" w-4 h-4 flex rounded-full">
                <span>
                  <Image src={BlinkGif} alt="blink" className="" />
                </span>
              </span>
              Aberto
            </span>{" "}
        
            Entregamos para toda a cidade de Curitiba{" "}
            {/* <span className="font-bold">• 1,6km </span>de você */}
            {/* <br />
  Rua XV de Novembro (Rua das Flores) */}
          </p>

          {/* <li className="text-sm">Mais informações</li> */}
          <span className="flex justify-between ">
            <p className="text-red-500 max-w-[60%] text-sm">
              {/* Loja fechada no momento, abre hoje ás 00:00 */}
            </p>
            {/* <p className="bg-gray-200 text-gray-400 text-xs p-1 text-center w-24 ">Entrega e Retirada</p> */}
          </span>
          <div
            onClick={() => setmodalAddressOpen(true)}
            className="cursor-pointer border-[1px] rounded-lg py-3 px-3 mt-4 justify-between flex items-center w-full border-gray-300 "
          >
            <span className="flex items-center text-lg gap-2">
              <FiMapPin />
              <p>Calcular taxa de entrega</p>
            </span>
            <IoIosArrowForward />
          </div>
        </span>
      </div>
    </div>
  );
};

export default header;
