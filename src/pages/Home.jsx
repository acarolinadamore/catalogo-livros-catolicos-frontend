/**
 * Página Home - Catálogo Público
 * Busca, filtros e lista de livros integrados
 */

import { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
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
    ano: '',
    indice: '',
    tags: '',
    content_type: '',
    publisher: ''
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
    // Garantir que é string e fazer trim
    const str = String(text).trim();
    if (!str) return '';
    return str
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
      // NÃO enviamos searchQuery para o backend, vamos filtrar localmente com normalização
      const apiParams = {
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

        // Aplicar busca geral (searchQuery) com normalização
        // Busca em: título, autor, editora, categoria, tags
        if (searchQuery) {
          const query = normalizeText(searchQuery);
          resultado = resultado.filter(livro =>
            normalizeText(livro.title).includes(query) ||
            normalizeText(livro.author).includes(query) ||
            normalizeText(livro.publisher).includes(query) ||
            normalizeText(livro.category).includes(query) ||
            normalizeText(livro.tags).includes(query) ||
            (livro.intercessors && normalizeText(livro.intercessors.join(' ')).includes(query)) ||
            (livro.pastoral_uses && normalizeText(livro.pastoral_uses.join(' ')).includes(query))
          );
        }

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

        if (filters.ano) {
          resultado = resultado.filter(livro =>
            livro.year && livro.year.toString().includes(filters.ano)
          );
        }

        if (filters.tags) {
          const query = normalizeText(filters.tags);
          resultado = resultado.filter(livro =>
            normalizeText(livro.tags).includes(query) ||
            (livro.intercessors && normalizeText(livro.intercessors.join(' ')).includes(query)) ||
            (livro.pastoral_uses && normalizeText(livro.pastoral_uses.join(' ')).includes(query))
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

  // Estilos customizados para react-select
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '42px',
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
      '&:hover': {
        borderColor: '#9ca3af'
      },
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '0.5rem',
      marginTop: '4px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 50
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
      color: state.isSelected ? 'white' : '#111827',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#3b82f6'
      }
    }),
    input: (base) => ({
      ...base,
      color: '#111827'
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9ca3af'
    }),
    singleValue: (base) => ({
      ...base,
      color: '#111827'
    })
  };

  // Preparar opções ordenadas alfabeticamente
  const editoraOptions = useMemo(() => {
    if (!filterOptions.publishers) return [];
    return filterOptions.publishers
      .map(pub => ({ value: pub, label: pub }))
      .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));
  }, [filterOptions.publishers]);

  const categoriaOptions = useMemo(() => {
    if (!filterOptions.contentTypes) return [];
    return filterOptions.contentTypes
      .map(type => ({ value: type, label: type }))
      .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));
  }, [filterOptions.contentTypes]);

  const tagsOptions = useMemo(() => {
    const allTags = [
      ...(filterOptions.intercessors || []),
      ...(filterOptions.pastoralUses || [])
    ];
    return allTags
      .map(tag => ({ value: tag, label: tag }))
      .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));
  }, [filterOptions.intercessors, filterOptions.pastoralUses]);

  //  Função para limpar filtros
  function handleClearFilters() {
    setFilters({
      titulo: '',
      autor: '',
      ano: '',
      indice: '',
      tags: '',
      content_type: '',
      publisher: ''
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8">
        {/* Filtros em cima dos cards - sempre abertos */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filtros de Busca</h2>
            <button
              onClick={handleClearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium text-left sm:text-right"
            >
              Limpar filtros
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all hover:border-gray-400"
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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all hover:border-gray-400"
              />
            </div>

            {/* Filtro: Editora */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Editora
              </label>
              <Select
                options={editoraOptions}
                value={editoraOptions.find(opt => opt.value === filters.publisher) || null}
                onChange={(option) => handleFilterChange('publisher', option?.value || '')}
                isClearable
                placeholder="Todas as editoras"
                noOptionsMessage={() => "Nenhuma editora encontrada"}
                styles={selectStyles}
              />
            </div>

            {/* Filtro: Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <Select
                options={categoriaOptions}
                value={categoriaOptions.find(opt => opt.value === filters.content_type) || null}
                onChange={(option) => handleFilterChange('content_type', option?.value || '')}
                isClearable
                placeholder="Todas as categorias"
                noOptionsMessage={() => "Nenhuma categoria encontrada"}
                styles={selectStyles}
              />
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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all hover:border-gray-400"
              />
            </div>

            {/* Filtro: Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <Select
                options={tagsOptions}
                value={tagsOptions.find(opt => opt.value === filters.tags) || null}
                onChange={(option) => handleFilterChange('tags', option?.value || '')}
                isClearable
                placeholder="Todas as tags"
                noOptionsMessage={() => "Nenhuma tag encontrada"}
                styles={selectStyles}
              />
            </div>

            {/* Filtro: Índice - ocupa 2 colunas */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Índice
              </label>
              <input
                type="text"
                value={filters.indice}
                onChange={(e) => handleFilterChange('indice', e.target.value)}
                placeholder="Buscar no índice..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all hover:border-gray-400"
              />
            </div>
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
