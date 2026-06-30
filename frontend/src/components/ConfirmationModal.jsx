import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-amber-500">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
          <button onClick={onCancel} className="text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-zinc-400 mb-6 text-sm">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-all"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
