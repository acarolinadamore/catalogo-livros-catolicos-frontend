/**
 * Card de livro
 * Exibe informações resumidas do livro
 */

import { Link } from 'react-router-dom';

function BookCard({ book }) {
  return (
    <Link
      to={`/livro/${book.id}`}
      className="book-card p-4 hover:scale-[1.02] transition-transform duration-200 block"
    >
      {/* Ícone/Capa */}
      <div className="aspect-[3/4] bg-gradient-to-br from-primary-100 to-primary-50 rounded-lg mb-3
                    flex items-center justify-center text-5xl">
        {book.cover_image_url ? (
          <img
            src={book.cover_image_url}
            alt={book.title}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span>📖</span>
        )}
      </div>

      {/* Categoria */}
      {book.content_type && (
        <span className="category-badge text-xs mb-2 inline-block">
          {book.content_type}
        </span>
      )}

      {/* Título */}
      <h3 className="font-serif font-bold text-gray-900 mb-1 line-clamp-2">
        {book.title}
      </h3>

      {/* Autor */}
      {book.author && (
        <p className="text-sm text-gray-600 mb-2">
          {book.author}
        </p>
      )}

      {/* Descrição resumida */}
      {book.description && (
        <p className="text-sm text-gray-500 line-clamp-2">
          {book.description}
        </p>
      )}

      {/* Metadados adicionais */}
      <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
        <span>{book.publisher}</span>
        <span>{book.year}</span>
      </div>
    </Link>
  );
}

export default BookCard;
