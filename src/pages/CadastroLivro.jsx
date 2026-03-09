/**
 * Página de Cadastro de Livro
 * Formulário para adicionar novos livros ao catálogo
 * Acessível apenas via link direto (não aparece no menu)
 */

import { useState } from "react"
import { Link } from "react-router-dom"
import { Settings, Plus, Edit2, Trash2, X, Check } from "lucide-react"

function CadastroLivro() {
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    editora: "",
    ano: "",
    categoria: "",
    descricao: "",
    isbn: "",
    capa_url: "",
    indice: "",
    tags: "",
  })

  const [uploadMethod, setUploadMethod] = useState("file") // 'url' ou 'file'
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" })
  const [uploadProgress, setUploadProgress] = useState(0)

  // Estados para gerenciamento de categorias
  const [categorias, setCategorias] = useState([
    "Espiritualidade",
    "Teologia",
    "Catequese",
    "Liturgia",
    "Mariologia",
    "Santos",
    "Bíblia",
    "História da Igreja",
    "Doutrina Social",
    "Filosofia",
    "Outros"
  ])
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [novaCategoria, setNovaCategoria] = useState("")
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingCategoryValue, setEditingCategoryValue] = useState("")

  // Estados para gerenciamento de tags
  const [tagsList, setTagsList] = useState([])
  const [tagInput, setTagInput] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tipo de arquivo
      const validTypes = ["image/jpeg", "image/jpg", "image/png"]
      if (!validTypes.includes(file.type)) {
        setSubmitMessage({
          type: "error",
          text: "Por favor, selecione uma imagem válida (JPG ou PNG)",
        })
        return
      }

      // Validar tamanho (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitMessage({
          type: "error",
          text: "A imagem deve ter no máximo 5MB",
        })
        return
      }

      setSelectedFile(file)

      // Criar preview da imagem
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)

      setSubmitMessage({ type: "", text: "" })
    }
  }

  // Funções de gerenciamento de categorias
  const handleAddCategoria = () => {
    if (novaCategoria.trim() && !categorias.includes(novaCategoria.trim())) {
      setCategorias([...categorias, novaCategoria.trim()].sort())
      setNovaCategoria("")
    }
  }

  const handleRemoveCategoria = async (categoria) => {
    const mensagem = `Deseja realmente remover a categoria "${categoria}"?\n\nTodos os livros com esta categoria terão a categoria removida.`;

    if (confirm(mensagem)) {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

      try {
        // Chama a API para limpar a categoria de todos os livros
        await fetch(`${API_BASE_URL}/books/clear-category`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: categoria })
        });

        // Remove a categoria da lista local
        setCategorias(categorias.filter(cat => cat !== categoria));

        setSubmitMessage({
          type: 'success',
          text: `Categoria "${categoria}" removida com sucesso!`
        });

        // Limpa a mensagem após 3 segundos
        setTimeout(() => setSubmitMessage({ type: '', text: '' }), 3000);
      } catch (error) {
        console.error('Erro ao remover categoria:', error);
        setSubmitMessage({
          type: 'error',
          text: 'Erro ao remover categoria. Tente novamente.'
        });
      }
    }
  }

  const handleStartEditCategoria = (categoria) => {
    setEditingCategory(categoria)
    setEditingCategoryValue(categoria)
  }

  const handleSaveEditCategoria = () => {
    if (editingCategoryValue.trim() && editingCategoryValue !== editingCategory) {
      const updatedCategorias = categorias.map(cat =>
        cat === editingCategory ? editingCategoryValue.trim() : cat
      ).sort()
      setCategorias(updatedCategorias)
    }
    setEditingCategory(null)
    setEditingCategoryValue("")
  }

  const handleCancelEditCategoria = () => {
    setEditingCategory(null)
    setEditingCategoryValue("")
  }

  // Funções de gerenciamento de tags
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tagsList.includes(trimmedTag)) {
      const newTagsList = [...tagsList, trimmedTag]
      setTagsList(newTagsList)
      setFormData(prev => ({
        ...prev,
        tags: newTagsList.join(', ')
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    const newTagsList = tagsList.filter(tag => tag !== tagToRemove)
    setTagsList(newTagsList)
    setFormData(prev => ({
      ...prev,
      tags: newTagsList.join(', ')
    }))
  }

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const uploadImage = async (file) => {
    const API_BASE_URL =
      import.meta.env.VITE_API_URL || "http://localhost:3000/api"

    const formData = new FormData()
    formData.append("image", file)

    try {
      console.log("Enviando imagem para:", `${API_BASE_URL}/upload/cover`)

      const response = await fetch(`${API_BASE_URL}/upload/cover`, {
        method: "POST",
        body: formData,
      })

      console.log("Resposta do servidor:", response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Erro detalhado:", errorData)
        throw new Error(errorData.details || errorData.error || "Erro ao fazer upload da imagem")
      }

      const data = await response.json()
      console.log("Upload bem-sucedido:", data)
      return data.url
    } catch (error) {
      console.error("Erro no upload:", error)
      console.error("API_BASE_URL configurada:", API_BASE_URL)
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage({ type: "", text: "" })
    setUploadProgress(0)

    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3000/api"

      let capaUrl = formData.capa_url

      // Se escolheu upload de arquivo, fazer upload primeiro
      if (uploadMethod === "file" && selectedFile) {
        setUploadProgress(50)
        capaUrl = await uploadImage(selectedFile)
        setUploadProgress(75)
      }

      const dadosLivro = {
        ...formData,
        capa_url: capaUrl,
      }

      const response = await fetch(`${API_BASE_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosLivro),
      })

      if (!response.ok) {
        throw new Error("Erro ao cadastrar livro")
      }

      const data = await response.json()
      setUploadProgress(100)

      setSubmitMessage({
        type: "success",
        text: "Livro cadastrado com sucesso!",
      })

      // Limpar formulário
      setFormData({
        titulo: "",
        autor: "",
        editora: "",
        ano: "",
        categoria: "",
        descricao: "",
        isbn: "",
        capa_url: "",
        indice: "",
        tags: "",
      })
      setSelectedFile(null)
      setPreviewUrl(null)
      setUploadProgress(0)
      setTagsList([])
      setTagInput("")
    } catch (error) {
      console.error("Erro ao cadastrar livro:", error)
      setSubmitMessage({
        type: "error",
        text: "Erro ao cadastrar livro. Por favor, tente novamente.",
      })
      setUploadProgress(0)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link to="/listar" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          ← Voltar à lista
        </Link>
      </nav>

      {/* Cabeçalho */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Cadastrar Livro
        </h1>
      </div>

      {/* Mensagem de feedback */}
      {submitMessage.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            submitMessage.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {submitMessage.text}
        </div>
      )}

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <div className="space-y-6">
          {/* Título */}
          <div>
            <label
              htmlFor="titulo"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
            />
          </div>

          {/* Autor */}
          <div>
            <label
              htmlFor="autor"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Autor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="autor"
              name="autor"
              value={formData.autor}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
            />
          </div>

          {/* Editora e Ano - Grid 2 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="editora"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Editora{" "}
                <span className="text-gray-400 text-xs font-normal">
                  (opcional)
                </span>
              </label>
              <input
                type="text"
                id="editora"
                name="editora"
                value={formData.editora}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="ano"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ano de Publicação{" "}
                <span className="text-gray-400 text-xs font-normal">
                  (opcional)
                </span>
              </label>
              <input
                type="number"
                id="ano"
                name="ano"
                value={formData.ano}
                onChange={handleChange}
                min="1000"
                max="2100"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
              />
            </div>
          </div>

          {/* Categoria e ISBN - Grid 2 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="categoria"
                  className="block text-sm font-medium text-gray-700"
                >
                  Categoria{" "}
                  <span className="text-gray-400 text-xs font-normal">
                    (opcional)
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm font-medium transition-colors"
                  title="Gerenciar categorias"
                >
                  <Settings className="h-4 w-4" />
                  Gerenciar
                </button>
              </div>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-10 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="isbn"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                ISBN{" "}
                <span className="text-gray-400 text-xs font-normal">
                  (opcional)
                </span>
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
              />
            </div>
          </div>

          {/* Capa do Livro - Escolha entre URL ou Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Capa do Livro{" "}
              <span className="text-gray-400 text-xs font-normal">
                (opcional)
              </span>
            </label>

            {/* Opções de método */}
            <div className="flex gap-4 mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="uploadMethod"
                  value="file"
                  checked={uploadMethod === "file"}
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
                  checked={uploadMethod === "url"}
                  onChange={(e) => setUploadMethod(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">URL da imagem</span>
              </label>
            </div>

            {/* Campo de URL */}
            {uploadMethod === "url" && (
              <div>
                <input
                  type="url"
                  id="capa_url"
                  name="capa_url"
                  value={formData.capa_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Cole a URL completa da imagem da capa
                </p>
              </div>
            )}

            {/* Campo de Upload */}
            {uploadMethod === "file" && (
              <div>
                <input
                  type="file"
                  id="capa_file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
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
                            alt="Preview da capa"
                            className="h-32 w-24 object-cover rounded border border-green-300 shadow-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-green-700 font-medium mb-1">
                            Preview da imagem
                          </p>
                          <p className="text-xs text-green-600">
                            Esta imagem será enviada ao cadastrar o livro
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label
              htmlFor="descricao"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Descrição{" "}
              <span className="text-gray-400 text-xs font-normal">
                (opcional)
              </span>
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
            />
          </div>

          {/* Índice */}
          <div>
            <label
              htmlFor="indice"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Índice{" "}
              <span className="text-gray-400 text-xs font-normal">
                (opcional)
              </span>
            </label>
            <textarea
              id="indice"
              name="indice"
              value={formData.indice}
              onChange={handleChange}
              rows="8"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags{" "}
              <span className="text-gray-400 text-xs font-normal">
                (opcional)
              </span>
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

        {/* Barra de progresso */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Enviando... {uploadProgress}%
            </p>
          </div>
        )}

        {/* Botões de ação */}
        <div className="mt-8 flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => {
              setFormData({
                titulo: "",
                autor: "",
                editora: "",
                ano: "",
                categoria: "",
                descricao: "",
                isbn: "",
                capa_url: "",
                indice: "",
                tags: "",
              })
              setSelectedFile(null)
              setPreviewUrl(null)
              setSubmitMessage({ type: "", text: "" })
              setUploadProgress(0)
              setTagsList([])
              setTagInput("")
            }}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Limpar
          </button>
          <button
            type="submit"
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar Livro"}
          </button>
        </div>
      </form>

      {/* Nota informativa */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Os campos marcados com{" "}
          <span className="text-red-500">*</span> são obrigatórios.
        </p>
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
          </div>
        </div>
      )}
    </div>
  )
}

export default CadastroLivro
