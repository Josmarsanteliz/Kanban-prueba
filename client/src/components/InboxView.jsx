import React, { useState, useEffect } from 'react';
import { Send, Trash2, FileText } from 'lucide-react';

export default function InboxView() {
  const [notes, setNotes] = useState([]);
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/notes')
      .then(res => res.json())
      .then(data => setNotes(data.notes || []))
      .catch(err => console.error("Error al cargar notas:", err));
  }, []);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.json({ content: newContent })
      });
      
      // Nota: Asegúrate de parsear el body correcto
      // let data = await response.json();
    } catch (error) {
      // Manejo de error básico o temporal
    }
  };

  // Versión limpia y corregida del manejador de notas:
  const handleAddNoteSubmit = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent })
      });
      const data = await response.json();
      
      if (response.ok) {
        setNotes([data, ...notes]);
        setNewContent('');
      }
    } catch (error) {
      console.error("Error al guardar nota:", error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setNotes(notes.filter(note => note.id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar nota:", error);
    }
  };

  return (
    <main className="flex-1 p-10 max-w-3xl mx-auto w-full z-10 animate-in fade-in duration-200">
      <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-8 shadow-sm flex flex-col h-[75vh]">
        
        <div className="mb-6">
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight">Inbox & Notas Rápidas</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Captura ideas al vuelo. (Preparado para futuras automatizaciones)</p>
        </div>

        <form onSubmit={handleAddNoteSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Escribe una nota rápida o idea..."
            className="flex-1 bg-white border border-neutral-200 rounded-2xl px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-emerald-500 shadow-xs"
          />
          <button
            type="submit"
            className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-5 py-3 rounded-2xl text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Guardar</span>
          </button>
        </form>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {notes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400 text-sm">
              <FileText className="w-10 h-10 mb-2 stroke-1" />
              <p>No tienes notas en tu inbox todavía.</p>
            </div>
          ) : (
            notes.map(note => (
              <div 
                key={note.id}
                className="bg-white border border-neutral-200 p-4 rounded-2xl flex items-center justify-between shadow-2xs group hover:border-neutral-300 transition-all"
              >
                <div className="flex items-start gap-3 overflow-hidden">
                  <FileText className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-neutral-800 font-medium break-words">{note.content}</p>
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      {new Date(note.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-neutral-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer opacity-80 sm:opacity-0 group-hover:opacity-100"
                  title="Eliminar nota"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}