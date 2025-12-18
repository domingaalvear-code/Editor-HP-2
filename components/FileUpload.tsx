
import React, { useRef } from 'react';

interface FileUploadProps {
  id: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  manualText: string;
  onManualTextChange: (text: string) => void;
  disabled?: boolean;
  title?: string;
  description?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  id, 
  file, 
  onFileChange, 
  manualText,
  onManualTextChange,
  disabled,
  title = "3. Sube tu Historia o Escribe el Texto",
  description = "Puedes subir un PDF con tu borrador o pegar el texto directamente abajo. Si ambos están vacíos, se generará una nueva historia desde cero."
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(e.target.files ? e.target.files[0] : null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="flex flex-col space-y-4 pt-4 border-t border-gray-200">
      <div className="space-y-1">
        <h3 className="font-semibold text-lg text-brand-primary">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lado del PDF */}
        <div 
          className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${disabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-brand-secondary/50 border-brand-primary/50 hover:bg-brand-secondary'}
          ${file ? 'border-green-500 bg-green-50' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            id={id}
            className="hidden"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={disabled}
          />
          {file ? (
            <div className="text-center p-4">
              <div className="text-green-600 mb-2">
                <CheckIcon />
              </div>
              <p className="font-semibold text-brand-text truncate max-w-[150px]">{file.name}</p>
              <button 
                className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium" 
                onClick={(e) => { e.stopPropagation(); onFileChange(null); }}
                disabled={disabled}
              >
                Quitar Archivo
              </button>
            </div>
          ) : (
            <div className="text-center text-brand-primary">
              <UploadIcon />
              <p className="font-semibold text-sm">Sube tu PDF</p>
              <p className="text-[10px]">Arrastra o haz clic</p>
            </div>
          )}
        </div>

        {/* Lado del Texto Manual */}
        <div className="flex flex-col">
          <textarea
            value={manualText}
            onChange={(e) => onManualTextChange(e.target.value)}
            disabled={disabled || !!file}
            placeholder={file ? "Desactiva el PDF para escribir aquí..." : "Pega aquí el contenido de tu historia..."}
            className={`w-full h-48 p-4 border rounded-lg resize-none text-sm font-sans focus:ring-2 focus:ring-brand-accent transition-all
              ${disabled || !!file ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-brand-text border-gray-300'}
            `}
          />
          {manualText && !file && (
            <button 
              onClick={() => onManualTextChange('')}
              className="mt-1 text-xs text-red-600 self-end hover:underline"
            >
              Borrar Texto
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-brand-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 12v9m-4-3l4-4 4 4" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

export default FileUpload;
