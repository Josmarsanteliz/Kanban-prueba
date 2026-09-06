import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

import Header from './components/Header';
import Navbar from './components/Navbar';
import KanbanBoard from './components/KanbanBoard';
import CalendarView from './components/CalendarView.jsx';
import TaskModal from './components/TaskModal';
import InboxView from './components/InboxView';

// URL base dinámica (lee de Vercel/Netlify o usa Render por defecto)
const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://kanban-prueba-1.onrender.com';

const API_URL = `${BACKEND_URL}/api/tasks`;
const COLUMNS_URL = `${BACKEND_URL}/api/columns`;

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState([]);
  const [activeTab, setActiveTab] = useState('tasks');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data.tasks);
    } catch (error) {
      toast.error('Error al conectar con el servidor');
    }
  };

  const fetchColumns = async () => {
    try {
      const response = await axios.get(COLUMNS_URL);
      setColumns(response.data.columns);
    } catch (error) {
      console.error('Error al cargar columnas');
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchColumns();
  }, []);

  const handleCreateColumn = async (columnTitle) => {
    if (!columnTitle.trim()) {
      toast.error('El nombre de la columna es requerido');
      return;
    }

    try {
      await axios.post(COLUMNS_URL, { title: columnTitle });
      toast.success('Columna creada correctamente');
      fetchColumns();
    } catch (error) {
      toast.error('Error al crear la columna');
    }
  };

  const handleDeleteColumn = async (columnId) => {
    try {
      await axios.delete(`${COLUMNS_URL}/${columnId}`);
      toast.success('Columna eliminada (sus tareas pasaron a "Por hacer")');
      fetchColumns();
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al eliminar la columna');
    }
  };

  const handleSaveTask = async (taskData) => {
    if (!taskData.title.trim()) {
      toast.error('El título es requerido');
      return;
    }

    try {
      if (taskToEdit) {
        await axios.put(`${API_URL}/${taskToEdit.id}`, {
          ...taskToEdit,
          ...taskData
        });
        toast.success('Tarea actualizada correctamente');
      } else {
        const defaultStatus = columns.length > 0 ? columns[0].id : 'todo';
        await axios.post(API_URL, {
          ...taskData,
          status: defaultStatus
        });
        toast.success('Tarea creada correctamente');
      }

      setIsModalOpen(false);
      setTaskToEdit(null);
      fetchTasks();
    } catch (error) {
      toast.error('Error al guardar la tarea');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
      toast.error('Tarea eliminada', { icon: '🗑️' });
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const handleOpenCreate = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleDragStart = (e, id) => {
    setDraggedTaskId(id);
    setTimeout(() => { e.target.style.opacity = '0.4'; }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedTaskId(null);
  };

  const handleDragOver = (e) => { e.preventDefault(); };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    if (!draggedTaskId) return;

    const taskToMove = tasks.find(t => t.id === draggedTaskId);
    if (!taskToMove || taskToMove.status === targetStatus) return;

    const updatedTasks = tasks.map(t => 
      t.id === draggedTaskId ? { ...t, status: targetStatus } : t
    );
    setTasks(updatedTasks);

    try {
      await axios.put(`${API_URL}/${draggedTaskId}`, {
        ...taskToMove,
        status: targetStatus
      });
      toast.success('Estado actualizado');
    } catch (error) {
      toast.error('Error al actualizar');
      fetchTasks();
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col relative font-sans selection:bg-emerald-100 pb-24">
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#171717',
            border: '1px solid #e5e7eb',
            borderRadius: '24px',
            padding: '16px 20px',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.1)',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#ffffff' } },
        }}
      />

      <Header onOpenCreate={handleOpenCreate} />

      {activeTab === 'tasks' && (
        <KanbanBoard 
          tasks={tasks}
          columns={columns}
          onCreateColumn={handleCreateColumn}
          onDeleteColumn={handleDeleteColumn}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDelete={handleDeleteTask}
          onEditClick={handleOpenEdit}
        />
      )}

      {activeTab === 'calendar' && (
        <CalendarView tasks={tasks} />
      )}

      {activeTab === 'inbox' && (
        <InboxView />
      )}

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}