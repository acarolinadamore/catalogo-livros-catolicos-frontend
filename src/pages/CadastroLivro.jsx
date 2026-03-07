/**
 * Página de Cadastro de Livro
 * Formulário para adicionar novos livros ao catálogo
 * Acessível apenas via link direto (não aparece no menu)
 */

import { useState } from "react"

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
  })

  const [uploadMethod, setUploadMethod] = useState("file") // 'url' ou 'file'
  const [selectedFile, setSelectedFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" })
  const [uploadProgress, setUploadProgress] = useState(0)

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
      setSubmitMessage({ type: "", text: "" })
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
      })
      setSelectedFile(null)
      setUploadProgress(0)
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
              <label
                htmlFor="categoria"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Categoria{" "}
                <span className="text-gray-400 text-xs font-normal">
                  (opcional)
                </span>
              </label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-10 rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
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
                  <p className="mt-2 text-sm text-green-600">
                    ✓ Arquivo selecionado: {selectedFile.name}
                  </p>
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
              })
              setSelectedFile(null)
              setSubmitMessage({ type: "", text: "" })
              setUploadProgress(0)
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
    </div>
  )
}

export default CadastroLivro
