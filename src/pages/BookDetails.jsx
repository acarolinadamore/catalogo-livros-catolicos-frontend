/**
 * Página de Detalhes do Livro
 * Exibe todas as informações do livro selecionado
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { booksAPI } from '../config/api';

// Ícones por tipo de conteúdo
const contentTypeIcons = {
  'Bíblia': '📖',
  'Teologia': '✝️',
  'Espiritualidade': '🕊️',
  'Catequese': '📚',
  'Liturgia': '⛪',
  'História da Igreja': '🏛️',
  'Doutrina Social': '🤝',
  'Vida de Santos': '👼',
  'Documentos da Igreja': '📜'
};

function BookDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detectar de onde veio (se veio de /listar)
  const fromPath = location.state?.from || '/';

  useEffect(() => {
    loadBook();
  }, [id]);

  async function loadBook() {
    setLoading(true);
    setError(null);

    try {
      const response = await booksAPI.getById(id);

      if (response.success) {
        setBook(response.data);
      } else {
        setError('Livro não encontrado');
      }
    } catch (err) {
      console.error('Erro ao carregar livro:', err);
      setError('Erro ao carregar detalhes do livro');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
        <p className="mt-4 text-gray-600">Carregando livro...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="text-red-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-700 font-medium mb-4">{error}</p>
        <Link to="/" className="btn-primary inline-block">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link to={fromPath} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          ← {fromPath === '/listar' ? 'Voltar à lista' : 'Voltar ao catálogo'}
        </Link>
      </nav>

      {/* Conteúdo principal */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Coluna da esquerda - Capa */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <div className="aspect-[3/4] bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg
                          flex items-center justify-center text-9xl shadow-lg">
              {book.cover_image_url ? (
                <img
                  src={book.cover_image_url}
                  alt={book.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span>{contentTypeIcons[book.content_type] || '📕'}</span>
              )}
            </div>
          </div>
        </div>

        {/* Coluna da direita - Informações */}
        <div className="lg:col-span-8">
          {/* Categoria */}
          {book.content_type && (
            <span className="category-badge mb-4 inline-block">
              {book.content_type}
            </span>
          )}

          {/* Título */}
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            {book.title}
          </h1>

          {/* Autor */}
          {book.author && (
            <p className="text-xl text-gray-600 mb-6">
              {book.author}
            </p>
          )}

          {/* Tags */}
          {book.tags && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {book.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadados */}
          <div className="mb-6 space-y-3">
            {book.publisher && (
              <div className="flex items-start text-sm">
                <span className="text-gray-500 font-medium w-32">Editora:</span>
                <span className="text-gray-900">{book.publisher}</span>
              </div>
            )}
            {book.year && (
              <div className="flex items-start text-sm">
                <span className="text-gray-500 font-medium w-32">Ano:</span>
                <span className="text-gray-900">{book.year}</span>
              </div>
            )}
            {book.intercessors && book.intercessors.length > 0 && (
              <div className="flex items-start text-sm">
                <span className="text-gray-500 font-medium w-32">Intercessores:</span>
                <span className="text-gray-900">{book.intercessors.join(', ')}</span>
              </div>
            )}
            {book.pastoral_uses && book.pastoral_uses.length > 0 && (
              <div className="flex items-start text-sm">
                <span className="text-gray-500 font-medium w-32">Uso Pastoral:</span>
                <span className="text-gray-900">{book.pastoral_uses.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Descrição */}
          {book.description && (
            <div className="mb-6">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">
                Descrição
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                {book.description}
              </p>
            </div>
          )}

          {/* Índice */}
          {book.index_text && (
            <div className="mb-6">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-3">
                Índice
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                {book.index_text}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
