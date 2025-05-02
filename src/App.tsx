import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/Home";
import NovoOrcamento from "./pages/NovoOrcamento";
import Estoque from "./pages/Estoque";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/novo-orcamento" element={<NovoOrcamento />} />
        <Route path="/estoque" element={<Estoque />} />
      </Routes>
    </Router>
  );
};

export default App;
