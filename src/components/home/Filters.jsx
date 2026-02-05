/**
 * Componente de Filtros
 * Filtros estruturados colapsáveis
 */

import { useState, useEffect } from 'react';

function Filters({ filters, onFilterChange, filterOptions }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header do filtro - colapsável */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left
                 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-medium text-gray-900">Filtros</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Conteúdo dos filtros */}
      {isOpen && (
        <div className="px-6 pb-6 pt-2 space-y-6 border-t border-gray-200">
          {/* Filtro: Tipo de Conteúdo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Conteúdo
            </label>
            <select
              value={filters.content_type || ''}
              onChange={(e) => onFilterChange('content_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            >
              <option value="">Todos</option>
              {filterOptions.contentTypes?.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Filtro: Intercessor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intercessor / Devoção
            </label>
            <select
              value={filters.intercessor || ''}
              onChange={(e) => onFilterChange('intercessor', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            >
              <option value="">Todos</option>
              {filterOptions.intercessors?.map(intercessor => (
                <option key={intercessor} value={intercessor}>{intercessor}</option>
              ))}
            </select>
          </div>

          {/* Filtro: Uso Pastoral */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Uso Pastoral
            </label>
            <select
              value={filters.pastoral_use || ''}
              onChange={(e) => onFilterChange('pastoral_use', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            >
              <option value="">Todos</option>
              {filterOptions.pastoralUses?.map(use => (
                <option key={use} value={use}>{use}</option>
              ))}
            </select>
          </div>

          {/* Filtro: Editora */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Editora
            </label>
            <select
              value={filters.publisher || ''}
              onChange={(e) => onFilterChange('publisher', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
            >
              <option value="">Todas</option>
              {filterOptions.publishers?.map(publisher => (
                <option key={publisher} value={publisher}>{publisher}</option>
              ))}
            </select>
          </div>

          {/* Filtro: Ano */}
          {filterOptions.yearRange?.min && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ano de Publicação
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">De</label>
                  <input
                    type="number"
                    min={filterOptions.yearRange.min}
                    max={filterOptions.yearRange.max}
                    value={filters.year_min || ''}
                    onChange={(e) => onFilterChange('year_min', e.target.value)}
                    placeholder={filterOptions.yearRange.min.toString()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Até</label>
                  <input
                    type="number"
                    min={filterOptions.yearRange.min}
                    max={filterOptions.yearRange.max}
                    value={filters.year_max || ''}
                    onChange={(e) => onFilterChange('year_max', e.target.value)}
                    placeholder={filterOptions.yearRange.max.toString()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg
                             focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botão limpar filtros */}
          <button
            onClick={() => {
              onFilterChange('content_type', '');
              onFilterChange('intercessor', '');
              onFilterChange('pastoral_use', '');
              onFilterChange('publisher', '');
              onFilterChange('year_min', '');
              onFilterChange('year_max', '');
            }}
            className="w-full py-2 text-sm text-primary-600 hover:text-primary-700
                     hover:bg-primary-50 rounded-lg transition-colors font-medium"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}

export default Filters;
