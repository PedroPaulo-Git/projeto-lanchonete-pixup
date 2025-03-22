import React from "react";
import { useState } from "react";
import { GoHome } from "react-icons/go";
import Link from "next/link";
import { LuClipboardPenLine } from "react-icons/lu";
import { FaUser } from "react-icons/fa";
import Sidebar from "./sidebar";
const footer = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <div className="z-10 text-sm sm:max-w-2xl sm:left-1/2 sm:-translate-x-1/2 sm:mx-auto text-gray-500 bg-white flex w-screen justify-between px-6 fixed bottom-0 shadow-2xl border-t-[0.5px] border-gray-200 h-16 text-center items-center">
        <span className="text-center items-center justify-center flex flex-col">
          <GoHome className="text-xl mb-1" />
          Home
        </span>
        <Link
          href="/acompanhar-pedido"
          className="text-center items-center justify-center flex flex-col"
        >
          <LuClipboardPenLine className="text-xl mb-1" />
          Pedidos
        </Link>
        <span
          className="text-center items-center justify-center flex flex-col"
          onClick={() => setIsSidebarOpen(true)}
        >
          <FaUser className="text-xl mb-1" />
          Perfil
        </span>
      </div>

      {isSidebarOpen && <Sidebar onClose={() => setIsSidebarOpen(false)} />}
    </>
  );
};

export default footer;
