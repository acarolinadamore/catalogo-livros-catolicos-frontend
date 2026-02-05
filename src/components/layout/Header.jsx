/**
 * Header da aplicação
 * Simples e sóbrio, com navegação principal
 */

import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e título */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-gray-900">
                Biblioteca Católica
              </h1>
            </div>
          </Link>

          {/* Navegação */}
          <nav className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Catálogo
            </Link>
            <Link
              to="/sobre"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Sobre
            </Link>
            <button
              disabled
              className="text-gray-400 font-medium cursor-not-allowed"
              title="Em breve"
            >
              Entrar
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
