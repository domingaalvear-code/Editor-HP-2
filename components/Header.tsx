import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 md:px-8 py-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-brand-primary rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-5.494-5.494h10.988M17.747 6.253a9 9 0 10-11.494 0M17.747 17.747a9 9 0 00-11.494 0" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-brand-primary">Editor de Narrativa IA</h1>
                        <p className="text-sm text-gray-500">Refina tu historia con revisiones de coherencia por IA</p>
                    </div>
                </div>
            </div>
        </header>
    );
};