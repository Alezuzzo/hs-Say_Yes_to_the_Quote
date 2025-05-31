import React from "react";
import { formatarMoeda } from "../utils/formatadores";

// Permite receber qualquer função de submit do react-hook-form
interface ResumoOrcamentoProps {
  total: number;
  onSubmit: (...args: unknown[]) => void;
}

const ResumoOrcamento: React.FC<ResumoOrcamentoProps> = ({
  total,
  onSubmit,
}) => {
  return (
    <div className="mt-8 bg-purple-50 p-6 rounded-lg border border-purple-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-purple-900">
          Total do Orçamento
        </h3>
        <span className="text-2xl font-bold text-purple-900">
          {formatarMoeda(total)}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-purple-800 mb-1">
          <span>Subtotal:</span>
          <span>{formatarMoeda(total)}</span>
        </div>
        <div className="flex justify-between text-sm text-purple-800">
          <span>Desconto:</span>
          <span>R$ 0,00</span>
        </div>
      </div>

      <div className="border-t border-purple-200 pt-4 mb-6">
        <div className="flex justify-between font-bold text-purple-900">
          <span className="text-lg font-semibold text-purple-800">
            Total
          </span>
          <span className="text-2xl font-bold text-purple-900">
            R$ {total.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
      >
        Gerar Orçamento (PDF)
      </button>

      <p className="text-xs text-purple-500 mt-3 text-center">
        Ao confirmar, um PDF será gerado automaticamente
      </p>
    </div>
  );
};

export default ResumoOrcamento;
