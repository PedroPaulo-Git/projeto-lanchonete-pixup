"use client";
import { useEffect, useState } from "react";
// import { FaUser } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdLocalPhone } from "react-icons/md";
import UserInfoModal from "./modals/modalUser"; // Importa o modal

const Sidebar = ({ onClose }) => {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para exibir o modal

  // Função para buscar os dados do localStorage
  const fetchUserData = () => {
    const data = JSON.parse(localStorage.getItem("userData"));
    if (data?.name) {
      setUserData(data);
    }
  };

  useEffect(() => {
    fetchUserData(); // Busca os dados ao montar o componente
  }, []);

//   const handleLogout = () => {
//     if (userData?.address) {
//       localStorage.setItem(
//         "userData",
//         JSON.stringify({ address: userData.address })
//       );
//     } else {
//       localStorage.removeItem("userData");
//     }
//     setUserData(null); // Atualiza o estado para refletir o logout
//   };

  return (
    <>
      <div className="fixed  inset-0 flex z-50">
        {/* Sidebar */}
        <div className="w-1/2 h-screen bg-black opacity-50" onClick={onClose}></div>
        <div className="w-1/2 flex flex-col justify-between h-screen bg-white p-6 shadow-lg z-50">
          {userData ? (
            <div className="mt-4 items-center flex flex-col ">
              <span className="text-sm font-semibold flex gap-2 items-center">
                {/* <FaUser className="text-xl" /> */}
                Olá,{userData.name}
              </span>
              <span className="flex text-sm gap-1 items-center">
                <MdLocalPhone className="text-sm text-black" />
                {userData.phone}
              </span>
              {/* <button
                onClick={handleLogout}
                className="bg-red-600 mb-4 text-white py-1 px-4 rounded-xs w-full"
              >
                Logout
              </button> */}
              <IoClose onClick={onClose} className="rounded-full bg-gray-200 p-1  absolute top-0 right-0 m-2 text-2xl"/>
            </div>
          ) : (
            <div className="mb-6 text-center flex justify-center">
              <button
                onClick={() => setIsModalOpen(true)} // Abre o modal ao clicar
                className="text-xs font-semibold flex gap-2 items-center underline"
              >
                Fazer Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Exibe o modal e atualiza os dados ao fechar */}
      {isModalOpen && (
        <UserInfoModal
          onSubmit={() => {
            fetchUserData(); // Atualiza os dados
            setIsModalOpen(false); // Fecha o modal
          }}
        />
      )}
    </>
  );
};

export default Sidebar;
