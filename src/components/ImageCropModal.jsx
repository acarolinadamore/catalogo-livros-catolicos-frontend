import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Check, X, RotateCw } from 'lucide-react'

/**
 * Modal de recorte de imagem
 * Permite recortar, rotacionar e ajustar a imagem antes de salvar
 */
function ImageCropModal({ image, onSave, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createCroppedImage = async () => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      const imageObj = new Image()
      imageObj.src = image

      await new Promise((resolve, reject) => {
        imageObj.onload = resolve
        imageObj.onerror = reject
      })

      // Calcular dimensões do canvas com rotação
      const radians = (rotation * Math.PI) / 180
      const sin = Math.abs(Math.sin(radians))
      const cos = Math.abs(Math.cos(radians))

      const rotatedWidth = imageObj.width * cos + imageObj.height * sin
      const rotatedHeight = imageObj.width * sin + imageObj.height * cos

      // Configurar canvas para a área recortada
      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height

      // Salvar contexto
      ctx.save()

      // Aplicar rotação se necessário
      if (rotation !== 0) {
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(radians)
        ctx.translate(-canvas.width / 2, -canvas.height / 2)
      }

      // Desenhar imagem recortada
      ctx.drawImage(
        imageObj,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      )

      // Restaurar contexto
      ctx.restore()

      // Converter canvas para blob
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob)
        }, 'image/jpeg', 0.95)
      })
    } catch (error) {
      console.error('Erro ao recortar imagem:', error)
      return null
    }
  }

  const handleSave = async () => {
    const croppedBlob = await createCroppedImage()
    if (croppedBlob) {
      onSave(croppedBlob)
    }
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleReset = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Ajustar Foto</h2>
        <button
          onClick={onCancel}
          className="text-gray-300 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Área de recorte */}
      <div className="flex-1 relative">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={3 / 4} // Proporção comum de capas de livros
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
        />
      </div>

      {/* Controles */}
      <div className="bg-gray-900 text-white px-4 py-4 space-y-4">
        {/* Zoom */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Zoom: {Math.round(zoom * 100)}%
          </label>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Rotação */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Rotação: {rotation}°
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              className="flex-1"
            />
            <button
              onClick={handleRotate}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              title="Rotacionar 90°"
            >
              <RotateCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          >
            Resetar
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <X className="h-5 w-5" />
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Check className="h-5 w-5" />
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageCropModal
