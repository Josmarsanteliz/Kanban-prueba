import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Search, AlertCircle, Calendar } from 'lucide-react';

export default function KanbanBoard({ 
  tasks, 
  columns, 
  onCreateColumn, 
  onDeleteColumn, 
  onDragStart, 
  onDragEnd, 
  onDragOver, 
  onDrop, 
  onDelete, 
  onEditClick 
}) {
  const [newColTitle, setNewColTitle] = useState('');
  const [showAddColInput, setShowAddColInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddColumnSubmit = (e) => {
    e.preventDefault();
    if (!newColTitle.trim()) return;
    onCreateColumn(newColTitle);
    setNewColTitle('');
    setShowAddColInput(false);
  };

  // Obtener fecha actual en formato YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Filtrar tareas por búsqueda de texto
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 px-6 py-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
      {/* Barra superior de acciones y búsqueda */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar tareas por título o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200/90 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-3">
          {!showAddColInput ? (
            <button 
              onClick={() => setShowAddColInput(true)}
              className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-neutral-800 transition shadow-sm"
            >
              <Plus size={16} /> Añadir Columna
            </button>
          ) : (
            <form onSubmit={handleAddColumnSubmit} className="flex gap-2">
              <input 
                type="text"
                placeholder="Nombre de la columna..."
                value={newColTitle}
                onChange={(e) => setNewColTitle(e.target.value)}
                className="border border-neutral-300 px-3 py-1.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
              <button type="submit" className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-sm font-medium">Crear</button>
              <button type="button" onClick={() => setShowAddColInput(false)} className="text-neutral-500 px-2 text-sm">Cancelar</button>
            </form>
          )}
        </div>
      </div>

      {/* Contenedor de columnas dinámicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start overflow-x-auto pb-4">
        {columns.map((col) => {
          const columnTasks = filteredTasks.filter(task => task.status === col.id);

          return (
            <div 
              key={col.id}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, col.id)}
              className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-4 flex flex-col min-h-[500px]"
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-200">
                <h3 className="font-semibold text-neutral-700 text-sm tracking-wide uppercase">
                  {col.title} <span className="ml-1 text-xs bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded-full">{columnTasks.length}</span>
                </h3>
                
                {!['todo', 'in_progress', 'done'].includes(col.id) && (
                  <button 
                    onClick={() => onDeleteColumn(col.id)}
                    className="text-neutral-400 hover:text-red-500 p-1 transition"
                    title="Eliminar columna"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-3">
                {columnTasks.map((task) => {
                  const taskDate = task.endDate ? task.endDate.split('T')[0] : null;
                  const isToday = taskDate === todayStr;
                  const isOverdue = taskDate && taskDate < todayStr && col.id !== 'done';

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, task.id)}
                      onDragEnd={onDragEnd}
                      className={`bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-grab active:cursor-grabbing flex flex-col gap-2 ${
                        isOverdue 
                          ? 'border-red-300 bg-red-50/30' 
                          : isToday 
                          ? 'border-amber-300 bg-amber-50/30' 
                          : 'border-neutral-200/90'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-neutral-800 text-sm">{task.title}</h4>
                        <div className="flex gap-1">
                          <button onClick={() => onEditClick(task)} className="text-neutral-400 hover:text-neutral-700 p-1">
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => onDelete(task.id)} className="text-neutral-400 hover:text-red-500 p-1">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-neutral-500 text-xs line-clamp-2">{task.description}</p>
                      )}

                      {taskDate && (
                        <div className={`text-[11px] mt-1 flex items-center gap-1.5 font-medium ${
                          isOverdue ? 'text-red-600' : isToday ? 'text-amber-600' : 'text-neutral-400'
                        }`}>
                          {isOverdue ? <AlertCircle size={12} /> : <Calendar size={12} />}
                          <span>
                            {isOverdue ? `Vencida (${taskDate})` : isToday ? 'Vence hoy' : `Vence: ${taskDate}`}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}