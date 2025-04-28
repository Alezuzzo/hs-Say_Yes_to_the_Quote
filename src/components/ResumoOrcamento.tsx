import React from "react";

interface ResumoOrcamentoProps {
  total: number;
  onSubmit: () => void;
}

const ResumoOrcamento: React.FC<ResumoOrcamentoProps> = ({
  total,
  onSubmit,
}) => {
  return (
    <div className="mt-6">
      <div className="p-4 bg-purple-100 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-purple-900">
            Total
          </span>
          <span className="text-2xl font-bold text-purple-800">
            R$ {total.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="w-full mt-8 py-3 rounded-lg font-bold text-white transition bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg download-btn"
      >
        Gerar Orçamento (PDF)
      </button>
    </div>
  );
};

export default ResumoOrcamento;
