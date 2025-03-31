import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoIosRefresh } from "react-icons/io";
import { IoIosSearch } from "react-icons/io";
import { FiMapPin } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import SuccessGIF from "../assets/successGIF.gif";
import SuccessStatic from "../assets/StaticSuccess.png"; // A imagem estática (primeira frame do GIF)

import BlinkGif from "../assets/BlinkGif.gif";
import Select from "react-select";
import axios from "axios";
const header = ({ setmodalAddressOpen }) => {
  const [isGifFinished, setIsGifFinished] = useState(false);

  // useEffect(() => {

  // }, []);

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
  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [localizacao, setLocalizacao] = useState({
    estado: null,
    cidade: null,
  });
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [localizacaoSelecionada, setLocalizacaoSelecionada] = useState(""); // Novo estado para armazenar a localização confirmada

  const handlecloseconfirm = () =>{
    setLoading2(false)
  }
  const handleConfirmar = () => {
    if (localizacao.estado && localizacao.cidade) {
      setLoading(true);
      localStorage.setItem("estado", JSON.stringify(localizacao.estado.value));
      localStorage.setItem("cidade", JSON.stringify(localizacao.cidade.value));

      setTimeout(() => {
        // setLoading(false);
        setLoading2(true)
        const timer = setTimeout(() => {
          setIsGifFinished(true); // Define como verdadeiro após o tempo que o GIF demora para rodar
        }, 150); // Ajuste o tempo conforme a duração do seu GIF
        return () => clearTimeout(timer);
      }, 3500); // Atraso de 1 segundo antes de exibir a localização
      setTimeout(() => {
        setLocalizacaoSelecionada(
          `${localizacao.cidade.label} - ${localizacao.estado.label}`
        );
      }, 8000);
    }
  };
  const loadLocationFromLocalStorage = () => {
    const savedState = JSON.parse(localStorage.getItem("estado"));
    const savedCity = JSON.parse(localStorage.getItem("cidade"));
    if (savedState && savedCity) {
      setLocalizacao({
        estado: { value: savedState, label: savedState },
        cidade: { value: savedCity, label: savedCity },
      });
      setTimeout(() => {
        //setLoading2(false)
        setLoading(false);
      }, 1000);

      setTimeout(() => {
        setLocalizacaoSelecionada(`${savedCity} - ${savedState}`);
      }, 1000);
    }
  };

  useEffect(() => {
    loadLocationFromLocalStorage();
    axios
      .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((res) => {
        const estadosFormatados = res.data.map((estado) => ({
          value: estado.sigla,
          label: estado.nome,
        }));
        setEstados(estadosFormatados);
      });
    if (localizacaoSelecionada === "") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // Resetando o overflow quando o componente desmontar
    };
  }, [localizacaoSelecionada]);

  useEffect(() => {
    if (localizacao.estado) {
      axios
        .get(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${localizacao.estado.value}/municipios`
        )
        .then((res) => {
          const cidadesFormatadas = res.data.map((cidade) => ({
            value: cidade.nome,
            label: cidade.nome,
          }));
          setCidades(cidadesFormatadas);
        });
    } else {
      setCidades([]);
    }
  }, [localizacao.estado]);

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
          <div>
            {/* Modal Overlay */}
            {!localizacaoSelecionada && (
              <div className="fixed inset-0 bg-black/60  flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative z-10">
                  {/* <h2 className="text-lg font-bold mb-4">Selecione seu Estado e Cidade</h2> */}
                  <h2 className="text-lg text-center font-bold mb-4">
                    Selecione seu Estado e Cidade
                  </h2>
                  <div className="flex gap-2 mt-2">
                    <Select
                      options={estados}
                      value={localizacao.estado}
                      onChange={(estado) =>
                        setLocalizacao({ estado, cidade: null })
                      }
                      className="w-1/2"
                    />
                    <Select
                      options={cidades}
                      value={localizacao.cidade}
                      onChange={(cidade) =>
                        setLocalizacao({ ...localizacao, cidade })
                      }
                      className="w-1/2"
                      isDisabled={!localizacao.estado}
                    />
                  </div>
                  <button
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
                    disabled={!localizacao.estado || !localizacao.cidade}
                    onClick={handleConfirmar}
                  >
                    Confirmar
                  </button>
                </div>
                {loading ? (
                  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative z-10">
                      <h2 className="text-lg text-center font-bold mb-4">
                        Estamos buscando a franquia mais próxima de você...
                      </h2>
                      <div className="flex justify-center">
                        <IoIosRefresh className="animate-spin text-4xl" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            )}
            {loading2 && (
              <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative z-10 ">
                  {!isGifFinished ? (
                    <Image
                      src={SuccessGIF}
                      alt="Pagamento Aprovado"
                      className="success-gif -mt-14"
                    />
                  ) : (
                    <Image
                      src={SuccessStatic}
                      alt="Pagamento Aprovado"
                      className="success-gif"
                    />
                  )}
                  <h2 className="text-lg text-center font-semibold mb-4 -mt-14">
                    Achamos uma franquia a <strong>1.6km de você</strong>,  seu pedido chegará de
                    30 a 60 minutos
                  </h2>

                  <div
                  onClick={handlecloseconfirm}
                    className={`flex w-[75%] justify-center mt-10 mx-auto rounded-lg py-3 bg-black text-white font-medium`}
                  >
                    <div className="text-center items-center">
                      Continuar comprando
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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
            <span>
              {localizacaoSelecionada && (
                <>
                  {`${localizacao.cidade.label} - ${localizacao.estado.value}  `}
                  <strong>• 1,6km de você</strong>
                </>
              )}
            </span>
            {/* Entregamos para toda a cidade de Curitiba{" "} */}
            {/* <h1 className="text-xl font-bold mt-8">
              {localizacaoSelecionada
                ? `Localização Selecionada: ${localizacaoSelecionada}`
                : "Selecione seu Estado e Cidade"}
            </h1> */}
            {/* {/* <br />
  Rua XV de Novembro (Rua das Flores) */}
          </p>

          {/* <li className="text-sm">Mais informações</li> */}
          <span className="flex justify-between ">
            <p className="text-red-500 max-w-[60%] text-sm">
              {/* Loja fechada no momento, abre hoje ás 00:00 */}
            </p>
            {/* <p className="bg-gray-200 text-gray-400 text-xs p-1 text-center w-24 ">Entrega e Retirada</p> */}
          </span>
          {/* <div
            onClick={() => setmodalAddressOpen(true)}
            className="cursor-pointer border-[1px] rounded-lg py-3 px-3 mt-4 justify-between flex items-center w-full border-gray-300 "
          >
            <span className="flex items-center text-lg gap-2">
              <FiMapPin />
              <p>Calcular taxa de entrega</p>
            </span>
            <IoIosArrowForward />
          </div> */}
        </span>
      </div>
    </div>
  );
};

export default header;
