/**
 * Página de Listagem de Livros
 * Mostra todos os livros cadastrados com opções para visualizar, editar e excluir
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash2, X, Check, Settings, Plus, Search, ExternalLink, ChevronDown } from 'lucide-react';

function ListarLivros() {
  const navigate = useNavigate();
  const tagsDropdownRef = useRef(null);
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
    indice: '',
    tags: ''
  });
  const [uploadMethod, setUploadMethod] = useState('file');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [tagsList, setTagsList] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filtros, setFiltros] = useState({
    titulo: '',
    autor: '',
    editora: '',
    categoria: '',
    ano: '',
    indice: '',
    tags: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showIndiceModal, setShowIndiceModal] = useState(false);
  const [indiceModalContent, setIndiceModalContent] = useState({ titulo: '', indice: '' });
  const [categorias, setCategorias] = useState([
    'Espiritualidade',
    'Teologia',
    'Catequese',
    'Liturgia',
    'Mariologia',
    'Santos',
    'Bíblia',
    'História da Igreja',
    'Doutrina Social',
    'Filosofia',
    'Outros'
  ]);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState('');
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalContent, setImageModalContent] = useState({ titulo: '', imageUrl: '' });

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
        (livro.index_text && livro.index_text.toLowerCase().includes(query)) ||
        (livro.tags && livro.tags.toLowerCase().includes(query))
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

    if (filtros.tags) {
      resultado = resultado.filter(livro =>
        livro.tags && livro.tags.toLowerCase().includes(filtros.tags.toLowerCase())
      );
    }

    setLivrosFiltrados(resultado);
  }, [filtros, livros, searchQuery]);

  // Extrair todas as tags únicas dos livros
  const todasTags = useMemo(() => {
    const tagsSet = new Set();
    livros.forEach(livro => {
      if (livro.tags) {
        livro.tags.split(',').forEach(tag => {
          const trimmedTag = tag.trim();
          if (trimmedTag) {
            tagsSet.add(trimmedTag);
          }
        });
      }
    });
    return Array.from(tagsSet).sort();
  }, [livros]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagsDropdownRef.current && !tagsDropdownRef.current.contains(event.target)) {
        setShowTagsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    console.log('Editando livro:', livro);
    console.log('Cover URL:', livro.cover_url);

    setEditingBook(livro.id);

    const capaUrl = livro.cover_url || '';

    setFormData({
      titulo: livro.title || '',
      autor: livro.author || '',
      editora: livro.publisher || '',
      ano: livro.publication_year || '',
      categoria: livro.category || '',
      descricao: livro.description || '',
      isbn: livro.isbn || '',
      capa_url: capaUrl,
      indice: livro.index_text || '',
      tags: livro.tags || ''
    });

    // Converter tags string para array
    if (livro.tags) {
      const tagsArray = livro.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      setTagsList(tagsArray);
    } else {
      setTagsList([]);
    }

    setTagInput('');
    setSelectedFile(null);
    setPreviewUrl(null);

    // Se tem capa, sempre mostrar no modo URL
    setUploadMethod(capaUrl ? 'url' : 'file');

    setMessage({ type: '', text: '' });

    console.log('FormData após edição:', {
      ...formData,
      capa_url: capaUrl
    });
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
      indice: '',
      tags: ''
    });
    setTagsList([]);
    setTagInput('');
    setSelectedFile(null);
    setPreviewUrl(null);
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

      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

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

  const handleAddCategoria = () => {
    if (novaCategoria.trim() && !categorias.includes(novaCategoria.trim())) {
      setCategorias([...categorias, novaCategoria.trim()].sort());
      setNovaCategoria('');
    }
  };

  const handleRemoveCategoria = async (categoria) => {
    const livrosComCategoria = livros.filter(livro => livro.categoria === categoria);
    const mensagem = livrosComCategoria.length > 0
      ? `Deseja realmente remover a categoria "${categoria}"?\n\n${livrosComCategoria.length} livro(s) com esta categoria terão a categoria removida.`
      : `Deseja realmente remover a categoria "${categoria}"?`;

    if (confirm(mensagem)) {
      // Remove a categoria da lista
      setCategorias(categorias.filter(cat => cat !== categoria));

      // Atualiza os livros que têm essa categoria, removendo-a
      if (livrosComCategoria.length > 0) {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

        try {
          // Atualiza cada livro removendo a categoria
          await Promise.all(
            livrosComCategoria.map(livro =>
              fetch(`${API_BASE_URL}/books/${livro.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...livro, categoria: '' })
              })
            )
          );

          // Recarrega a lista de livros
          await loadBooks();
          setMessage({ type: 'success', text: `Categoria "${categoria}" removida com sucesso!` });
        } catch (error) {
          console.error('Erro ao atualizar livros:', error);
          setMessage({ type: 'error', text: 'Erro ao atualizar livros após remover categoria' });
        }
      }
    }
  };

  const handleStartEditCategoria = (categoria) => {
    setEditingCategory(categoria);
    setEditingCategoryValue(categoria);
  };

  const handleSaveEditCategoria = () => {
    if (editingCategoryValue.trim() && editingCategoryValue !== editingCategory) {
      const updatedCategorias = categorias.map(cat =>
        cat === editingCategory ? editingCategoryValue.trim() : cat
      ).sort();
      setCategorias(updatedCategorias);
    }
    setEditingCategory(null);
    setEditingCategoryValue('');
  };

  const handleCancelEditCategoria = () => {
    setEditingCategory(null);
    setEditingCategoryValue('');
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tagsList.includes(trimmedTag)) {
      const newTagsList = [...tagsList, trimmedTag];
      setTagsList(newTagsList);
      setFormData(prev => ({
        ...prev,
        tags: newTagsList.join(', ')
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTagsList = tagsList.filter(tag => tag !== tagToRemove);
    setTagsList(newTagsList);
    setFormData(prev => ({
      ...prev,
      tags: newTagsList.join(', ')
    }));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho com botão Cadastrar */}
        <div className="mb-10 flex justify-between items-center">
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Listar Livros
          </h1>
          <button
            onClick={() => navigate('/cadastrar')}
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-sm"
          >
            Cadastrar Livro
          </button>
        </div>

        {/* Contador de livros e Campo de busca */}
        <div className="mb-6">
          <div className="flex justify-end mb-2">
            <p className="text-sm font-medium text-gray-700">
              {searchQuery || filtros.titulo || filtros.autor || filtros.editora || filtros.categoria || filtros.ano || filtros.indice ? (
                <>Exibindo {livrosFiltrados.length} de {livros.length} livro{livros.length !== 1 ? 's' : ''}</>
              ) : (
                <>Total de {livrosFiltrados.length} livro{livrosFiltrados.length !== 1 ? 's' : ''} cadastrado{livrosFiltrados.length !== 1 ? 's' : ''}</>
              )}
            </p>
          </div>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Busque por título, autor, editora, categoria ou palavra-chave"
              className="w-full px-5 py-3 pr-12 text-base rounded-lg border border-gray-300
                       focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200
                       transition-all duration-200 shadow-sm placeholder:text-sm"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

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
            <div className="overflow-x-auto custom-scrollbar">
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
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 w-24">
                    Ano
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                    Índice
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0">
                    Tags
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 right-0 z-[120] shadow-[-2px_0_4px_rgba(0,0,0,0.05)]">
                    Ações
                  </th>
                </tr>
                {/* Linha de Filtros */}
                <tr className="bg-gray-100 sticky top-[52px] z-[100]">
                  <th className="px-3 py-2 bg-gray-100">
                    <input
                      type="text"
                      name="titulo"
                      value={filtros.titulo}
                      onChange={handleFiltroChange}
                      className="w-full px-2 py-1.5 text-sm font-normal border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </th>
                  <th className="px-3 py-2 bg-gray-100">
                    <input
                      type="text"
                      name="autor"
                      value={filtros.autor}
                      onChange={handleFiltroChange}
                      className="w-full px-2 py-1.5 text-sm font-normal border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </th>
                  <th className="px-3 py-2 bg-gray-100">
                    <input
                      type="text"
                      name="editora"
                      value={filtros.editora}
                      onChange={handleFiltroChange}
                      className="w-full px-2 py-1.5 text-sm font-normal border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </th>
                  <th className="px-3 py-2 bg-gray-100">
                    <input
                      type="text"
                      name="categoria"
                      value={filtros.categoria}
                      onChange={handleFiltroChange}
                      className="w-full px-2 py-1.5 text-sm font-normal border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </th>
                  <th className="px-3 py-2 bg-gray-100">
                    <input
                      type="text"
                      name="ano"
                      value={filtros.ano}
                      onChange={handleFiltroChange}
                      className="w-full px-2 py-1.5 text-sm font-normal border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </th>
                  <th className="px-3 py-2 bg-gray-100">
                    <input
                      type="text"
                      name="indice"
                      value={filtros.indice}
                      onChange={handleFiltroChange}
                      className="w-full px-2 py-1.5 text-sm font-normal border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </th>
                  <th className="px-3 py-2 bg-gray-100">
                    <div className="relative" ref={tagsDropdownRef}>
                      <div className="relative">
                        <input
                          type="text"
                          value={filtros.tags}
                          onChange={(e) => {
                            setFiltros(prev => ({ ...prev, tags: e.target.value }));
                            setTagSearchQuery(e.target.value);
                            setShowTagsDropdown(true);
                          }}
                          onFocus={() => setShowTagsDropdown(true)}
                          placeholder="Buscar tag..."
                          className="w-full px-2 py-1.5 pr-16 text-sm font-normal border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                          {filtros.tags && (
                            <button
                              type="button"
                              onClick={() => {
                                setFiltros(prev => ({ ...prev, tags: '' }));
                                setShowTagsDropdown(false);
                              }}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                              title="Limpar filtro"
                            >
                              <X className="h-4 w-4 text-gray-500" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setShowTagsDropdown(!showTagsDropdown)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      </div>

                      {showTagsDropdown && todasTags.length > 0 && (
                        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                          {filtros.tags && (
                            <button
                              type="button"
                              onClick={() => {
                                setFiltros(prev => ({ ...prev, tags: '' }));
                                setShowTagsDropdown(false);
                              }}
                              className="w-full px-3 py-2 text-left text-sm bg-gray-50 hover:bg-gray-100 font-medium text-gray-700 border-b border-gray-200"
                            >
                              ✕ Limpar filtro
                            </button>
                          )}
                          {todasTags
                            .filter(tag =>
                              tag.toLowerCase().includes(filtros.tags.toLowerCase())
                            )
                            .map((tag, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => {
                                  setFiltros(prev => ({ ...prev, tags: tag }));
                                  setShowTagsDropdown(false);
                                }}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-primary-50 hover:text-primary-700 transition-colors"
                              >
                                {tag}
                              </button>
                            ))}
                          {todasTags.filter(tag =>
                            tag.toLowerCase().includes(filtros.tags.toLowerCase())
                          ).length === 0 && (
                            <div className="px-3 py-2 text-sm text-gray-500 text-center">
                              Nenhuma tag encontrada
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                  <th className="px-3 py-2 bg-gray-100 sticky right-0 z-[110] shadow-[-2px_0_4px_rgba(0,0,0,0.05)]"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {livrosFiltrados.map((livro) => (
                  editingBook === livro.id ? (
                    // Formulário de Edição
                    <tr key={livro.id} className="bg-blue-50">
                      <td colSpan="8" className="px-6 py-4">
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
                              <div className="flex gap-2">
                                <select
                                  name="categoria"
                                  value={formData.categoria}
                                  onChange={handleChange}
                                  className="flex-1 px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                                  style={{ backgroundPosition: 'right 0.75rem center' }}
                                >
                                  <option value="">Selecione uma categoria</option>
                                  {categorias.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => setShowCategoryModal(true)}
                                  className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
                                  title="Gerenciar categorias"
                                >
                                  <Settings className="h-5 w-5" />
                                </button>
                              </div>
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

                              {/* Debug info */}
                              {console.log('Renderizando capa - formData.capa_url:', formData.capa_url)}

                              {/* Mostrar imagem atual se existir */}
                              {formData.capa_url && formData.capa_url.trim() !== '' && (
                                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                  <p className="text-sm font-medium text-gray-700 mb-2">
                                    ✅ Imagem atual cadastrada
                                  </p>
                                  <div className="flex items-start gap-4">
                                    <div className="relative">
                                      <img
                                        src={formData.capa_url}
                                        alt="Capa atual"
                                        className="h-32 w-24 object-cover rounded border border-gray-300 shadow-sm"
                                        onError={(e) => {
                                          console.error('Erro ao carregar imagem:', formData.capa_url);
                                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="128" viewBox="0 0 96 128"%3E%3Crect fill="%23f3f4f6" width="96" height="128"/%3E%3Ctext x="50%25" y="50%25" fill="%239ca3af" font-size="12" text-anchor="middle" dy=".3em"%3ESem imagem%3C/text%3E%3C/svg%3E';
                                        }}
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <a
                                        href={formData.capa_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 mb-2 underline"
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                        Ver imagem em tamanho real
                                      </a>
                                      <p className="text-xs text-gray-500 break-all mb-2">
                                        URL: {formData.capa_url.substring(0, 60)}{formData.capa_url.length > 60 ? '...' : ''}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Para alterar a imagem, selecione uma nova abaixo
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Se não tem capa */}
                              {(!formData.capa_url || formData.capa_url.trim() === '') && (
                                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                  <p className="text-sm text-yellow-800">
                                    ⚠️ Este livro não possui capa cadastrada
                                  </p>
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
                                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                      <p className="text-sm font-medium text-green-800 mb-3">
                                        ✓ Arquivo selecionado: {selectedFile.name}
                                      </p>
                                      {previewUrl && (
                                        <div className="flex items-start gap-4">
                                          <div className="relative">
                                            <img
                                              src={previewUrl}
                                              alt="Preview da nova capa"
                                              className="h-32 w-24 object-cover rounded border border-green-300 shadow-sm"
                                            />
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-sm text-green-700 font-medium mb-1">
                                              Preview da nova imagem
                                            </p>
                                            <p className="text-xs text-green-600">
                                              Esta imagem será enviada ao salvar as alterações
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
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
                                rows="15"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>

                            {/* Tags */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tags <span className="text-gray-400 text-xs font-normal">(opcional)</span>
                              </label>
                              <p className="text-xs text-gray-500 mb-2">
                                Tags são palavras-chave personalizadas para ajudar você a organizar e encontrar seus livros.
                              </p>

                              {/* Chips das tags existentes */}
                              {tagsList.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {tagsList.map((tag, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-sm font-medium border"
                                      style={{ color: '#5A89B4', borderColor: '#5A89B4' }}
                                    >
                                      {tag}
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="hover:opacity-80 transition-opacity"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Input para adicionar nova tag */}
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={tagInput}
                                  onChange={(e) => setTagInput(e.target.value)}
                                  onKeyPress={handleTagInputKeyPress}
                                  placeholder="ex: leitura espiritual"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                                <button
                                  type="button"
                                  onClick={handleAddTag}
                                  className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1"
                                >
                                  <Plus className="h-4 w-4" />
                                  Adicionar
                                </button>
                              </div>
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
                              className="h-16 w-12 object-cover rounded mr-3 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => {
                                setImageModalContent({ titulo: livro.title, imageUrl: livro.cover_url });
                                setShowImageModal(true);
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                              title="Clique para ampliar"
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
                          <button
                            onClick={() => {
                              setIndiceModalContent({ titulo: livro.title, indice: livro.index_text });
                              setShowIndiceModal(true);
                            }}
                            className="text-left cursor-pointer"
                            title="Clique para ver o índice completo"
                          >
                            {livro.index_text.length > 30 ? livro.index_text.substring(0, 30) + '...' : livro.index_text}
                          </button>
                        ) : '-'}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {livro.tags ? (
                          <div className="flex flex-wrap gap-1">
                            {livro.tags.split(',').map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 bg-blue-50 rounded-full text-xs font-medium"
                                style={{ color: '#5A89B4' }}
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-3 py-4 text-center text-sm font-medium bg-white sticky right-0 z-10 shadow-[-2px_0_4px_rgba(0,0,0,0.05)]">
                        {showDeleteConfirm === livro.id ? (
                          <div className="flex gap-2 justify-center items-center">
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
                          <div className="flex gap-2 justify-center items-center">
                            <button
                              onClick={() => handleView(livro.id)}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Visualizar"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleEdit(livro)}
                              className="p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(livro.id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="h-5 w-5" />
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

        {/* Modal de Gerenciamento de Categorias */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Gerenciar Categorias</h2>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* Adicionar nova categoria */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adicionar Nova Categoria
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={novaCategoria}
                      onChange={(e) => setNovaCategoria(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCategoria()}
                      placeholder="Nome da categoria"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      onClick={handleAddCategoria}
                      className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar
                    </button>
                  </div>
                </div>

                {/* Lista de categorias */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Categorias Existentes ({categorias.length})
                  </label>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {categorias.map((categoria) => (
                      <div
                        key={categoria}
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {editingCategory === categoria ? (
                          // Modo de edição
                          <>
                            <input
                              type="text"
                              value={editingCategoryValue}
                              onChange={(e) => setEditingCategoryValue(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSaveEditCategoria()}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              autoFocus
                            />
                            <button
                              onClick={handleSaveEditCategoria}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 p-1.5 rounded transition-colors"
                              title="Salvar"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleCancelEditCategoria}
                              className="text-gray-600 hover:text-gray-700 hover:bg-gray-200 p-1.5 rounded transition-colors"
                              title="Cancelar"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          // Modo de visualização
                          <>
                            <span className="flex-1 text-sm text-gray-900">{categoria}</span>
                            <button
                              onClick={() => handleStartEditCategoria(categoria)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded transition-colors"
                              title="Editar categoria"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveCategoria(categoria)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                              title="Remover categoria"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Índice */}
        {showIndiceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Índice - {indiceModalContent.titulo}</h2>
                <button
                  onClick={() => setShowIndiceModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {indiceModalContent.indice}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                <button
                  onClick={() => setShowIndiceModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Imagem Ampliada */}
        {showImageModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImageModal(false)}
          >
            <div
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-white rounded-t-lg px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">{imageModalContent.titulo}</h2>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Body - Imagem */}
              <div className="bg-white rounded-b-lg p-6">
                <div className="flex justify-center">
                  <img
                    src={imageModalContent.imageUrl}
                    alt={imageModalContent.titulo}
                    className="max-h-[70vh] w-auto object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"%3E%3Crect fill="%23f3f4f6" width="400" height="600"/%3E%3Ctext x="50%25" y="50%25" fill="%239ca3af" font-size="20" text-anchor="middle" dy=".3em"%3EImagem não disponível%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <div className="mt-4 text-center">
                  <a
                    href={imageModalContent.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Abrir imagem em nova aba
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListarLivros;
