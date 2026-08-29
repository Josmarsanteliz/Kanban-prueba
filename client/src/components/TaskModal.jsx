import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSave, taskToEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('normal');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority || 'normal');
      setStartDate(formatDateForInput(taskToEdit.startDate) || '');
      setEndDate(formatDateForInput(taskToEdit.endDate) || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('normal');
      setStartDate('');
      setEndDate('');
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title,
      description,
      priority,
      startDate: startDate || null,
      endDate: endDate || null
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs">
      <div className="bg-white border border-neutral-200 p-8 rounded-[32px] shadow-2xl w-full max-w-lg relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 p-3 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            {taskToEdit ? 'Editar tarea' : 'Crear nueva tarea'}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {taskToEdit ? 'Modifica los campos de tu tarea.' : 'Añade fechas opcionales para enlazarlas al calendario.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">Título</label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Diseñar interfaz..."
              className="w-full bg-white border border-neutral-200 rounded-2xl px-4.5 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-emerald-500 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles adicionales..."
              rows="2"
              className="w-full bg-white border border-neutral-200 rounded-2xl px-4.5 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-emerald-500 resize-none shadow-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">Fecha Inicio</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-2xl px-3 py-3 text-sm text-neutral-900 focus:outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">Fecha Final</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-2xl px-3 py-3 text-sm text-neutral-900 focus:outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">Prioridad</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-2xl px-4.5 py-3 text-sm text-neutral-900 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
            >
              <option value="low">Baja</option>
              <option value="normal">Normal</option>
              <option value="high">Alta (Urgente)</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 font-medium py-3 px-4 rounded-2xl text-sm transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-3 px-4 rounded-2xl text-sm transition-all shadow-md cursor-pointer"
            >
              {taskToEdit ? 'Actualizar tarea' : 'Guardar tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}