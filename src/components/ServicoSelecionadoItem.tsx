import React from "react";
import { ServicoSelecionado } from "../types/types";
import { formatarMoeda } from "../utils/formatadores";

interface ServicoSelecionadoItemProps {
  servico: ServicoSelecionado;
  onRemover: (id: number) => void;
  onIncrementar: (id: number) => void;
  onDecrementar: (id: number) => void;
}

const ServicoSelecionadoItem: React.FC<
  ServicoSelecionadoItemProps
> = ({ servico, onRemover, onIncrementar, onDecrementar }) => {
  return (
    <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{servico.nome}</h4>
        <div className="flex items-center mt-1">
          <button
            onClick={() => onDecrementar(Number(servico.id))}
            disabled={servico.quantidade <= 1}
            className={`w-8 h-8 flex items-center justify-center rounded-md ${
              servico.quantidade <= 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-purple-100 text-purple-700 hover:bg-purple-200"
            }`}
          >
            -
          </button>
          <span className="mx-3 w-8 text-center">
            {servico.quantidade}
          </span>
          <button
            onClick={() => onIncrementar(Number(servico.id))}
            className="w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-md"
          >
            +
          </button>
        </div>
      </div>

      <div className="text-right">
        <span className="block font-bold text-purple-900">
          {formatarMoeda(servico.preco * servico.quantidade)}
        </span>
        <span className="text-sm text-gray-500">
          {formatarMoeda(servico.preco)}/un
        </span>
      </div>

      <button
        onClick={() => onRemover(Number(servico.id))}
        className="ml-4 p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full"
        aria-label="Remover"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </li>
  );
};

export default ServicoSelecionadoItem;
