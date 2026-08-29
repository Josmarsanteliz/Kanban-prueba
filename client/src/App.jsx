import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

import Header from './components/Header';
import Navbar from './components/Navbar';
import KanbanBoard from './components/KanbanBoard';
import CalendarView from './components/CalendarView';
import TaskModal from './components/TaskModal';
import InboxView from './components/InboxView';

const API_URL = 'http://localhost:5000/api/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
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

  useEffect(() => {
    fetchTasks();
  }, []);

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
        await axios.post(API_URL, {
          ...taskData,
          status: 'todo'
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

      {/* VISTA 1: KANBAN DE TAREAS */}
      {activeTab === 'tasks' && (
        <KanbanBoard 
          tasks={tasks}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDelete={handleDeleteTask}
          onEditClick={handleOpenEdit}
        />
      )}

      {/* VISTA 2: CALENDARIO */}
      {activeTab === 'calendar' && (
        <CalendarView tasks={tasks} />
      )}

      {/* VISTA 3: INBOX DE NOTAS */}
      {activeTab === 'inbox' && (
        <InboxView />
      )}

      {/* BARRA DE NAVEGACIÓN FLOTANTE */}
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