import React from 'react';
import { Calendar as CalendarIcon, CheckSquare } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md border border-neutral-200 px-4 py-2 rounded-full shadow-xl flex items-center space-x-3 z-40">
    <div className="flex bg-white border border-neutral-200 p-1.5 rounded-full shadow-lg">
  <button 
    onClick={() => setActiveTab('tasks')}
    className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
      activeTab === 'tasks' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-600 hover:text-neutral-900'
    }`}
  >
    Tareas
  </button>
  
  <button 
    onClick={() => setActiveTab('calendar')}
    className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
      activeTab === 'calendar' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-600 hover:text-neutral-900'
    }`}
  >
    Calendario
  </button>

  {/* NUEVO BOTÓN DE INBOX */}
  <button 
    onClick={() => setActiveTab('inbox')}
    className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
      activeTab === 'inbox' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-600 hover:text-neutral-900'
    }`}
  >
    Inbox
  </button>
</div>
    </nav>
  );
}