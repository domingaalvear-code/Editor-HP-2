
import React, { useState, useEffect } from 'react';
import { AppStatus } from '../types';
import { Loader } from './Loader';
import { ActionButton } from './ActionButton';

interface ResultDisplayProps {
  status: AppStatus;
  text: string;
  onDownload: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ status, text, onDownload }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let intervalId: number | undefined;
    if (status === AppStatus.LOADING) {
      setProgress(0);
      intervalId = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) {
            if (intervalId) clearInterval(intervalId);
            return 98;
          }
          // Muy lento al final para simular el procesamiento de 5k palabras
          const increment = prev > 85 ? Math.random() * 0.2 : Math.random() * 1.5;
          return prev + increment;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [status]);

  if (status === AppStatus.IDLE || status === AppStatus.ERROR) {
    return null;
  }

  if (status === AppStatus.LOADING) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 w-full border-t border-gray-100 mt-8">
        <Loader />
        <p className="text-brand-primary font-semibold text-center text-lg">Redactando capítulo completo (5000 palabras)...</p>
        <p className="text-sm text-gray-500 text-center max-w-md">
          La IA está expandiendo cada escena con máximo detalle. Por favor, ten paciencia, esto genera un texto mucho más extenso de lo normal.
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3 my-4 max-w-lg">
          <div
            className="bg-brand-primary h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm font-mono text-brand-primary">{`Progreso: ${Math.floor(progress)}%`}</p>
      </div>
    );
  }

  if (status === AppStatus.SUCCESS && text) {
    const wordCount = text.split(/\s+/).length;
    return (
      <div className="space-y-6 animate-fade-in pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-brand-primary">Narrativa Completa</h2>
                <p className="text-xs text-gray-500 font-medium">Extensión aproximada: {wordCount} palabras</p>
            </div>
            <ActionButton 
              onClick={onDownload}
              text="Descargar Manuscrito (.docx)"
              Icon={DownloadIcon}
              color="bg-green-600 hover:bg-green-700"
            />
        </div>
        <div className="p-6 border rounded-xl bg-white max-h-[600px] overflow-y-auto shadow-inner relative group">
          <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-1 rounded">Visualización de lectura</span>
          </div>
          <pre className="whitespace-pre-wrap font-serif text-brand-text leading-relaxed text-base">
            {text}
          </pre>
        </div>
        <p className="text-center text-xs text-gray-400 italic">
            Nota: Si el texto parece cortarse, es debido a los límites de salida de la IA. Puedes pedir continuar desde el último párrafo en una nueva sesión.
        </p>
      </div>
    );
  }

  return null;
};

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export default ResultDisplay;
