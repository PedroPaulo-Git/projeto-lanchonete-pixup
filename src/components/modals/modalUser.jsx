import { useState } from "react";

export default function UserInfoModal({ onSubmit, handleOpenUserModal }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const formatPhone = (value) => {
    // Remove tudo que não for número
    const numericValue = value.replace(/\D/g, "");

    // Limita a 11 dígitos
    const limitedValue = numericValue.slice(0, 11);

    return limitedValue;
  };

  const handlePhoneChange = (e) => {
    setPhone(formatPhone(e.target.value));
  };
  const handleSubmit = () => {
    // Obtém os dados antigos do localStorage
    const existingData = JSON.parse(localStorage.getItem("userData")) || {};

    // Mantém os dados de address e atualiza apenas as informações do usuário
    const updatedData = {
      ...existingData, // Mantém todos os dados antigos
      name,
      phone,
      email, // Atualiza apenas os dados do usuário
    };

    // Salva os dados atualizados no localStorage
    localStorage.setItem("userData", JSON.stringify(updatedData));
    onSubmit();
  };

  const isFormValid =
    name !== "" && phone.length >= 10 && phone.length <= 11 && email !== "";

  return (
    <div className="fixed inset-0 flex justify-center bg-white items-center h-screen bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded">
        <h2 className="text-xl mb-4 font-semibold">
          Por favor, informe seus dados
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600">
            E-mail:
          </label>
          <input
            type="email"
            className="w-full p-2 border border-gray-400 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600">
            Nome:
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-400 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600">
            Telefone:
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-400 rounded"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="Digite seu telefone"
            maxLength={11} // Impede que o usuário digite mais de 11 caracteres
          />
        </div>
        <button
          onClick={handleSubmit}
          className={`flex justify-center my-4 mx-auto rounded-lg w-full py-3 font-medium text-white sm:w-auto ${
            isFormValid ? "bg-black" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isFormValid}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
