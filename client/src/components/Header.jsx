import React from 'react';
import { Plus } from 'lucide-react';

export default function Header({ onOpenCreate }) {
  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur-md px-10 py-5 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-sm animate-pulse"></div>
        <h1 className="text-sm font-semibold tracking-wider text-neutral-900">
          Kanban <span className="text-neutral-300 font-normal">//</span> Workspace
        </h1>
      </div>
      <button
        onClick={onOpenCreate}
        className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-2.5 px-6 rounded-2xl text-xs tracking-wide flex items-center space-x-2 transition-all shadow-md cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Crear tarea</span>
      </button>
    </header>
  );
}