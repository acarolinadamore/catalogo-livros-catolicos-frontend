/**
 * Configuração da API
 * Centraliza a URL base e funções de requisição
 */

// URL da API - ajustar conforme ambiente
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Fazer requisição GET
 */
async function get(endpoint, params = {}) {
  try {
    const url = new URL(`${API_BASE_URL}${endpoint}`);

    // Adicionar query params
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

/**
 * API de Catálogos
 */
export const catalogsAPI = {
  list: () => get('/catalogs'),
  getBySlug: (slug) => get(`/catalogs/${slug}`),
  getBooks: (slug, params) => get(`/catalogs/${slug}/books`, params)
};

/**
 * API de Livros
 */
export const booksAPI = {
  list: (params) => get('/books', params),
  getById: (id) => get(`/books/${id}`),
  getRecent: (limit) => get('/books/recent', { limit })
};

/**
 * API de Busca
 */
export const searchAPI = {
  search: (params) => get('/search', params),
  getFilterOptions: () => get('/search/filters')
};

export default {
  catalogsAPI,
  booksAPI,
  searchAPI
};
