/**
 * Página de Listagem de Livros
 * Mostra todos os livros cadastrados com opções para visualizar, editar e excluir
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ListarLivros() {
  const navigate = useNavigate();
  const [livros, setLivros] = useState([]);
  const [livrosFiltrados, setLivrosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    editora: '',
    ano: '',
    categoria: '',
    descricao: '',
    isbn: '',
    capa_url: '',
    indice: ''
  });
  const [uploadMethod, setUploadMethod] = useState('file');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filtros, setFiltros] = useState({
    titulo: '',
    autor: '',
    editora: '',
    categoria: '',
    ano: '',
    indice: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    carregarLivros();
  }, []);

  useEffect(() => {
    // Aplicar filtros
    let resultado = livros;

    // Filtro de busca geral
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      resultado = resultado.filter(livro =>
        livro.title.toLowerCase().includes(query) ||
        livro.author.toLowerCase().includes(query) ||
        (livro.publisher && livro.publisher.toLowerCase().includes(query)) ||
        (livro.category && livro.category.toLowerCase().includes(query)) ||
        (livro.index_text && livro.index_text.toLowerCase().includes(query))
      );
    }

    if (filtros.titulo) {
      resultado = resultado.filter(livro =>
        livro.title.toLowerCase().includes(filtros.titulo.toLowerCase())
      );
    }

    if (filtros.autor) {
      resultado = resultado.filter(livro =>
        livro.author.toLowerCase().includes(filtros.autor.toLowerCase())
      );
    }

    if (filtros.editora) {
      resultado = resultado.filter(livro =>
        livro.publisher && livro.publisher.toLowerCase().includes(filtros.editora.toLowerCase())
      );
    }

    if (filtros.categoria) {
      resultado = resultado.filter(livro =>
        livro.category && livro.category.toLowerCase().includes(filtros.categoria.toLowerCase())
      );
    }

    if (filtros.ano) {
      resultado = resultado.filter(livro =>
        livro.publication_year && livro.publication_year.toString().includes(filtros.ano)
      );
    }

    if (filtros.indice) {
      resultado = resultado.filter(livro =>
        livro.index_text && livro.index_text.toLowerCase().includes(filtros.indice.toLowerCase())
      );
    }

    setLivrosFiltrados(resultado);
  }, [filtros, livros, searchQuery]);

  const carregarLivros = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/books?limit=1000`);
      const data = await response.json();

      if (data.success) {
        setLivros(data.data);
        setLivrosFiltrados(data.data);
      } else {
        setError('Erro ao carregar livros');
      }
    } catch (err) {
      console.error('Erro ao carregar livros:', err);
      setError('Erro ao carregar livros. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (livro) => {
    setEditingBook(livro.id);
    setFormData({
      titulo: livro.title || '',
      autor: livro.author || '',
      editora: livro.publisher || '',
      ano: livro.publication_year || '',
      categoria: livro.category || '',
      descricao: livro.description || '',
      isbn: livro.isbn || '',
      capa_url: livro.cover_url || '',
      indice: livro.index_text || ''
    });
    setSelectedFile(null);
    setUploadMethod('file');
    setMessage({ type: '', text: '' });
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
    setFormData({
      titulo: '',
      autor: '',
      editora: '',
      ano: '',
      categoria: '',
      descricao: '',
      isbn: '',
      capa_url: '',
      indice: ''
    });
    setSelectedFile(null);
    setUploadMethod('file');
    setMessage({ type: '', text: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setMessage({
          type: 'error',
          text: 'Por favor, selecione uma imagem válida (JPG ou PNG)'
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          type: 'error',
          text: 'A imagem deve ter no máximo 5MB'
        });
        return;
      }

      setSelectedFile(file);
      setMessage({ type: '', text: '' });
    }
  };

  const uploadImage = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload/cover`, {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da imagem');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Erro no upload:', error);
      throw error;
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      let capaUrl = formData.capa_url;

      // Se escolheu upload de arquivo, fazer upload primeiro
      if (uploadMethod === 'file' && selectedFile) {
        capaUrl = await uploadImage(selectedFile);
      }

      const dadosAtualizados = {
        ...formData,
        capa_url: capaUrl
      };

      const response = await fetch(`${API_BASE_URL}/books/${editingBook}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosAtualizados),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: 'success',
          text: 'Livro atualizado com sucesso!'
        });
        await carregarLivros();
        handleCancelEdit();

        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Erro ao atualizar livro'
        });
      }
    } catch (err) {
      console.error('Erro ao atualizar livro:', err);
      setMessage({
        type: 'error',
        text: 'Erro ao atualizar livro. Tente novamente.'
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: 'success',
          text: 'Livro deletado com sucesso!'
        });
        await carregarLivros();
        setShowDeleteConfirm(null);

        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Erro ao deletar livro'
        });
      }
    } catch (err) {
      console.error('Erro ao deletar livro:', err);
      setMessage({
        type: 'error',
        text: 'Erro ao deletar livro. Tente novamente.'
      });
    }
  };

  const handleView = (id) => {
    navigate(`/livro/${id}`, { state: { from: '/listar' } });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando livros...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        /* Scroll customizado mais discreto */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho com botão Cadastrar */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Gerenciar Livros
          </h1>
          <button
            onClick={() => navigate('/cadastrar')}
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-sm"
          >
            Cadastrar Livro
          </button>
        </div>

        {/* Campo de busca grande */}
        <div className="mb-6">
          <div className="relative max-w-3xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Busque por título, autor, editora, categoria ou palavra-chave"
              className="w-full px-6 py-4 pr-14 text-lg rounded-xl border border-gray-300
                       focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200
                       transition-all duration-200 shadow-sm"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Contador de livros */}
        <p className="text-sm text-gray-600 mb-4">
          {searchQuery || filtros.titulo || filtros.autor || filtros.editora || filtros.categoria || filtros.ano || filtros.indice ? (
            <>Exibindo {livrosFiltrados.length} de {livros.length} livro{livros.length !== 1 ? 's' : ''}</>
          ) : (
            <>Total de {livrosFiltrados.length} livro{livrosFiltrados.length !== 1 ? 's' : ''} cadastrado{livrosFiltrados.length !== 1 ? 's' : ''}</>
          )}
        </p>

      {/* Mensagem de feedback */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

        {/* Lista de Livros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {livros.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Nenhum livro cadastrado ainda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
              <table className="w-full divide-y divide-gray-200 relative">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                    Livro
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                    Autor
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                    Editora
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                    Categoria
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                    Ano
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                    Índice
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                    Ações
                  </th>
                </tr>
                {/* Linha de Filtros */}
                <tr className="bg-gray-100 sticky top-[52px] z-10">
                  <th className="px-3 py-2 bg-gray-100">
                    <input
                      type="text"
                      name="titulo"
                      value={filtros.titulo}
                      onChange={handleFiltroChange}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </th>
                  <th className="px-3 py-2 bg-gray-100">
                    <input
                      type="text"
                      name="autor"
                      value={filtros.autor}
                      onChange={handleFiltroChange}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </th>
                  <th className="px-3 py-2 bg-gray-100">
                    <input
                      type="text"
                      name="editora"
                      value={filtros.editora}
                      onChange={handleFiltroChange}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </th>
                  <th className="px-3 py-2 bg-gray-100">
                    <input
                      type="text"
                      name="categoria"
                      value={filtros.categoria}
                      onChange={handleFiltroChange}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </th>
                  <th className="px-3 py-2 bg-gray-100">
                    <input
                      type="text"
                      name="ano"
                      value={filtros.ano}
                      onChange={handleFiltroChange}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </th>
                  <th className="px-3 py-2 bg-gray-100">
                    <input
                      type="text"
                      name="indice"
                      value={filtros.indice}
                      onChange={handleFiltroChange}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </th>
                  <th className="px-3 py-2 bg-gray-100"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {livrosFiltrados.map((livro) => (
                  editingBook === livro.id ? (
                    // Formulário de Edição
                    <tr key={livro.id} className="bg-blue-50">
                      <td colSpan="7" className="px-6 py-4">
                        <form onSubmit={handleSaveEdit} className="space-y-4">
                          {/* Botões de ação no topo */}
                          <div className="flex gap-2 justify-end pb-4 border-b border-gray-300">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                            >
                              Salvar Alterações
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Título <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Autor <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="autor"
                                value={formData.autor}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Editora <span className="text-gray-400 text-xs font-normal">(opcional)</span>
                              </label>
                              <input
                                type="text"
                                name="editora"
                                value={formData.editora}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ano <span className="text-gray-400 text-xs font-normal">(opcional)</span>
                              </label>
                              <input
                                type="number"
                                name="ano"
                                value={formData.ano}
                                onChange={handleChange}
                                min="1000"
                                max="2100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Categoria <span className="text-gray-400 text-xs font-normal">(opcional)</span>
                              </label>
                              <select
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleChange}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              >
                                <option value="">Selecione uma categoria</option>
                                <option value="Espiritualidade">Espiritualidade</option>
                                <option value="Teologia">Teologia</option>
                                <option value="Catequese">Catequese</option>
                                <option value="Liturgia">Liturgia</option>
                                <option value="Mariologia">Mariologia</option>
                                <option value="Santos">Santos</option>
                                <option value="Bíblia">Bíblia</option>
                                <option value="História da Igreja">História da Igreja</option>
                                <option value="Doutrina Social">Doutrina Social</option>
                                <option value="Filosofia">Filosofia</option>
                                <option value="Outros">Outros</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ISBN <span className="text-gray-400 text-xs font-normal">(opcional)</span>
                              </label>
                              <input
                                type="text"
                                name="isbn"
                                value={formData.isbn}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>

                            {/* Capa do Livro */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                Capa do Livro <span className="text-gray-400 text-xs font-normal">(opcional)</span>
                              </label>

                              {/* Mostrar imagem atual se existir */}
                              {formData.capa_url && (
                                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                  <p className="text-sm font-medium text-gray-700 mb-2">Imagem atual:</p>
                                  <div className="flex items-start gap-4">
                                    <img
                                      src={formData.capa_url}
                                      alt="Capa atual"
                                      className="h-32 w-24 object-cover rounded border border-gray-300"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                    <div className="flex-1">
                                      <a
                                        href={formData.capa_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 mb-2"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Ver imagem em tamanho real
                                      </a>
                                      <p className="text-xs text-gray-500">
                                        Para alterar a imagem, selecione uma nova abaixo
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Opções de método */}
                              <div className="flex gap-4 mb-4">
                                <label className="flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name="uploadMethod"
                                    value="file"
                                    checked={uploadMethod === 'file'}
                                    onChange={(e) => setUploadMethod(e.target.value)}
                                    className="mr-2"
                                  />
                                  <span className="text-sm text-gray-700">Enviar arquivo</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name="uploadMethod"
                                    value="url"
                                    checked={uploadMethod === 'url'}
                                    onChange={(e) => setUploadMethod(e.target.value)}
                                    className="mr-2"
                                  />
                                  <span className="text-sm text-gray-700">URL da imagem</span>
                                </label>
                              </div>

                              {/* Campo de URL */}
                              {uploadMethod === 'url' && (
                                <input
                                  type="url"
                                  name="capa_url"
                                  value={formData.capa_url}
                                  onChange={handleChange}
                                  placeholder="https://exemplo.com/imagem.jpg"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                              )}

                              {/* Campo de Upload */}
                              {uploadMethod === 'file' && (
                                <div>
                                  <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={handleFileChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                  />
                                  <p className="mt-1 text-sm text-gray-500">
                                    JPG ou PNG. Máximo 5MB
                                  </p>
                                  {selectedFile && (
                                    <p className="mt-2 text-sm text-green-600">
                                      ✓ Arquivo selecionado: {selectedFile.name}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descrição <span className="text-gray-400 text-xs font-normal">(opcional)</span>
                              </label>
                              <textarea
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Índice <span className="text-gray-400 text-xs font-normal">(opcional)</span>
                              </label>
                              <textarea
                                name="indice"
                                value={formData.indice}
                                onChange={handleChange}
                                rows="5"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                          </div>
                        </form>
                      </td>
                    </tr>
                  ) : (
                    // Linha Normal
                    <tr key={livro.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4">
                        <div className="flex items-center">
                          {livro.cover_url && (
                            <img
                              src={livro.cover_url}
                              alt={livro.title}
                              className="h-16 w-12 object-cover rounded mr-3"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                          <div className="text-sm font-medium text-gray-900">
                            {livro.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-900">
                        {livro.author}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {livro.publisher || '-'}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {livro.category || '-'}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {livro.publication_year || '-'}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {livro.index_text ? (
                          <span title={livro.index_text}>
                            {livro.index_text.length > 30 ? livro.index_text.substring(0, 30) + '...' : livro.index_text}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-3 py-4 text-right text-sm font-medium">
                        {showDeleteConfirm === livro.id ? (
                          <div className="flex gap-2 justify-end items-center">
                            <span className="text-gray-700 text-sm mr-2">Confirmar exclusão?</span>
                            <button
                              onClick={() => handleDelete(livro.id)}
                              className="text-red-600 hover:text-red-900 font-medium"
                            >
                              Sim
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="text-gray-600 hover:text-gray-900 font-medium"
                            >
                              Não
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2 justify-end items-center">
                            <button
                              onClick={() => handleView(livro.id)}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Visualizar"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleEdit(livro)}
                              className="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(livro.id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListarLivros;
