import { useRef } from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { Check, X } from 'lucide-react'

/**
 * Modal de recorte de imagem com 4 pontos ajustáveis
 * Permite arrastar os 4 cantos livremente para recortar
 */
function ImageCropModal({ image, onSave, onCancel }) {
  const cropperRef = useRef(null)

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        if (blob) {
          onSave(blob)
        }
      }, 'image/jpeg', 0.95)
    }
  }

  const handleReset = () => {
    const cropper = cropperRef.current?.cropper
    if (cropper) {
      cropper.reset()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Recortar Foto</h2>
          <button
            onClick={onCancel}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <p className="text-sm text-gray-400">
          Arraste os cantos para ajustar a área de recorte
        </p>
      </div>

      {/* Área de recorte */}
      <div className="flex-1 relative overflow-hidden">
        <Cropper
          ref={cropperRef}
          src={image}
          style={{ height: '100%', width: '100%' }}
          aspectRatio={NaN} // Livre, sem proporção fixa
          guides={true}
          viewMode={1}
          background={false}
          responsive={true}
          autoCropArea={0.8}
          checkOrientation={false}
          zoomable={false}
          scalable={false}
          rotatable={false}
          cropBoxMovable={true}
          cropBoxResizable={true}
          dragMode="move"
        />
      </div>

      {/* Botões de ação */}
      <div className="bg-gray-900 text-white px-4 py-4">
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          >
            Desfazer
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <X className="h-5 w-5" />
            Cancelar
          </button>
          <button
            onClick={handleCrop}
            className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Check className="h-5 w-5" />
            Recortar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageCropModal
