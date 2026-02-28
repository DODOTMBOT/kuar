// src/components/TerminalClient.tsx
"use client";

import { useState } from "react";

interface Register {
  id: string;
  name: string;
  balance: number;
}

export default function TerminalClient({ registers }: { registers: Register[] }) {
  // Выбираем первую кассу по умолчанию
  const [activeId, setActiveId] = useState<string>(registers[0]?.id || "");

  if (registers.length === 0) {
    return (
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px] flex items-center justify-center text-center">
        <p className="text-gray-400 font-medium">В этом заведении еще нет касс.<br/>Добавьте их в панели партнера.</p>
      </div>
    );
  }

  const activeRegister = registers.find(r => r.id === activeId) || registers[0];

  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
      
      {/* Кнопки переключения касс (показываются только если их > 1) */}
      {registers.length > 1 && (
        <div className="flex gap-2 mb-6 border-b border-gray-100 pb-4 overflow-x-auto">
          {registers.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveId(r.id)}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                activeId === r.id 
                  ? "bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/20" 
                  : "bg-gray-50 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      )}

      {/* Интерфейс выбранной кассы (Синий текст, как на скрине) */}
      <div className="mb-8">
        <h2 className="text-2xl font-black text-blue-600 mb-1">{activeRegister.name}</h2>
        <p className="text-sm font-medium text-gray-500">
          Текущий баланс в этой кассе: <span className="font-bold text-slate-800">{activeRegister.balance.toLocaleString('ru-RU')} ₽</span>
        </p>
      </div>

      <div className="flex flex-col items-center justify-center h-48 text-center text-gray-400">
        <span className="text-5xl mb-4">🍽️</span>
        <p>Очередь заказов для этой кассы</p>
      </div>

    </div>
  );
}