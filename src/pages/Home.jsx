/**
 * Página Home - Catálogo Público
 * Busca, filtros e lista de livros integrados
 */

import { useState, useEffect } from 'react';
import Hero from '../components/home/Hero';
import Filters from '../components/home/Filters';
import BookList from '../components/books/BookList';
import { searchAPI } from '../config/api';

function Home() {
  // Estado da busca
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    content_type: '',
    intercessor: '',
    pastoral_use: '',
    publisher: '',
    year_min: '',
    year_max: ''
  });

  // Estado dos resultados
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado das opções de filtros
  const [filterOptions, setFilterOptions] = useState({
    contentTypes: [],
    intercessors: [],
    pastoralUses: [],
    publishers: [],
    yearRange: {}
  });

  // Carregar opções de filtros ao montar
  useEffect(() => {
    loadFilterOptions();
  }, []);

  // Carregar livros ao mudar busca ou filtros
  useEffect(() => {
    loadBooks();
  }, [searchQuery, filters]);

  // Carregar opções de filtros
  async function loadFilterOptions() {
    try {
      const response = await searchAPI.getFilterOptions();
      if (response.success) {
        setFilterOptions(response.data);
      }
    } catch (err) {
      console.error('Erro ao carregar opções de filtros:', err);
    }
  }

  // Carregar livros com busca e filtros
  async function loadBooks() {
    setLoading(true);
    setError(null);

    try {
      const params = {
        q: searchQuery,
        ...filters
      };

      // Remover parâmetros vazios
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await searchAPI.search(params);

      if (response.success) {
        setBooks(response.data);
      } else {
        setError('Erro ao buscar livros');
      }
    } catch (err) {
      console.error('Erro ao buscar livros:', err);
      setError('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  }

  // Handler de mudança de filtro
  function handleFilterChange(filterName, value) {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  }

  return (
    <div>
      {/* Hero com busca */}
      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={loadBooks}
      />

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Layout com filtros na lateral */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Filtros (coluna lateral) */}
          <aside className="lg:col-span-3 mb-8 lg:mb-0">
            <div className="sticky top-24">
              <Filters
                filters={filters}
                onFilterChange={handleFilterChange}
                filterOptions={filterOptions}
              />
            </div>
          </aside>

          {/* Lista de livros (área principal) */}
          <main className="lg:col-span-9">
            <BookList
              books={books}
              loading={loading}
              error={error}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Home;
