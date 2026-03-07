/**
 * Componente principal da aplicação
 * Define rotas e layout geral
 */

import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';
import About from './pages/About';
import CadastroLivro from './pages/CadastroLivro';
import ListarLivros from './pages/ListarLivros';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/livro/:id" element={<BookDetails />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/cadastrar" element={<CadastroLivro />} />
        <Route path="/listar" element={<ListarLivros />} />
      </Routes>
    </Layout>
  );
}

export default App;
