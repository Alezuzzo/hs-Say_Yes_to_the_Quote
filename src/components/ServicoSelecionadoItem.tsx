import React from "react";

interface ServicoSelecionado {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
}

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
    <li className="flex justify-between items-center bg-purple-50 p-4 rounded-lg">
      <div>
        <span className="font-medium text-purple-900">
          {servico.nome}
        </span>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => onDecrementar(servico.id)}
            className="text-purple-600 hover:text-purple-800 text-sm"
            disabled={servico.quantidade <= 1}
          >
            −
          </button>
          <span className="text-sm">Qtd: {servico.quantidade}</span>
          <button
            onClick={() => onIncrementar(servico.id)}
            className="text-purple-600 hover:text-purple-800 text-sm"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-purple-700 font-bold">
          R$ {(servico.preco * servico.quantidade).toFixed(2)}
        </span>
        <button
          type="button"
          onClick={() => onRemover(servico.id)}
          className="text-red-500 hover:text-red-700 text-lg font-bold"
        >
          ×
        </button>
      </div>
    </li>
  );
};

export default ServicoSelecionadoItem;
