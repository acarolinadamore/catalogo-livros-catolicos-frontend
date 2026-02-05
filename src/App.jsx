/**
 * Componente principal da aplicação
 * Define rotas e layout geral
 */

import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import BookDetails from './pages/BookDetails';
import About from './pages/About';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/livro/:id" element={<BookDetails />} />
        <Route path="/sobre" element={<About />} />
      </Routes>
    </Layout>
  );
}

export default App;
