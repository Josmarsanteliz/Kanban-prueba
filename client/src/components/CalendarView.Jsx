import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarView({ tasks }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Domingo

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <main className="flex-1 p-10 max-w-5xl mx-auto w-full z-10 animate-in fade-in duration-200">
      <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold text-neutral-900">
            {monthNames[month]} {year}
          </h2>
          <div className="flex items-center space-x-2">
            <button onClick={prevMonth} className="p-2.5 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-100 cursor-pointer shadow-2xs">
              <ChevronLeft className="w-4 h-4 text-neutral-700" />
            </button>
            <button onClick={nextMonth} className="p-2.5 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-100 cursor-pointer shadow-2xs">
              <ChevronRight className="w-4 h-4 text-neutral-700" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-neutral-400 uppercase">
          <div>Dom</div><div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div>
        </div>

        <div className="grid grid-cols-7 gap-3">
          {Array.from({ length: firstDayIndex }).map((_, index) => (
            <div key={`empty-${index}`} className="h-28 bg-transparent border border-transparent rounded-2xl"></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const dayNumber = index + 1;
            const formattedMonth = String(month + 1).padStart(2, '0');
            const formattedDay = String(dayNumber).padStart(2, '0');
            const dateString = `${year}-${formattedMonth}-${formattedDay}`;

            const dayTasks = tasks.filter(t => {
              const rawStart = t.startDate || t.start_date;
              const rawEnd = t.endDate || t.end_date;

              if (!rawStart && !rawEnd) return false;
              
              const start = rawStart ? rawStart.substring(0, 10) : (rawEnd ? rawEnd.substring(0, 10) : '');
              const end = rawEnd ? rawEnd.substring(0, 10) : (rawStart ? rawStart.substring(0, 10) : '');
              
              return dateString >= start && dateString <= end;
            });

            return (
              <div 
                key={dayNumber} 
                className={`h-28 bg-white border rounded-2xl p-2.5 flex flex-col justify-between overflow-hidden shadow-2xs transition-all ${
                  dateString === new Date().toISOString().split('T')[0] 
                    ? 'border-emerald-500 ring-1 ring-emerald-500/30' 
                    : 'border-neutral-200'
                }`}
              >
                <span className="text-xs font-semibold text-neutral-700">{dayNumber}</span>
                <div className="flex-1 overflow-y-auto space-y-1 mt-1 pr-0.5">
                  {dayTasks.map(task => (
                    <div 
                      key={task.id} 
                      className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md truncate font-medium flex items-center space-x-1" 
                      title={task.title}
                    >
                      <CalendarIcon className="w-2.5 h-2.5 shrink-0 text-emerald-600" />
                      <span className="truncate">{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}