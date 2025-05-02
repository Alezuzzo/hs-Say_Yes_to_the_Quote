import React, { useState, useEffect } from "react";
import EstoqueForm from "../components/EstoqueForm";
import { Servico } from "../types/types";

const Estoque: React.FC = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [editingServico, setEditingServico] =
    useState<Servico | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("servicos");
    if (saved) {
      setServicos(JSON.parse(saved));
    } else {
      // Serviços padrão
      const defaultServicos: Servico[] = [
        {
          id: 1,
          nome: "Penteado Noiva",
          preco: 200,
          tipo: "servico",
        },
        {
          id: 2,
          nome: "Penteado Madrinha",
          preco: 150,
          tipo: "servico",
        },
        {
          id: 3,
          nome: "Maquiagem Profissional",
          preco: 150,
          tipo: "servico",
        },
        {
          id: 4,
          nome: "Shampoo Especial",
          preco: 50,
          tipo: "produto",
        },
      ];
      setServicos(defaultServicos);
      localStorage.setItem(
        "servicos",
        JSON.stringify(defaultServicos)
      );
    }
  }, []);

  const handleSave = (servico: Servico) => {
    let novosServicos: Servico[];

    if (servico.id) {
      // Edição
      novosServicos = servicos.map((s) =>
        s.id === servico.id ? servico : s
      );
    } else {
      // Novo
      const newId = Math.max(...servicos.map((s) => s.id), 0) + 1;
      novosServicos = [...servicos, { ...servico, id: newId }];
    }

    setServicos(novosServicos);
    localStorage.setItem("servicos", JSON.stringify(novosServicos));
    setEditingServico(null);
  };

  const handleEdit = (servico: Servico) => {
    setEditingServico(servico);
  };

  const handleRemove = (id: number) => {
    const novosServicos = servicos.filter((s) => s.id !== id);
    setServicos(novosServicos);
    localStorage.setItem("servicos", JSON.stringify(novosServicos));
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900">
            Gerenciar Estoque
          </h1>
          <a
            href="/"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Voltar
          </a>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-purple-900 mb-4">
            {editingServico ? "Editar Item" : "Adicionar Novo Item"}
          </h2>
          <EstoqueForm
            onSubmit={handleSave}
            servico={editingServico}
            onCancel={() => setEditingServico(null)}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-bold text-purple-900 p-6">
            Itens Cadastrados
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {servicos.map((servico) => (
                  <tr key={servico.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {servico.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                          servico.tipo === "servico"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {servico.tipo === "servico"
                          ? "Serviço"
                          : "Produto"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {servico.preco.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEdit(servico)}
                        className="text-purple-600 hover:text-purple-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleRemove(servico.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estoque;
