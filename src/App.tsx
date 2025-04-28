import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import NovoOrcamento from "./components/NovoOrcamento";
import OrcamentoList from "./components/OrcamentoList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NovoOrcamento />} />
        <Route path="/orcamentos" element={<OrcamentoList />} />
      </Routes>
    </Router>
  );
}

export default App;
