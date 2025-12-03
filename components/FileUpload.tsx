
import React, { useRef } from 'react';

interface FileUploadProps {
  id: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
  title?: string;
  description?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  id, 
  file, 
  onFileChange, 
  disabled,
  title = "3. Sube tu Historia (Opcional)",
  description = "Sube el PDF de la historia que quieres editar. Si lo dejas vacío, se generará una nueva historia."
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
    <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
      <h3 className="font-semibold text-lg text-brand-primary">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
      <div 
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${disabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-brand-secondary/50 border-brand-primary/50 hover:bg-brand-secondary'}
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
            <FileIcon />
            <p className="font-semibold text-brand-text truncate max-w-xs">{file.name}</p>
            <button 
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium" 
              onClick={(e) => { e.stopPropagation(); onFileChange(null); }}
              disabled={disabled}
            >
              Quitar
            </button>
          </div>
        ) : (
          <div className="text-center text-brand-primary">
            <UploadIcon />
            <p className="font-semibold">Haz clic o arrastra y suelta</p>
            <p className="text-xs">Solo PDF</p>
          </div>
        )}
      </div>
    </div>
  );
};

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-brand-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 12v9m-4-3l4-4 4 4" />
    </svg>
);

const FileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export default FileUpload;
