
// Added missing React, useState, and useEffect imports
import React, { useState, useEffect } from 'react';
import { AppStatus } from '../types';
import { Loader } from './Loader';
import { ActionButton } from './ActionButton';

interface ResultDisplayProps { status: AppStatus; text: string; onDownload: () => void; }

const ResultDisplay: React.FC<ResultDisplayProps> = ({ status, text, onDownload }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let intervalId: number | undefined;
    if (status === AppStatus.LOADING) {
      setProgress(0);
      intervalId = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 99) { if (intervalId) clearInterval(intervalId); return 99; }
          const increment = prev > 90 ? Math.random() * 0.1 : Math.random() * 0.8;
          return prev + increment;
        });
      }, 1500); 
    }
    return () => { if (intervalId) clearInterval(intervalId); };
  }, [status]);

  if (status === AppStatus.IDLE || status === AppStatus.ERROR) return null;

  if (status === AppStatus.LOADING) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 w-full border-t border-gray-100 mt-8">
        <Loader />
        <p className="text-brand-primary font-semibold text-center text-lg">Procesando con Magia IA...</p>
        <p className="text-sm text-gray-500 text-center max-w-md italic">
          Consultando las 10 leyes de la alquimia y verificando la coherencia del mundo mágico...
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3 my-4 max-w-lg shadow-inner">
          <div
            className="bg-gradient-to-r from-brand-primary to-brand-accent h-3 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  }

  if (status === AppStatus.SUCCESS && text) {
    const isAnalysis = text.toLowerCase().includes("informe") || text.toLowerCase().includes("coherencia") || text.toLowerCase().includes("analiza");
    const wordCount = text.split(/\s+/).length;

    return (
      <div className="space-y-6 animate-fade-in pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
                <h2 className={`text-2xl font-bold ${isAnalysis ? 'text-blue-700' : 'text-brand-primary'}`}>
                    {isAnalysis ? "Informe de Coherencia Alquímica" : "Manuscrito Expandido"}
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                    {isAnalysis ? "Diagnóstico de estructura y reglas" : `Extensión alcanzada: ${wordCount} palabras`}
                </p>
            </div>
            <ActionButton 
              onClick={onDownload}
              text={isAnalysis ? "Descargar Informe" : "Descargar Manuscrito"}
              Icon={DownloadIcon}
              color="bg-green-600 hover:bg-green-700"
            />
        </div>
        <div className={`p-8 border rounded-xl shadow-inner relative group ${isAnalysis ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-1 rounded">
               {isAnalysis ? "Diagnóstico IA" : "Texto Final"}
             </span>
          </div>
          <div className={`whitespace-pre-wrap ${isAnalysis ? 'font-mono text-sm text-blue-900 leading-relaxed' : 'font-serif text-lg text-brand-text leading-relaxed tracking-wide'}`}>
            {text}
          </div>
        </div>
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
