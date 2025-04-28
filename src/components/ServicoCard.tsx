import React from "react";

interface Servico {
  id: number;
  nome: string;
  preco: number;
}

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
  return (
    <div className="flex justify-between items-center p-4 border border-purple-100 rounded-lg hover:bg-purple-50 transition hover-effect">
      <div>
        <h3 className="font-medium text-purple-900">
          {servico.nome}
        </h3>
        <p className="text-purple-700">
          R$ {servico.preco.toFixed(2)}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onAdicionar(servico)}
        className={`px-4 py-2 rounded-lg text-white transition ${
          adicionadoRecentemente === servico.id
            ? "bg-green-500"
            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
        }`}
      >
        {adicionadoRecentemente === servico.id
          ? "✓ Adicionado"
          : "Adicionar"}
      </button>
    </div>
  );
};

export default ServicoCard;
