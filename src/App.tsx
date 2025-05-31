import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import NovoOrcamento from "./components/NovoOrcamento";
import OrcamentoCard from "./components/OrcamentoCard";
import Estoque from "./pages/Estoque";
import { Orcamento } from "./types/types";

const App: React.FC = () => {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>(() => {
    // Carrega orçamentos do localStorage ao iniciar
    const saved = localStorage.getItem("orcamentos");
    return saved ? JSON.parse(saved) : [];
  });
  const [mostrarNovoOrcamento, setMostrarNovoOrcamento] =
    useState(false);

  const adicionarOrcamento = (novoOrcamento: Orcamento) => {
    const updatedOrcamentos = [...orcamentos, novoOrcamento];
    setOrcamentos(updatedOrcamentos);
    localStorage.setItem(
      "orcamentos",
      JSON.stringify(updatedOrcamentos)
    );
    setMostrarNovoOrcamento(false);
  };

  const removerOrcamento = (id: string) => {
    const updatedOrcamentos = orcamentos.filter((o) => o.id !== id);
    setOrcamentos(updatedOrcamentos);
    localStorage.setItem(
      "orcamentos",
      JSON.stringify(updatedOrcamentos)
    );
  };

  return (
    <Router>
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold text-purple-800">
                    Sistema de Orçamentos
                  </h1>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setMostrarNovoOrcamento(true)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Novo Orçamento
                    </button>
                    <Link
                      to="/estoque"
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Estoque
                    </Link>
                  </div>
                </div>

                {mostrarNovoOrcamento && (
                  <div className="mb-8">
                    <NovoOrcamento
                      onSalvar={adicionarOrcamento}
                      onCancelar={() =>
                        setMostrarNovoOrcamento(false)
                      }
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                  {orcamentos.length > 0 ? (
                    orcamentos.map((orcamento) => (
                      <OrcamentoCard
                        key={orcamento.id}
                        orcamento={orcamento}
                        onRemove={removerOrcamento}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        Nenhum orçamento cadastrado
                      </p>
                      <button
                        onClick={() => setMostrarNovoOrcamento(true)}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                      >
                        Criar Primeiro Orçamento
                      </button>
                    </div>
                  )}
                </div>
              </>
            }
          />
          <Route path="/estoque" element={<Estoque />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
