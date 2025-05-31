import React from "react";
import { Servico } from "../types/types";
import { formatarMoeda } from "../utils/formatadores";

interface ServicoCardProps {
  servico: Servico;
  onAdicionar: (servico: Servico) => void;
  adicionadoRecentemente: number | null;
}

const ServicoCard: React.FC<ServicoCardProps> = ({
  servico,
  onAdicionar,
  adicionadoRecentemente,
}) => {
  const isRecentementeAdicionado =
    adicionadoRecentemente === Number(servico.id);

  return (
    <div
      className={`relative p-4 border rounded-lg transition-all duration-200 ${
        isRecentementeAdicionado
          ? "border-green-500 bg-green-50"
          : "border-gray-200 hover:border-purple-300 hover:shadow-md"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">
            {servico.nome}
          </h3>
          <span
            className={`text-sm ${
              servico.tipo === "servico"
                ? "text-green-600"
                : "text-blue-600"
            }`}
          >
            {servico.tipo === "servico" ? "Serviço" : "Produto"}
          </span>
        </div>
        <span className="font-bold text-purple-900">
          {formatarMoeda(servico.preco)}
        </span>
      </div>

      <button
        onClick={() => onAdicionar(servico)}
        className={`mt-3 w-full py-2 text-sm rounded-md transition-colors ${
          isRecentementeAdicionado
            ? "bg-green-500 text-white"
            : "bg-purple-600 text-white hover:bg-purple-700"
        }`}
      >
        {isRecentementeAdicionado ? "✓ Adicionado" : "+ Adicionar"}
      </button>

      {isRecentementeAdicionado && (
        <div className="absolute -top-2 -right-2">
          <span className="flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
          </span>
        </div>
      )}
    </div>
  );
};

export default ServicoCard;
