/**
 * Hero da página inicial
 * Destaque visual com título e campo de busca centralizado
 */

function Hero({ searchQuery, onSearchChange, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <section className="bg-gradient-to-b from-primary-50 to-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Título principal */}
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
          Encontre seu próximo livro
        </h1>

        {/* Subtítulo */}
        <p className="text-lg text-gray-600 mb-8">
          Busque por título, autor, palavra-chave ou utilize os filtros
        </p>

        {/* Campo de busca GRANDE e CENTRALIZADO */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Digite para buscar..."
              className="w-full px-6 py-4 pr-14 text-lg rounded-xl border border-gray-300
                       focus:outline-none focus:border-primary-500
                       transition-all duration-200 shadow-md"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2
                       p-2 text-primary-600 hover:text-primary-700
                       hover:bg-primary-50 rounded-lg transition-colors"
              aria-label="Buscar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Hero;
