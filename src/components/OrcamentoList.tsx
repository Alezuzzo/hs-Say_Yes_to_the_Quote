import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";

interface Orcamento {
  id: string;
  noiva: string;
  dataEvento: string;
  telefone: string;
  email?: string;
  observacoes?: string;
  servicos: Array<{
    id: number;
    nome: string;
    preco: number;
    quantidade: number;
  }>;
  total: number;
  dataCriacao: string;
}

const formatarData = (dataString: string) => {
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const OrcamentoList: React.FC = () => {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("orcamentos");
    if (saved) {
      setOrcamentos(JSON.parse(saved));
    }
  }, []);

  const gerarPDF = (orcamento: Orcamento) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setTextColor(102, 51, 153);

    doc.setFontSize(22);
    doc.text(`Orçamento - ${orcamento.noiva}`, 105, 20, {
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
    doc.setFont(undefined, "bold");
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
    <div className="min-h-screen min-w-screen bg-blue-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900">
            Orçamentos Anteriores
          </h1>
          <Link
            to="/"
            className="text-purple-500 hover:underline mt-4 inline-block"
          >
            Criar novo orçamento
          </Link>
        </header>

        {orcamentos.length === 0 ? (
          <p className="text-center text-gray-500">
            Nenhum orçamento encontrado
          </p>
        ) : (
          <div className="grid gap-4">
            {orcamentos.map((orcamento) => (
              <div
                key={orcamento.id}
                className="border p-4 rounded-lg hover:bg-purple-50 transition"
              >
                <h2 className="font-bold text-lg">
                  {orcamento.noiva} -{" "}
                  {formatarData(orcamento.dataEvento)}
                </h2>
                <p className="text-gray-600">
                  Criado em: {formatarData(orcamento.dataCriacao)}
                </p>
                <div className="mt-2">
                  <span className="font-bold text-purple-800">
                    Total: R$ {orcamento.total.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 flex gap-4">
                  <button
                    onClick={() => gerarPDF(orcamento)}
                    className="text-purple-600 hover:underline download-btn px-4 py-2 rounded text-white"
                  >
                    Baixar PDF
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Deseja realmente excluir este orçamento?"
                        )
                      ) {
                        const updated = orcamentos.filter(
                          (o) => o.id !== orcamento.id
                        );
                        setOrcamentos(updated);
                        localStorage.setItem(
                          "orcamentos",
                          JSON.stringify(updated)
                        );
                      }
                    }}
                    className="text-red-600 hover:underline px-4 py-2 rounded bg-red-100 hover:bg-red-200"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrcamentoList;
