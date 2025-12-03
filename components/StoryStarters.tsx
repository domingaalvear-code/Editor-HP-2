
import React from 'react';
import { storyStarters } from '../storyStarters';

interface StoryStartersProps {
  onSelectStarter: (prompt: string) => void;
  disabled?: boolean;
}

const StoryStarters: React.FC<StoryStartersProps> = ({ onSelectStarter, disabled }) => {
  return (
    <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
      <h3 className="font-semibold text-lg text-brand-primary">2. Ideas de Trama (Opcional)</h3>
      <p className="text-sm text-gray-500">
        Selecciona una de estas ideas para usarla como punto de partida para una nueva historia. Se copiará en el campo de "Ideas y Notas".
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {storyStarters.map((starter) => (
          <div key={starter.title} className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between bg-white shadow-sm hover:shadow-md transition-shadow">
            <div>
              <h4 className="font-bold text-brand-text">{starter.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{starter.description}</p>
            </div>
            <button
              onClick={() => onSelectStarter(starter.prompt.trim())}
              disabled={disabled}
              className={`
                mt-4 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors w-full
                ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-accent hover:bg-brand-accent/90'}
              `}
            >
              Usar esta Idea
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryStarters;
