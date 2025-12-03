
import React, { useRef, useCallback, useState } from 'react';

interface InspirationBoardProps {
  ideas: string;
  onIdeasChange: (ideas: string) => void;
  images: File[];
  onImagesChange: (images: File[]) => void;
  disabled?: boolean;
}

const InspirationBoard: React.FC<InspirationBoardProps> = ({ ideas, onIdeasChange, images, onImagesChange, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onImagesChange([...images, ...Array.from(e.target.files)]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImagesChange([...images, ...Array.from(e.dataTransfer.files)]);
    }
  }, [disabled, images, onImagesChange]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleRemoveImage = (indexToRemove: number) => {
    onImagesChange(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div id="inspiration-board" className="space-y-4 pt-4 border-t border-gray-200">
      <h3 className="font-semibold text-lg text-brand-primary">4. Añade Inspiración (Opcional)</h3>
      <div>
        <label htmlFor="inspiration-ideas" className="block text-sm font-medium text-gray-700 mb-1">
          Ideas y Notas
        </label>
        <textarea
          id="inspiration-ideas"
          rows={4}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-primary transition-shadow duration-200 disabled:bg-gray-100 placeholder-gray-500 shadow-sm text-sm"
          value={ideas}
          onChange={(e) => onIdeasChange(e.target.value)}
          disabled={disabled}
          placeholder="Describe el tono, la atmósfera o escenas específicas deseadas..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Imágenes de Inspiración
        </label>
        <div 
          className={`relative flex flex-col items-center justify-center w-full p-4 min-h-[8rem] border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300
          ${disabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-brand-secondary/50 border-brand-primary/50'}
          ${isDragging ? 'border-brand-accent bg-brand-secondary scale-105' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={disabled}
          />
          <div className="text-center text-brand-primary">
            <UploadIcon />
            <p className="font-semibold">Haz clic o arrastra y suelta imágenes</p>
            <p className="text-xs">Proporciona inspiración visual</p>
          </div>
        </div>
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mt-4">
            {images.map((file, index) => (
              <div key={`${file.name}-${index}`} className="relative group aspect-square">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`Inspiration ${index + 1}`} 
                  className="w-full h-full object-cover rounded-md shadow-md transition-transform duration-300 group-hover:scale-110" 
                  onLoad={e => URL.revokeObjectURL(e.currentTarget.src)}
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }}
                  disabled={disabled}
                  className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white rounded-full p-1 leading-none w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
                  aria-label="Quitar imagen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-brand-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export default InspirationBoard;
