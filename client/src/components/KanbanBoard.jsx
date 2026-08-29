import React from 'react';
import { Clock, Layers, CheckCircle2, GripVertical, Trash2, Calendar as CalendarIcon } from 'lucide-react';

export default function KanbanBoard({ tasks, onDragStart, onDragEnd, onDragOver, onDrop, onDelete, onEditClick }) {
  const columns = [
    { id: 'todo', title: 'Por Hacer', icon: <Clock className="w-4 h-4 text-neutral-500" /> },
    { id: 'in_progress', title: 'En Progreso', icon: <Layers className="w-4 h-4 text-emerald-600" /> },
    { id: 'completed', title: 'Completadas', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
  ];

  return (
    <main className="flex-1 p-10 max-w-7xl mx-auto w-full z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div 
              key={col.id} 
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, col.id)}
              className="bg-neutral-50/80 border border-neutral-200/80 rounded-3xl p-6 flex flex-col h-[70vh] shadow-sm backdrop-blur-sm"
            >
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-neutral-200">
                <div className="flex items-center space-x-2.5">
                  {col.icon}
                  <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-700">{col.title}</h2>
                </div>
                <span className="text-xs font-mono bg-white text-emerald-600 px-3 py-1 rounded-full border border-neutral-200 shadow-xs">
                  {colTasks.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {colTasks.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-neutral-400 border border-dashed border-neutral-200 rounded-2xl font-mono">
                    SIN TAREAS
                  </div>
                ) : (
                  colTasks.map(task => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, task.id)}
                      onDragEnd={onDragEnd}
                      onClick={() => onEditClick(task)}
                      className="bg-white border border-neutral-200 hover:border-emerald-500/50 p-5 rounded-2xl space-y-3 transition-all shadow-sm hover:shadow-md group cursor-pointer relative"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2.5">
                          <GripVertical className="w-4 h-4 text-neutral-300 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <h3 className="text-sm font-semibold text-neutral-900 tracking-wide">{task.title}</h3>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(task.id);
                          }}
                          className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {task.description && (
                        <p className="text-xs text-neutral-600 leading-relaxed pl-6">{task.description}</p>
                      )}

                      {(task.startDate || task.endDate) && (
                        <div className="text-[11px] font-mono text-neutral-500 pl-6 flex items-center space-x-2 pt-1">
                          <CalendarIcon className="w-3 h-3 text-emerald-600" />
                          <span>{task.startDate || '---'} al {task.endDate || '---'}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-neutral-100 pl-6">
                        <span className={`px-2.5 py-1 rounded-lg font-mono text-[10px] uppercase tracking-wider ${
                          task.priority === 'high' ? 'bg-red-50 text-red-600 border border-red-200' :
                          task.priority === 'low' ? 'bg-neutral-100 text-neutral-600' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}