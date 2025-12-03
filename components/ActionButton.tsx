
import React from 'react';

interface ActionButtonProps {
    onClick: () => void;
    text: string;
    Icon?: React.ElementType;
    disabled?: boolean;
    color?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick, text, Icon, disabled = false, color }) => {
    const baseColor = color || 'bg-brand-primary hover:bg-brand-primary/90';
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                flex items-center justify-center px-6 py-3 border border-transparent 
                text-base font-medium rounded-md text-white 
                ${baseColor}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent
                transition-all duration-300 ease-in-out shadow-lg
                disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none
            `}
        >
            {Icon && !disabled && <Icon />}
            {disabled && text.includes("Processing") && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {text}
        </button>
    );
};
