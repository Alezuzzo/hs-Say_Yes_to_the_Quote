import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { jsPDF } from "jspdf";
import { Link } from "react-router-dom";
import ServicoCard from "../components/ServicoCard";
import ServicoSelecionadoItem from "../components/ServicoSelecionadoItem";
import ResumoOrcamento from "../components/ResumoOrcamento";

// Tipos e esquema de validação
interface Servico {
  id: number;
  nome: string;
  preco: number;
}

interface ServicoSelecionado extends Servico {
  quantidade: number;
}

interface Orcamento {
  id: string;
  noiva: string;
  dataEvento: string;
  telefone: string;
  email?: string;
  observacoes?: string;
  servicos: ServicoSelecionado[];
  total: number;
  dataCriacao: string;
}

interface FormData {
  noiva: string;
  dataEvento: string;
  telefone: string;
  email?: string;
  observacoes?: string;
}

const schema = yup.object().shape({
  noiva: yup.string().required("Nome da noiva é obrigatório"),
  dataEvento: yup
    .date()
    .required("Data do evento é obrigatória")
    .min(new Date(), "Data não pode ser no passado"),
  telefone: yup
    .string()
    .required("Telefone é obrigatório")
    .matches(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido"),
  email: yup.string().email("E-mail inválido"),
  observacoes: yup.string(),
});

const servicosDisponiveis: Servico[] = [
  { id: 1, nome: "Penteado Noiva", preco: 200 },
  { id: 2, nome: "Penteado Madrinha", preco: 150 },
  { id: 3, nome: "Penteado Mãe da Noiva", preco: 150 },
  { id: 4, nome: "Maquiagem Profissional", preco: 150 },
  { id: 5, nome: "Tratamento Capilar", preco: 200 },
  { id: 6, nome: "Manicure e Pedicure", preco: 100 },
  { id: 7, nome: "Coffee Break", preco: 300 },
];

const formatarData = (dataString: string) => {
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const NovoOrcamento: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [servicosSelecionados, setServicosSelecionados] = useState<
    ServicoSelecionado[]
  >([]);
  const [total, setTotal] = useState<number>(0);
  const [adicionadoRecentemente, setAdicionadoRecentemente] =
    useState<number | null>(null);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("orcamentos");
    if (saved) {
      setOrcamentos(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const novoTotal = servicosSelecionados.reduce(
      (sum, servico) => sum + servico.preco * servico.quantidade,
      0
    );
    setTotal(novoTotal);
  }, [servicosSelecionados]);

  const adicionarServico = (servico: Servico) => {
    const existente = servicosSelecionados.find(
      (s) => s.id === servico.id
    );

    if (existente) {
      setServicosSelecionados(
        servicosSelecionados.map((s) =>
          s.id === servico.id
            ? { ...s, quantidade: s.quantidade + 1 }
            : s
        )
      );
    } else {
      setServicosSelecionados([
        ...servicosSelecionados,
        { ...servico, quantidade: 1 },
      ]);
    }

    setAdicionadoRecentemente(servico.id);
    setTimeout(() => setAdicionadoRecentemente(null), 1000);
  };

  const removerServico = (id: number) => {
    setServicosSelecionados(
      servicosSelecionados.filter((s) => s.id !== id)
    );
  };

  const incrementarQuantidade = (id: number) => {
    setServicosSelecionados(
      servicosSelecionados.map((s) =>
        s.id === id ? { ...s, quantidade: s.quantidade + 1 } : s
      )
    );
  };

  const decrementarQuantidade = (id: number) => {
    setServicosSelecionados(
      servicosSelecionados.map((s) =>
        s.id === id && s.quantidade > 1
          ? { ...s, quantidade: s.quantidade - 1 }
          : s
      )
    );
  };

  const formatarTelefone = (value: string) => {
    const nums = value.replace(/\D/g, "");
    if (nums.length <= 2) return `(${nums}`;
    if (nums.length <= 6)
      return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
    if (nums.length <= 10)
      return `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(
        6
      )}`;
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(
      7,
      11
    )}`;
  };

  const gerarPDF = (data: FormData) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setTextColor(102, 51, 153);

    doc.setFontSize(22);
    doc.text("Orçamento - HairStyle Studio", 105, 20, {
      align: "center",
    });

    doc.setFontSize(14);
    doc.text(`Noiva: ${data.noiva}`, 20, 40);
    doc.text(
      `Data do Evento: ${formatarData(data.dataEvento)}`,
      20,
      50
    );
    doc.text(`Telefone: ${data.telefone}`, 20, 60);
    if (data.email) doc.text(`E-mail: ${data.email}`, 20, 70);
    if (data.observacoes)
      doc.text(`Observações: ${data.observacoes}`, 20, 80);

    doc.setDrawColor(200, 200, 200);
    doc.line(20, 90, 190, 90);

    doc.setFontSize(14);
    doc.text("Serviços Contratados:", 20, 100);

    let yPos = 110;
    servicosSelecionados.forEach((servico, index) => {
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
    doc.text(`R$ ${total.toFixed(2)}`, 160, yPos + 20, {
      align: "right",
    });

    doc.setFontSize(10);
    doc.text("Condições de Pagamento:", 20, yPos + 40);
    doc.text("- 50% no ato do fechamento", 25, yPos + 50);
    doc.text("- 50% no dia do evento", 25, yPos + 60);

    const validade = new Date();
    validade.setDate(validade.getDate() + 7);
    doc.text(
      `Validade: ${formatarData(validade.toISOString())}`,
      20,
      yPos + 80
    );

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Obrigado por escolher a HairStyle Studio!", 105, 280, {
      align: "center",
    });

    doc.save(`Orçamento_${data.noiva.replace(" ", "_")}.pdf`);
  };

  const onSubmit = (data: FormData) => {
    const novoOrcamento: Orcamento = {
      id: Date.now().toString(),
      ...data,
      servicos: servicosSelecionados,
      total,
      dataCriacao: new Date().toISOString(),
    };

    const updatedOrcamentos = [...orcamentos, novoOrcamento];
    setOrcamentos(updatedOrcamentos);
    localStorage.setItem(
      "orcamentos",
      JSON.stringify(updatedOrcamentos)
    );

    gerarPDF(data);
    alert(
      `Orçamento para ${
        data.noiva
      } gerado com sucesso!\nTotal: R$ ${total.toFixed(2)}`
    );
  };

  return (
    <div className="min-h-screen min-w-screen bg-blue-100">
      <div
        className={`max-w-${
          servicosSelecionados.length > 0 ? "6xl" : "3xl"
        } mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6`}
      >
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900">
            Orçamento para Noivas
          </h1>
          <p className="text-purple-600 mt-2">
            Crie seu pacote personalizado para o grande dia
          </p>
          <Link
            to="/orcamentos"
            className="text-purple-500 hover:underline mt-4 inline-block"
          >
            Ver orçamentos anteriores
          </Link>
        </header>

        <div
          className={`flex ${
            servicosSelecionados.length > 0
              ? "flex-col lg:flex-row gap-6"
              : "flex-col"
          }`}
        >
          <div
            className={`${
              servicosSelecionados.length > 0 ? "lg:w-1/2" : "w-full"
            }`}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-purple-800 font-medium mb-2">
                    Nome da Noiva*
                  </label>
                  <input
                    {...register("noiva")}
                    className={`w-full px-4 py-2 border ${
                      errors.noiva
                        ? "border-red-500"
                        : "border-purple-200"
                    } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    placeholder="Seu nome completo"
                  />
                  {errors.noiva && (
                    <span className="text-red-500 text-sm">
                      {errors.noiva.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-purple-800 font-medium mb-2">
                    Data do Evento*
                  </label>
                  <input
                    type="date"
                    {...register("dataEvento")}
                    className={`w-full px-4 py-2 border ${
                      errors.dataEvento
                        ? "border-red-500"
                        : "border-purple-200"
                    } rounded-lg focus:ring-2 focus:ring-purple-500`}
                  />
                  {errors.dataEvento && (
                    <span className="text-red-500 text-sm">
                      {errors.dataEvento.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-purple-800 font-medium mb-2">
                    Telefone*
                  </label>
                  <input
                    {...register("telefone")}
                    onChange={(e) => {
                      const formatted = formatarTelefone(
                        e.target.value
                      );
                      e.target.value = formatted;
                      setValue("telefone", formatted);
                    }}
                    className={`w-full px-4 py-2 border ${
                      errors.telefone
                        ? "border-red-500"
                        : "border-purple-200"
                    } rounded-lg focus:ring-2 focus:ring-purple-500`}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                  {errors.telefone && (
                    <span className="text-red-500 text-sm">
                      {errors.telefone.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-purple-800 font-medium mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className={`w-full px-4 py-2 border ${
                      errors.email
                        ? "border-red-500"
                        : "border-purple-200"
                    } rounded-lg focus:ring-2 focus:ring-purple-500`}
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-purple-800 font-medium mb-2">
                  Observações
                </label>
                <textarea
                  {...register("observacoes")}
                  className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Observações adicionais"
                  rows={3}
                />
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-bold text-purple-900 mb-4">
                  Serviços Disponíveis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servicosDisponiveis.map((servico) => (
                    <ServicoCard
                      key={servico.id}
                      servico={servico}
                      onAdicionar={adicionarServico}
                      adicionadoRecentemente={adicionadoRecentemente}
                    />
                  ))}
                </div>
              </div>
            </form>
          </div>

          {servicosSelecionados.length > 0 && (
            <div className="lg:w-1/2">
              <div className="mt-8">
                <h2 className="text-xl font-bold text-purple-900 mb-4">
                  Serviços Selecionados
                </h2>
                <ul className="space-y-3">
                  {servicosSelecionados.map((servico) => (
                    <ServicoSelecionadoItem
                      key={servico.id}
                      servico={servico}
                      onRemover={removerServico}
                      onIncrementar={incrementarQuantidade}
                      onDecrementar={decrementarQuantidade}
                    />
                  ))}
                </ul>

                <ResumoOrcamento
                  total={total}
                  onSubmit={handleSubmit(onSubmit)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NovoOrcamento;
