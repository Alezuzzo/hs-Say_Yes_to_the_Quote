import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import OrcamentoCard from "../components/OrcamentoCard";
import { Orcamento } from "../types/types";

const Home: React.FC = () => {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadData = () => {
      try {
        const savedData = localStorage.getItem("orcamentos");
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (Array.isArray(parsed)) {
            setOrcamentos(parsed);
          } else {
            console.warn("Dados inválidos no localStorage");
            localStorage.removeItem("orcamentos");
          }
        }
      } catch (error) {
        console.error("Falha ao carregar dados:", error);
      }
    };

    loadData();
  }, []);

  const handleRemove = (id: string) => {
    const updated = orcamentos.filter((o) => o.id !== id);
    setOrcamentos(updated);
    localStorage.setItem("orcamentos", JSON.stringify(updated));
  };

  const removerOrcamento = (id: string) => {
    const novosOrcamentos = orcamentos.filter((o) => o.id !== id);
    setOrcamentos(novosOrcamentos);
    localStorage.setItem(
      "orcamentos",
      JSON.stringify(novosOrcamentos)
    );
  };

  const filteredOrcamentos = orcamentos.filter((orcamento) =>
    orcamento.noiva.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-purple-900">
              Orçamentos
            </h1>
            <div className="flex gap-4">
              <Link
                to="/novo-orcamento"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Novo Orçamento
              </Link>
              <Link
                to="/estoque"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                Estoque
              </Link>
            </div>
          </div>

          <div className="relative max-w-md mx-auto">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Buscar noiva..."
                className="w-full py-1 px-2 pl-8 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {filteredOrcamentos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mt-4">
              {searchTerm
                ? "Nenhum orçamento encontrado"
                : "Nenhum orçamento cadastrado"}
            </h3>
            <p className="text-gray-500 mt-2">
              {searchTerm
                ? "Tente ajustar sua busca"
                : "Crie seu primeiro orçamento"}
            </p>
            {!searchTerm && (
              <Link
                to="/novo-orcamento"
                className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
              >
                Criar Orçamento
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrcamentos.map((orcamento) => (
              <OrcamentoCard
                key={orcamento.id}
                orcamento={orcamento}
                onRemove={(id) => {
                  const novosOrcamentos = orcamentos.filter(
                    (o) => o.id !== id
                  );
                  setOrcamentos(novosOrcamentos);
                  localStorage.setItem(
                    "orcamentos",
                    JSON.stringify(novosOrcamentos)
                  );
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
