import React from "react";
import { Orcamento } from "../types/types";
import { formatarData, formatarMoeda } from "../utils/formatadores";
import { jsPDF } from "jspdf";

interface OrcamentoCardProps {
  orcamento: Orcamento;
  onRemove: (id: string) => void;
}

const OrcamentoCard: React.FC<OrcamentoCardProps> = ({
  orcamento,
  onRemove,
}) => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setTextColor(102, 51, 153);

    doc.setFontSize(22);
    doc.text("Orçamento - HairStyle Studio", 105, 20, {
      align: "center",
    });

    doc.setFontSize(14);
    doc.text(`Noiva: ${orcamento.noiva}`, 20, 40);
    doc.text(
      `Data do Evento: ${formatarData(orcamento.dataEvento)}`,
      20,
      50
    );
    doc.text(`Telefone: ${orcamento.telefone}`, 20, 60);
    if (orcamento.email)
      doc.text(`E-mail: ${orcamento.email}`, 20, 70);
    if (orcamento.observacoes)
      doc.text(`Observações: ${orcamento.observacoes}`, 20, 80);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 90, 190, 90);

    doc.setFontSize(14);
    doc.text("Serviços Contratados:", 20, 100);

    let yPos = 110;
    orcamento.servicos.forEach((servico, index) => {
      doc.setFontSize(12);
      doc.text(
        `${index + 1}. ${servico.nome} (${servico.quantidade}x)`,
        25,
        yPos
      );
      doc.text(
        `R$ ${(servico.preco * servico.quantidade).toFixed(2)}`,
        160,
        yPos,
        { align: "right" }
      );
      yPos += 10;
    });

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Total:", 160, yPos + 10, { align: "right" });
    doc.text(`R$ ${orcamento.total.toFixed(2)}`, 160, yPos + 20, {
      align: "right",
    });

    doc.save(
      `Orçamento_${orcamento.noiva.replace(" ", "_")}_${
        orcamento.id
      }.pdf`
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-purple-800">
              {orcamento.noiva}
            </h2>
            <p className="text-sm text-gray-500">
              Criado em: {formatarData(orcamento.dataCriacao)}
            </p>
          </div>
          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {formatarData(orcamento.dataEvento)}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-semibold">Contato:</span>{" "}
            {orcamento.telefone}
            {orcamento.email && ` • ${orcamento.email}`}
          </p>
          {orcamento.observacoes && (
            <p className="text-gray-600 mt-2">
              <span className="font-semibold">Obs:</span>{" "}
              {orcamento.observacoes}
            </p>
          )}
        </div>

        <div className="border-t border-gray-200 pt-3">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Serviços contratados:
          </p>
          <ul className="space-y-1">
            {orcamento.servicos.slice(0, 3).map((servico) => (
              <li
                key={servico.id}
                className="flex justify-between text-sm"
              >
                <span className="text-gray-600">
                  {servico.nome}{" "}
                  <span className="text-gray-400">
                    (x{servico.quantidade})
                  </span>
                </span>
                <span className="text-gray-800 font-medium">
                  {formatarMoeda(servico.preco * servico.quantidade)}
                </span>
              </li>
            ))}
            {orcamento.servicos.length > 3 && (
              <li className="text-sm text-gray-500">
                + {orcamento.servicos.length - 3} itens...
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <div>
          <span className="text-gray-600 text-sm mr-3">Total:</span>
          <span className="text-lg font-bold text-purple-800">
            {formatarMoeda(orcamento.total)}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            PDF
          </button>
          <button
            onClick={() => onRemove(orcamento.id)}
            className="flex items-center text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded-md transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Remover
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrcamentoCard;
