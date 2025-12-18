
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
  
  // New: Canon/Reference Material state
  const [canonReference, setCanonReference] = useState<string>('');

  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [manualStoryText, setManualStoryText] = useState<string>('');
  const [inspirationIdeas, setInspirationIdeas] = useState<string>('');
  const [inspirationImages, setInspirationImages] = useState<File[]>([]);
  const [editedStory, setEditedStory] = useState<string>('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const isAcademic = appMode === AppMode.ACADEMIC;
  
  const currentRulesText = isAcademic ? academicSource : narrativeRules;
  const setCurrentRulesText = isAcademic ? setAcademicSource : setNarrativeRules;

  const handleModeChange = (mode: AppMode) => {
    setAppMode(mode);
    setStoryFile(null);
    setManualStoryText('');
    setEditedStory('');
    setStatus(AppStatus.IDLE);
    setError(null);
    setInspirationIdeas('');
    setInspirationImages([]);
    setCanonReference('');
  };
  
  const handleSaveRules = useCallback(() => {
    if (isAcademic) {
      localStorage.setItem('academicSource', academicSource);
      alert('¡Material de investigación guardado!');
    } else {
      localStorage.setItem('worldRules', narrativeRules);
      alert('¡Reglas del mundo guardadas!');
    }
  }, [narrativeRules, academicSource, isAcademic]);

  const handleAnalyzeRules = useCallback(async () => {
    if (!currentRulesText.trim()) {
        alert("Por favor, introduce texto en las reglas para analizar.");
        return;
    }
    
    setStatus(AppStatus.LOADING);
    setError(null);
    setEditedStory('');

    try {
        const result = await analyzeWorldRules(currentRulesText);
        setEditedStory(result);
        setStatus(AppStatus.SUCCESS);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido.";
        setError(`Falló el análisis: ${errorMessage}`);
        setStatus(AppStatus.ERROR);
    }
  }, [currentRulesText]);

  const handleSelectStarter = useCallback((prompt: string) => {
    setInspirationIdeas(prevIdeas => prevIdeas ? `${prevIdeas}\n\n${prompt}` : prompt);
    document.getElementById('inspiration-board')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleUploadCanon = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setStatus(AppStatus.LOADING);
        try {
            const text = await parsePdf(file);
            setCanonReference(prev => prev + "\n\n" + text);
            setStatus(AppStatus.IDLE);
            alert("Material de referencia añadido con éxito.");
        } catch (err) {
            setError("No se pudo procesar el PDF de referencia.");
            setStatus(AppStatus.ERROR);
        }
    }
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
      
      const result = await editStory(
        currentRulesText, 
        storyText, 
        inspirationIdeas, 
        images, 
        appMode,
        canonReference
      );
      setEditedStory(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido.";
      setError(`Falló durante el procesamiento: ${errorMessage}`);
      setStatus(AppStatus.ERROR);
    }
  };

  const handleAction = useCallback(async () => {
    // Priority: 1. File Upload, 2. Manual Text, 3. Generate New
    if (storyFile) {
        const storyText = await parsePdf(storyFile);
        processStory(storyText);
    } else if (manualStoryText.trim()) {
        processStory(manualStoryText);
    } else {
        processStory(''); // New generation
    }
  }, [currentRulesText, storyFile, manualStoryText, inspirationIdeas, inspirationImages, appMode, canonReference]);

  const handleDownload = useCallback(() => {
    if (editedStory) {
      const filename = isAcademic ? "tesis-borrador.docx" : "historia-editada.docx";
      generateDocx(editedStory, filename);
    }
  }, [editedStory, isAcademic]);

  const handleReset = () => {
    setStoryFile(null);
    setManualStoryText('');
    setInspirationIdeas('');
    setInspirationImages([]);
    setEditedStory('');
    setCanonReference('');
    setStatus(AppStatus.IDLE);
    setError(null);
  }

  const isProcessing = status === AppStatus.LOADING;
  const isSuccess = status === AppStatus.SUCCESS;

  return (
    <div className="min-h-screen bg-gray-50 text-brand-text font-sans pb-20">
      <Header />
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-8">
          
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
                  title={isAcademic ? "1. Material de Investigación" : "1. Reglas del Mundo (Tu AU)"}
                  description={isAcademic 
                    ? "Sube los artículos o datos que son la fuente de verdad."
                    : "Aquí defines tus cambios al canon (ej. Sirius libre, Aries Mauvignier). Esto manda sobre cualquier libro."
                  }
                />

                {!isAcademic && (
                    <div className="pt-4 border-t border-gray-200">
                        <h3 className="font-semibold text-lg text-brand-primary">2. Material de Referencia (Libros/Canon)</h3>
                        <p className="text-sm text-gray-500 mb-2">Sube los libros originales como PDF para que la IA aprenda el estilo y el trasfondo general. No sobreescribirán tus reglas.</p>
                        <div className="flex items-center space-x-4">
                            <label className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                                <input type="file" accept=".pdf" className="hidden" onChange={handleUploadCanon} disabled={isProcessing} />
                                <span className="text-sm text-gray-600">{canonReference ? "✓ Libros cargados como contexto" : "Subir Libros (PDF)"}</span>
                            </label>
                            {canonReference && (
                                <button 
                                    onClick={() => setCanonReference('')}
                                    className="text-xs text-red-600 hover:underline"
                                >
                                    Limpiar Referencia
                                </button>
                            )}
                        </div>
                    </div>
                )}

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
                  manualText={manualStoryText}
                  onManualTextChange={setManualStoryText}
                  disabled={isProcessing}
                  title={isAcademic ? "2. Borrador de Tesis" : "3. Tu Historia"}
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
                <ActionButton
                    onClick={handleAction}
                    text={
                        (storyFile || manualStoryText.trim()) 
                        ? (isAcademic ? "Editar Tesis" : "Editar Mi Historia") 
                        : (isAcademic ? "Generar Tesis Nueva" : "Generar Nueva Historia")
                    }
                    Icon={isProcessing ? undefined : MagicWandIcon}
                    disabled={isProcessing}
                />
            )}
          </div>

          <ResultDisplay 
            status={status} 
            text={editedStory} 
            onDownload={handleDownload} 
          />
        </div>
      </main>
    </div>
  );
};

const MagicWandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21.6667C12 21.6667 15.3333 16.3333 21 16.3333M12 21.6667C12 21.6667 8.66667 16.3333 3 16.3333M12 21.6667V3M3 8.33333C8.66667 8.33333 12 3 12 3C12 3 15.3333 8.33333 21 8.33333" />
    </svg>
);

const RestartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 9a9 9 0 0114.13-5.26M20 15a9 9 0 01-14.13 5.26" />
    </svg>
);

export default App;
