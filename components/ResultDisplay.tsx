
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
          // Slow down progress as it nears the end to account for large generations
          const increment = prev > 80 ? Math.random() * 0.5 : Math.random() * 2;
          return prev + increment;
        });
      }, 800);
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
      <div className="flex flex-col items-center justify-center p-8 space-y-4 w-full">
        <Loader />
        <p className="text-brand-primary font-semibold text-center">Generando capítulo de 5000 palabras...</p>
        <p className="text-xs text-gray-500 text-center italic">Este proceso es exhaustivo y puede tardar un par de minutos.</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
          <div
            className="bg-brand-primary h-2.5 rounded-full transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500">{`Progreso: ${Math.floor(progress)}%`}</p>
      </div>
    );
  }

  if (status === AppStatus.SUCCESS && text) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-brand-primary">Tu Historia Editada</h2>
            <ActionButton 
              onClick={onDownload}
              text="Descargar como .docx"
              Icon={DownloadIcon}
              color="bg-green-600 hover:bg-green-700"
            />
        </div>
        <div className="p-4 border rounded-lg bg-gray-50 max-h-96 overflow-y-auto prose prose-sm max-w-none shadow-inner">
          <pre className="whitespace-pre-wrap font-sans text-brand-text">{text}</pre>
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
