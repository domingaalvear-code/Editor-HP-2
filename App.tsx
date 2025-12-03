
import React, { useState, useCallback } from 'react';
import { AppStatus, AppMode } from './types';
import FileUpload from './components/FileUpload';
import ResultDisplay from './components/ResultDisplay';
import { parsePdf, generateDocx, fileToBase64 } from './services/fileService';
import { editStory, analyzeWorldRules } from './services/geminiService';
import { Header } from './components/Header';
import { ErrorDisplay } from './components/ErrorDisplay';
import { ActionButton } from './components/ActionButton';
import InspirationBoard from './components/InspirationBoard';
import WorldRulesManager from './components/WorldRulesManager';
import { DEFAULT_WORLD_RULES } from './worldRules';
import StoryStarters from './components/StoryStarters';

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>(AppMode.NARRATIVE);
  
  // Dual state for Rules/Source Material
  const [narrativeRules, setNarrativeRules] = useState<string>(() => localStorage.getItem('worldRules') || DEFAULT_WORLD_RULES);
  const [academicSource, setAcademicSource] = useState<string>(() => localStorage.getItem('academicSource') || '');

  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [inspirationIdeas, setInspirationIdeas] = useState<string>('');
  const [inspirationImages, setInspirationImages] = useState<File[]>([]);
  const [editedStory, setEditedStory] = useState<string>('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const isAcademic = appMode === AppMode.ACADEMIC;
  
  // Derived state for the current active text area
  const currentRulesText = isAcademic ? academicSource : narrativeRules;
  const setCurrentRulesText = isAcademic ? setAcademicSource : setNarrativeRules;

  const handleModeChange = (mode: AppMode) => {
    setAppMode(mode);
    // Reset transient states to avoid confusion between modes
    setStoryFile(null);
    setEditedStory('');
    setStatus(AppStatus.IDLE);
    setError(null);
    // Keep inspirationIdeas/Images as they might be useful, or clear them if preferred. 
    // Clearing them for cleaner UX:
    setInspirationIdeas('');
    setInspirationImages([]);
  };
  
  const handleSaveRules = useCallback(() => {
    if (isAcademic) {
      localStorage.setItem('academicSource', academicSource);
      alert('¡Material de investigación guardado en el navegador!');
    } else {
      localStorage.setItem('worldRules', narrativeRules);
      alert('¡Reglas del mundo guardadas en el navegador!');
    }
  }, [narrativeRules, academicSource, isAcademic]);

  const handleAnalyzeRules = useCallback(async () => {
    if (!currentRulesText.trim()) {
        alert("Por favor, introduce texto en las reglas para analizar.");
        return;
    }
    
    setStatus(AppStatus.LOADING);
    setError(null);
    setEditedStory(''); // Clear previous story/analysis

    try {
        const result = await analyzeWorldRules(currentRulesText);
        setEditedStory(result);
        setStatus(AppStatus.SUCCESS);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Ocurrió un error desconocido durante el análisis.";
        setError(`Falló el análisis: ${errorMessage}`);
        setStatus(AppStatus.ERROR);
    }
  }, [currentRulesText]);

  const handleSelectStarter = useCallback((prompt: string) => {
    setInspirationIdeas(prevIdeas => prevIdeas ? `${prevIdeas}\n\n${prompt}` : prompt);
    document.getElementById('inspiration-board')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const processStory = async (storyText: string) => {
    setStatus(AppStatus.LOADING);
    setError(null);
    setEditedStory('');

    try {
      const imagePromises = inspirationImages.map(async (file) => {
        const base64Data = await fileToBase64(file);
        return { mimeType: file.type, data: base64Data };
      });

      const images = await Promise.all(imagePromises);
      
      const result = await editStory(currentRulesText, storyText, inspirationIdeas, images, appMode);
      setEditedStory(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocurrió un error desconocido.";
      setError(`Falló durante el procesamiento: ${errorMessage}`);
      setStatus(AppStatus.ERROR);
    }
  };

  const handleGenerate = useCallback(() => {
    processStory('');
  }, [currentRulesText, inspirationIdeas, inspirationImages, appMode]);

  const handleEdit = useCallback(async () => {
    if (!storyFile) return;
    const storyText = await parsePdf(storyFile);
    processStory(storyText);
  }, [currentRulesText, storyFile, inspirationIdeas, inspirationImages, appMode]);
  
  const handleDownload = useCallback(() => {
    if (editedStory) {
      const filename = isAcademic ? "tesis-borrador.docx" : "historia-editada.docx";
      generateDocx(editedStory, filename);
    }
  }, [editedStory, isAcademic]);

  const handleReset = () => {
    setStoryFile(null);
    setInspirationIdeas('');
    setInspirationImages([]);
    setEditedStory('');
    setStatus(AppStatus.IDLE);
    setError(null);
  }

  const isProcessing = status === AppStatus.LOADING;
  const isSuccess = status === AppStatus.SUCCESS;

  return (
    <div className="min-h-screen bg-gray-50 text-brand-text font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-8">
          
          {/* Mode Switcher */}
          {!isSuccess && (
            <div className="flex justify-center pb-4 border-b border-gray-100">
                <div className="bg-gray-100 p-1 rounded-lg flex shadow-inner">
                    <button
                        onClick={() => handleModeChange(AppMode.NARRATIVE)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${!isAcademic ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Modo Narrativo (Ficción)
                    </button>
                    <button
                        onClick={() => handleModeChange(AppMode.ACADEMIC)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isAcademic ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Modo Académico (Tesis)
                    </button>
                </div>
            </div>
          )}

          {!isSuccess && (
            <>
              <div className="space-y-8">
                <WorldRulesManager
                  rulesText={currentRulesText}
                  onRulesTextChange={setCurrentRulesText}
                  onSaveRules={handleSaveRules}
                  onAnalyze={handleAnalyzeRules}
                  disabled={isProcessing}
                  title={isAcademic ? "1. Material de Investigación (PDF Fuente)" : "1. Gestiona las Reglas del Mundo"}
                  description={isAcademic 
                    ? "Sube los artículos, datos o el marco teórico en PDF. La IA usará esto como la fuente de verdad absoluta para construir la tesis."
                    : "Edita las reglas a continuación o sube un PDF. Haz clic en 'Guardar' para almacenarlas."
                  }
                />
                 {!isAcademic && (
                    <StoryStarters 
                        onSelectStarter={handleSelectStarter}
                        disabled={isProcessing}
                    />
                 )}
                <FileUpload
                  id="story-upload"
                  file={storyFile}
                  onFileChange={setStoryFile}
                  disabled={isProcessing}
                  title={isAcademic ? "2. Borrador de Tesis (Opcional)" : "3. Sube tu Historia (Opcional)"}
                  description={isAcademic 
                    ? "Sube un borrador de tu tesis en PDF para reescribirlo. Si lo dejas vacío, la IA generará una sección nueva (ej. Marco Teórico) basada en el Material de Investigación."
                    : "Sube el PDF de la historia que quieres editar. Si lo dejas vacío, se generará una nueva historia."
                  }
                />
              </div>
              
              {!isAcademic && (
                  <InspirationBoard
                    ideas={inspirationIdeas}
                    onIdeasChange={setInspirationIdeas}
                    images={inspirationImages}
                    onImagesChange={setInspirationImages}
                    disabled={isProcessing}
                  />
              )}

              {isAcademic && (
                <div className="pt-4 border-t border-gray-200">
                     <h3 className="font-semibold text-lg text-brand-primary">3. Instrucciones de Redacción</h3>
                     <p className="text-sm text-gray-500 mb-2">Especifica qué sección escribir (ej. Introducción, Metodología) o el tono deseado.</p>
                     <textarea
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-brand-primary text-sm placeholder-gray-400"
                        value={inspirationIdeas}
                        onChange={(e) => setInspirationIdeas(e.target.value)}
                        placeholder="Ej: Escribe el Marco Teórico enfocándote en las discrepancias de los autores del PDF..."
                        disabled={isProcessing}
                     />
                </div>
              )}
            </>
          )}
          
          {error && <ErrorDisplay message={error} />}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
             {isSuccess ? (
                <ActionButton
                    onClick={handleReset}
                    text="Empezar de Nuevo"
                    Icon={RestartIcon}
                    color="bg-gray-600 hover:bg-gray-700"
                />
            ) : (
                <>
                  <ActionButton
                      onClick={handleGenerate}
                      text={isAcademic ? "Generar Tesis (Texto Nuevo)" : "Generar Nueva Historia"}
                      Icon={isProcessing ? undefined : MagicWandIcon}
                      disabled={isProcessing}
                  />
                  <ActionButton
                      onClick={handleEdit}
                      text={isAcademic ? "Mejorar/Reescribir Borrador" : "Editar Mi Historia"}
                      Icon={isProcessing ? undefined : EditIcon}
                      disabled={isProcessing || !storyFile}
                  />
                </>
            )}
           
          </div>

          <ResultDisplay 
            status={status} 
            text={editedStory} 
            onDownload={handleDownload} 
          />
        </div>
        <footer className="text-center text-gray-500 mt-8 text-sm">
          <p>Desarrollado con la API de Gemini</p>
        </footer>
      </main>
    </div>
  );
};


const MagicWandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21.6667C12 21.6667 15.3333 16.3333 21 16.3333M12 21.6667C12 21.6667 8.66667 16.3333 3 16.3333M12 21.6667V3M3 8.33333C8.66667 8.33333 12 3 12 3C12 3 15.3333 8.33333 21 8.33333" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 7.5L12 3L13.5 7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 9.5L3 8L1.5 9.5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 9.5L21 8L22.5 9.5" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const RestartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 9a9 9 0 0114.13-5.26M20 15a9 9 0 01-14.13 5.26" />
    </svg>
);


export default App;
