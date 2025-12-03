
import React, { useCallback } from 'react';
import { parsePdf } from '../services/fileService';

interface WorldRulesManagerProps {
  rulesText: string;
  onRulesTextChange: (text: string) => void;
  onSaveRules: () => void;
  onAnalyze?: () => void;
  disabled?: boolean;
  title?: string;
  description?: string;
}

const WorldRulesManager: React.FC<WorldRulesManagerProps> = ({ 
  rulesText, 
  onRulesTextChange, 
  onSaveRules,
  onAnalyze,
  disabled,
  title = "1. Gestiona las Reglas del Mundo",
  description = "Edita las reglas a continuación o sube un PDF. Haz clic en 'Guardar' para almacenarlas."
}) => {
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const text = await parsePdf(file);
        onRulesTextChange(text);
      } catch (error) {
        console.error("Failed to parse rules PDF", error);
        alert("No se pudo analizar el PDF subido.");
      }
    }
    e.target.value = ''; 
  }, [onRulesTextChange]);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-baseline">
        <h3 className="font-semibold text-lg text-brand-primary">{title}</h3>
      </div>
      <p className="text-sm text-gray-500">
        {description}
      </p>
      <textarea
        rows={8}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-primary transition-shadow duration-200 disabled:bg-gray-100 font-mono text-sm placeholder-gray-400 shadow-sm"
        value={rulesText}
        onChange={(e) => onRulesTextChange(e.target.value)}
        disabled={disabled}
        placeholder="Escribe, pega o sube aquí el contenido..."
      />
      <div className="flex items-center justify-end space-x-2 pt-2">
         {onAnalyze && (
          <button
            onClick={onAnalyze}
            disabled={disabled || !rulesText}
            className={`flex items-center px-4 py-2 text-sm font-medium text-brand-primary bg-blue-100 rounded-md hover:bg-blue-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors mr-auto`}
          >
            <SearchIcon />
            Analizar Coherencia
          </button>
        )}

        <label htmlFor="rules-pdf-upload" className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors cursor-pointer
          ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-primary hover:bg-brand-primary/90'}`}>
          Subir PDF
        </label>
        <input
          type="file"
          id="rules-pdf-upload"
          className="hidden"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={disabled}
        />
        <button
          onClick={onSaveRules}
          disabled={disabled}
          className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded-md transition-colors
            ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
        >
          <SaveIcon />
          Guardar
        </button>
        <button
          onClick={() => onRulesTextChange('')}
          disabled={disabled || !rulesText}
          className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Borrar
        </button>
      </div>
    </div>
  );
};

const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default WorldRulesManager;
