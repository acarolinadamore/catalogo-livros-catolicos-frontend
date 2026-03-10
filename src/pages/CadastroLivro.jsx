/**
 * Página de Cadastro de Livro
 * Formulário para adicionar novos livros ao catálogo
 * Acessível apenas via link direto (não aparece no menu)
 */

import { useState } from "react"
import { Link } from "react-router-dom"
import { Settings, Plus, Edit2, Trash2, X, Check, Camera, Loader } from "lucide-react"

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

  // Estados para múltiplas fotos do livro
  const [bookPhotos, setBookPhotos] = useState([]) // Array de {file, preview, id}
  const [coverPhotoIndex, setCoverPhotoIndex] = useState(0) // Índice da foto selecionada como capa

  // Estados para fotos do índice
  const [indexPhotos, setIndexPhotos] = useState([]) // Array de {file, preview, id, order}
  const [isProcessingIndexOCR, setIsProcessingIndexOCR] = useState(false)
  const [indexOCRProgress, setIndexOCRProgress] = useState(0)

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

  // Estados para OCR (reconhecimento de texto da capa)
  const [isProcessingOCR, setIsProcessingOCR] = useState(false)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [ocrSuggestions, setOcrSuggestions] = useState(null)
  const [ocrError, setOcrError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Função para processar OCR na imagem usando Claude API
  const processImageOCR = async (imageFile) => {
    try {
      setIsProcessingOCR(true)
      setOcrProgress(20)
      setOcrError("")
      setOcrSuggestions(null)

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

      // Criar FormData para enviar a imagem
      const formData = new FormData()
      formData.append('image', imageFile)

      setOcrProgress(40)

      // Enviar para API do backend
      const response = await fetch(`${API_BASE_URL}/ocr/analyze-cover`, {
        method: 'POST',
        body: formData
      })

      setOcrProgress(80)

      // Verificar se a resposta é JSON válido
      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error('Erro ao parsear resposta:', jsonError)
        throw new Error('O servidor retornou uma resposta inválida')
      }

      if (!response.ok) {
        // Erros específicos por status HTTP
        if (response.status === 404) {
          throw new Error('⚠️ Funcionalidade de OCR ainda não está disponível. O servidor está atualizando, aguarde alguns minutos.')
        } else if (response.status === 500) {
          throw new Error(data.error || 'Erro no servidor ao processar a imagem')
        } else {
          throw new Error(data.error || 'Erro ao processar imagem')
        }
      }

      if (data.success && data.data) {
        console.log('Informações extraídas pela API:', data.data)

        // Verificar se encontrou pelo menos título ou autor
        if (data.data.titulo || data.data.autor) {
          setOcrSuggestions(data.data)
          setOcrProgress(100)
        } else {
          setOcrError("Não consegui identificar informações do livro na capa. Tente tirar uma foto mais nítida, com boa iluminação e sem reflexos.")
          setOcrProgress(0)
        }
      } else {
        setOcrError(data.error || "Não consegui identificar informações do livro na capa. Tente tirar uma foto mais nítida.")
        setOcrProgress(0)
      }

    } catch (error) {
      console.error('Erro ao processar OCR:', error)

      // Mensagens de erro específicas
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setOcrError("❌ Não foi possível conectar ao servidor. Verifique sua conexão com a internet.")
      } else if (error.message.includes('ainda não está disponível') || error.message.includes('atualizando')) {
        setOcrError(error.message)
      } else {
        setOcrError(error.message || "Erro ao analisar a imagem. Tente novamente.")
      }
      setOcrProgress(0)
    } finally {
      setIsProcessingOCR(false)
    }
  }

  // Função para aplicar sugestões do OCR
  const handleApplySuggestions = () => {
    if (ocrSuggestions) {
      setFormData((prev) => ({
        ...prev,
        titulo: ocrSuggestions.titulo || prev.titulo,
        autor: ocrSuggestions.autor || prev.autor,
        ano: ocrSuggestions.ano || prev.ano,
        editora: ocrSuggestions.editora || prev.editora,
      }))
      setOcrSuggestions(null)
      setSubmitMessage({
        type: "success",
        text: "Sugestões aplicadas! Você pode editar os campos se necessário."
      })
      setTimeout(() => setSubmitMessage({ type: "", text: "" }), 3000)
    }
  }

  // Função para ignorar sugestões do OCR
  const handleIgnoreSuggestions = () => {
    setOcrSuggestions(null)
  }

  // Função para tentar OCR novamente
  const handleRetryOCR = () => {
    if (selectedFile) {
      processImageOCR(selectedFile)
    }
  }

  const handleFileChange = async (e) => {
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

      // Iniciar OCR automaticamente
      processImageOCR(file)
    }
  }

  // Funções para múltiplas fotos do livro
  const handleMultiplePhotosChange = (e) => {
    const files = Array.from(e.target.files)

    const newPhotos = files.map((file, index) => {
      const reader = new FileReader()
      const photoId = Date.now() + index

      reader.onloadend = () => {
        setBookPhotos(prev => {
          const existingPhoto = prev.find(p => p.id === photoId)
          if (existingPhoto) {
            return prev.map(p => p.id === photoId ? {...p, preview: reader.result} : p)
          }
          return prev
        })
      }
      reader.readAsDataURL(file)

      return {
        file,
        preview: null,
        id: photoId
      }
    })

    setBookPhotos(prev => [...prev, ...newPhotos])

    // Se é a primeira foto, processar OCR automaticamente
    if (bookPhotos.length === 0 && newPhotos.length > 0) {
      processImageOCR(newPhotos[0].file)
    }
  }

  const handleRemoveBookPhoto = (photoId) => {
    setBookPhotos(prev => prev.filter(p => p.id !== photoId))
    // Se removeu a foto de capa, selecionar a primeira
    if (bookPhotos[coverPhotoIndex]?.id === photoId) {
      setCoverPhotoIndex(0)
    }
  }

  const handleSetCoverPhoto = (index) => {
    setCoverPhotoIndex(index)
    // Processar OCR da nova foto de capa
    if (bookPhotos[index]) {
      processImageOCR(bookPhotos[index].file)
    }
  }

  // Funções para fotos do índice
  const handleIndexPhotosChange = async (e) => {
    const files = Array.from(e.target.files)

    const newPhotos = files.map((file, index) => {
      const reader = new FileReader()
      const photoId = Date.now() + index

      reader.onloadend = () => {
        setIndexPhotos(prev => {
          const existingPhoto = prev.find(p => p.id === photoId)
          if (existingPhoto) {
            return prev.map(p => p.id === photoId ? {...p, preview: reader.result} : p)
          }
          return prev
        })
      }
      reader.readAsDataURL(file)

      return {
        file,
        preview: null,
        id: photoId,
        order: indexPhotos.length + index,
        text: ''
      }
    })

    setIndexPhotos(prev => [...prev, ...newPhotos])
  }

  const handleRemoveIndexPhoto = (photoId) => {
    setIndexPhotos(prev => prev.filter(p => p.id !== photoId))
  }

  const handleReorderIndexPhoto = (photoId, direction) => {
    setIndexPhotos(prev => {
      const index = prev.findIndex(p => p.id === photoId)
      if (index === -1) return prev

      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev

      const newArray = [...prev]
      const [removed] = newArray.splice(index, 1)
      newArray.splice(newIndex, 0, removed)

      return newArray.map((photo, i) => ({...photo, order: i}))
    })
  }

  // OCR para fotos do índice - TRANSCRIÇÃO LITERAL
  const processIndexOCR = async () => {
    if (indexPhotos.length === 0) return

    setIsProcessingIndexOCR(true)
    setIndexOCRProgress(0)

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

    try {
      const processedPhotos = []

      for (let i = 0; i < indexPhotos.length; i++) {
        const photo = indexPhotos[i]
        setIndexOCRProgress(Math.round(((i + 1) / indexPhotos.length) * 100))

        const formData = new FormData()
        formData.append('image', photo.file)

        // Usar endpoint de TRANSCRIÇÃO ao invés de análise
        const response = await fetch(`${API_BASE_URL}/ocr/transcribe-index`, {
          method: 'POST',
          body: formData
        })

        const data = await response.json()

        if (data.success && data.data && data.data.text) {
          // Texto transcrito literalmente
          processedPhotos.push({
            ...photo,
            text: data.data.text
          })
        } else {
          processedPhotos.push({
            ...photo,
            text: '[Texto não identificado]'
          })
        }
      }

      setIndexPhotos(processedPhotos)

      // Atualizar textarea do índice automaticamente
      // Juntar textos com linha em branco entre páginas para separação visual
      const fullIndexText = processedPhotos
        .sort((a, b) => a.order - b.order)
        .map(p => p.text)
        .join('\n\n')

      setFormData(prev => ({
        ...prev,
        indice: fullIndexText
      }))

    } catch (error) {
      console.error('Erro ao processar OCR do índice:', error)
    } finally {
      setIsProcessingIndexOCR(false)
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

      // Se há foto de capa selecionada, fazer upload
      if (bookPhotos.length > 0 && bookPhotos[coverPhotoIndex]) {
        setUploadProgress(50)
        capaUrl = await uploadImage(bookPhotos[coverPhotoIndex].file)
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

      // Rolar para o topo para mostrar a mensagem (com animação mais suave)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      // Adiciona um delay adicional para garantir animação suave
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)

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
      // Limpar estados de OCR
      setIsProcessingOCR(false)
      setOcrProgress(0)
      setOcrSuggestions(null)
      setOcrError("")
      // Limpar estados de múltiplas fotos
      setBookPhotos([])
      setCoverPhotoIndex(0)
      setIndexPhotos([])
      setIsProcessingIndexOCR(false)
      setIndexOCRProgress(0)
    } catch (error) {
      console.error("Erro ao cadastrar livro:", error)
      setSubmitMessage({
        type: "error",
        text: "Erro ao cadastrar livro. Por favor, tente novamente.",
      })
      // Rolar para o topo para mostrar a mensagem de erro
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8"
      >
        <div className="space-y-6">
          {/* Fotos do Livro - SEÇÃO PRINCIPAL NO TOPO */}
          <div className="border-2 border-primary-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Fotos do Livro{" "}
              <span className="text-gray-400 text-sm font-normal">(opcional)</span>
            </label>

            {/* Dicas para melhor OCR */}
            <div className="mb-4 p-3 bg-white rounded-lg border border-blue-200">
              <p className="text-xs font-medium text-blue-900 mb-1">
                Análise inteligente com Claude AI
              </p>
              <p className="text-xs text-blue-700 mb-2">
                A foto selecionada como capa será analisada automaticamente para extrair título, autor, editora e ano.
              </p>
              <p className="text-xs font-medium text-blue-800 mb-1">
                💡 Dicas para melhor resultado:
              </p>
              <ul className="text-xs text-blue-700 space-y-0.5 ml-4 list-disc">
                <li>Tire a foto com boa iluminação</li>
                <li>Centralize a capa do livro</li>
                <li>Evite reflexos e sombras</li>
                <li>Mantenha a câmera firme e focada</li>
              </ul>
            </div>

            {/* Botões de upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium rounded-lg border-2 border-primary-300 cursor-pointer transition-all duration-200 active:scale-95">
                <Camera className="h-5 w-5" />
                <span>Tirar Foto</span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  capture="environment"
                  multiple
                  onChange={handleMultiplePhotosChange}
                  className="hidden"
                />
              </label>

              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg border-2 border-blue-300 cursor-pointer transition-all duration-200 active:scale-95">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Escolher da Galeria</span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  multiple
                  onChange={handleMultiplePhotosChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Grid de fotos selecionadas */}
            {bookPhotos.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-sm font-medium text-gray-900 mb-3">
                  Fotos selecionadas ({bookPhotos.length})
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {bookPhotos.map((photo, index) => (
                    <div key={photo.id} className="relative group">
                      <div className={`relative border-4 rounded-lg overflow-hidden ${
                        coverPhotoIndex === index
                          ? 'border-green-500 shadow-lg'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}>
                        {photo.preview && (
                          <img
                            src={photo.preview}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                        )}
                        {!photo.preview && (
                          <div className="w-full h-32 bg-gray-100 animate-pulse flex items-center justify-center">
                            <Loader className="h-6 w-6 text-gray-400 animate-spin" />
                          </div>
                        )}

                        {/* Indicador de capa */}
                        {coverPhotoIndex === index && (
                          <div className="absolute top-1 left-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                            CAPA
                          </div>
                        )}

                        {/* Botão remover */}
                        <button
                          type="button"
                          onClick={() => handleRemoveBookPhoto(photo.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Botão selecionar como capa */}
                      <button
                        type="button"
                        onClick={() => handleSetCoverPhoto(index)}
                        className={`w-full mt-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
                          coverPhotoIndex === index
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-primary-100'
                        }`}
                      >
                        {coverPhotoIndex === index ? '✓ Capa selecionada' : 'Definir como capa'}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Loading do OCR */}
                {isProcessingOCR && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-300">
                    <div className="flex items-center gap-3 mb-2">
                      <Loader className="h-5 w-5 text-primary-600 animate-spin" />
                      <p className="text-sm font-medium text-gray-800">
                        Claude AI está analisando a capa...
                      </p>
                    </div>
                    {ocrProgress > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${ocrProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Sugestões do OCR */}
                {ocrSuggestions && !isProcessingOCR && (
                  <div className="mt-4 p-4 bg-white rounded-lg border-2 border-green-400">
                    <p className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
                      ✓ Sugestões detectadas na capa:
                    </p>
                    <div className="space-y-2 mb-4">
                      {ocrSuggestions.titulo && (
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Título:</span>
                          <span className="ml-2 text-gray-900">{ocrSuggestions.titulo}</span>
                        </div>
                      )}
                      {ocrSuggestions.autor && (
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Autor:</span>
                          <span className="ml-2 text-gray-900">{ocrSuggestions.autor}</span>
                        </div>
                      )}
                      {ocrSuggestions.editora && (
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Editora:</span>
                          <span className="ml-2 text-gray-900">{ocrSuggestions.editora}</span>
                        </div>
                      )}
                      {ocrSuggestions.ano && (
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Ano:</span>
                          <span className="ml-2 text-gray-900">{ocrSuggestions.ano}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleApplySuggestions}
                        className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                      >
                        <Check className="h-4 w-4" />
                        Usar sugestões
                      </button>
                      <button
                        type="button"
                        onClick={handleIgnoreSuggestions}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1"
                      >
                        <X className="h-4 w-4" />
                        Ignorar
                      </button>
                    </div>
                  </div>
                )}

                {/* Erro do OCR */}
                {ocrError && !isProcessingOCR && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-300">
                    <p className="text-sm text-yellow-800 mb-2">
                      {ocrError}
                    </p>
                    <button
                      type="button"
                      onClick={handleRetryOCR}
                      className="px-3 py-1.5 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Tentar novamente
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="min-w-0">
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

            <div className="min-w-0">
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

          {/* Categoria */}
          <div>
            <div className="flex items-center justify-between mb-2 gap-2">
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
                className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                title="Gerenciar categorias"
              >
                <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Gerenciar</span>
                <span className="xs:hidden">Editar</span>
              </button>
            </div>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 pr-8 sm:pr-10 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 text-sm sm:text-base bg-white appearance-none min-h-[42px]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>


          {/* Fotos do Índice - Upload múltiplo com OCR */}
          <div className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Fotos do Índice{" "}
              <span className="text-gray-400 text-sm font-normal">(opcional)</span>
            </label>
            <p className="text-sm text-gray-700 mb-4">
              Tire fotos das páginas do índice do livro. O texto será extraído automaticamente e adicionado ao campo abaixo.
            </p>

            {/* Botões de upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium rounded-lg border-2 border-purple-300 cursor-pointer transition-all duration-200 active:scale-95">
                <Camera className="h-5 w-5" />
                <span>Tirar Foto do Índice</span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  capture="environment"
                  multiple
                  onChange={handleIndexPhotosChange}
                  className="hidden"
                />
              </label>

              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-pink-50 hover:bg-pink-100 text-pink-700 font-medium rounded-lg border-2 border-pink-300 cursor-pointer transition-all duration-200 active:scale-95">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Escolher da Galeria</span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  multiple
                  onChange={handleIndexPhotosChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Grid de fotos do índice */}
            {indexPhotos.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-900">
                    Páginas do índice ({indexPhotos.length})
                  </p>
                  <button
                    type="button"
                    onClick={processIndexOCR}
                    disabled={isProcessingIndexOCR}
                    className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isProcessingIndexOCR ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        Extrair Texto
                      </>
                    )}
                  </button>
                </div>

                {/* Barra de progresso do OCR */}
                {isProcessingIndexOCR && (
                  <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-300">
                    <p className="text-sm font-medium text-purple-900 mb-2">
                      Processando {indexOCRProgress}%
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${indexOCRProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {indexPhotos.map((photo, index) => (
                    <div key={photo.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      {/* Preview da imagem */}
                      <div className="flex-shrink-0">
                        {photo.preview ? (
                          <img
                            src={photo.preview}
                            alt={`Índice ${index + 1}`}
                            className="w-20 h-20 object-cover rounded border-2 border-gray-300"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 animate-pulse rounded border-2 border-gray-300 flex items-center justify-center">
                            <Loader className="h-5 w-5 text-gray-400 animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Informações e controles */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            Página {index + 1}
                          </span>
                          {photo.text && (
                            <span className="text-xs text-green-600 font-medium">
                              ✓ Texto extraído
                            </span>
                          )}
                        </div>
                        {photo.text && (
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {photo.text}
                          </p>
                        )}
                      </div>

                      {/* Botões de controle */}
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => handleReorderIndexPhoto(photo.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Mover para cima"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReorderIndexPhoto(photo.id, 'down')}
                          disabled={index === indexPhotos.length - 1}
                          className="p-1 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Mover para baixo"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveIndexPhoto(photo.id)}
                          className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Remover"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-600 mt-3">
                  💡 Dica: Use as setas para ordenar as páginas antes de extrair o texto
                </p>
              </div>
            )}
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
            <div className="flex flex-col sm:flex-row gap-2">
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
                className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-1 w-full sm:w-auto"
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
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
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
              // Limpar estados de OCR
              setIsProcessingOCR(false)
              setOcrProgress(0)
              setOcrSuggestions(null)
              setOcrError("")
              // Limpar estados de múltiplas fotos
              setBookPhotos([])
              setCoverPhotoIndex(0)
              setIndexPhotos([])
              setIsProcessingIndexOCR(false)
              setIndexOCRProgress(0)
            }}
            className="btn-secondary w-full sm:w-auto"
            disabled={isSubmitting}
          >
            Limpar
          </button>
          <button
            type="submit"
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
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
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Gerenciar Categorias</h2>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6">
              {/* Adicionar nova categoria */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adicionar Nova Categoria
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
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
                    className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-1 w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Adicionar</span>
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
