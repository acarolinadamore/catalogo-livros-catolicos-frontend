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
    titulo: '',
    autor: '',
    editora: '',
    categoria: '',
    ano: '',
    indice: '',
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

  // Função auxiliar para normalizar texto (remover acentos)
  function normalizeText(text) {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  // Carregar livros com busca e filtros
  async function loadBooks() {
    setLoading(true);
    setError(null);

    try {
      // Montar parâmetros para API do backend
      const apiParams = {
        q: searchQuery,
        content_type: filters.content_type,
        publisher: filters.publisher,
        index_search: filters.indice, // Busca específica no índice
      };

      // Remover parâmetros vazios
      Object.keys(apiParams).forEach(key => {
        if (apiParams[key] === '' || apiParams[key] === null || apiParams[key] === undefined) {
          delete apiParams[key];
        }
      });

      const response = await searchAPI.search(apiParams);

      if (response.success) {
        let resultado = response.data;

        // Aplicar filtros locais adicionais (título, autor, editora, ano)
        // Esses são aplicados no frontend para maior precisão

        if (filters.titulo) {
          const query = normalizeText(filters.titulo);
          resultado = resultado.filter(livro =>
            normalizeText(livro.title).includes(query)
          );
        }

        if (filters.autor) {
          const query = normalizeText(filters.autor);
          resultado = resultado.filter(livro =>
            normalizeText(livro.author).includes(query)
          );
        }

        if (filters.editora) {
          const query = normalizeText(filters.editora);
          resultado = resultado.filter(livro =>
            normalizeText(livro.publisher).includes(query)
          );
        }

        if (filters.ano) {
          resultado = resultado.filter(livro =>
            livro.year && livro.year.toString().includes(filters.ano)
          );
        }

        setBooks(resultado);
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

  //  Função para limpar filtros
  function handleClearFilters() {
    setFilters({
      titulo: '',
      autor: '',
      editora: '',
      categoria: '',
      ano: '',
      indice: '',
      content_type: '',
      intercessor: '',
      pastoral_use: '',
      publisher: '',
      year_min: '',
      year_max: ''
    });
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
        {/* Filtros em cima dos cards - sempre abertos */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filtros de Busca</h2>
            <button
              onClick={handleClearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Limpar filtros
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro: Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={filters.titulo}
                onChange={(e) => handleFilterChange('titulo', e.target.value)}
                placeholder="Buscar por título..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Filtro: Autor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autor
              </label>
              <input
                type="text"
                value={filters.autor}
                onChange={(e) => handleFilterChange('autor', e.target.value)}
                placeholder="Buscar por autor..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Filtro: Editora */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Editora
              </label>
              <input
                type="text"
                value={filters.editora}
                onChange={(e) => handleFilterChange('editora', e.target.value)}
                placeholder="Buscar por editora..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Filtro: Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={filters.content_type || ''}
                onChange={(e) => handleFilterChange('content_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
              >
                <option value="">Todas</option>
                {filterOptions.contentTypes?.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Filtro: Ano */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ano
              </label>
              <input
                type="text"
                value={filters.ano}
                onChange={(e) => handleFilterChange('ano', e.target.value)}
                placeholder="Ex: 2020"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Filtro: Índice */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Índice
              </label>
              <input
                type="text"
                value={filters.indice}
                onChange={(e) => handleFilterChange('indice', e.target.value)}
                placeholder="Buscar no índice..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Filtro: Editora (select) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar Editora
              </label>
              <select
                value={filters.publisher || ''}
                onChange={(e) => handleFilterChange('publisher', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
              >
                <option value="">Todas</option>
                {filterOptions.publishers?.map(publisher => (
                  <option key={publisher} value={publisher}>{publisher}</option>
                ))}
              </select>
            </div>

            {/* Espaço reservado para manter grid */}
            <div></div>
          </div>
        </div>

        {/* Lista de livros */}
        <BookList
          books={books}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}

export default Home;
