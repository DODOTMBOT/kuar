"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface TestItem {
  name: string;
  owner: string;
  description: string;
  venues: string;
  status: string;
  startDate: string;
  endDate: string;
}

export default function TestsClient({ tests }: { tests: TestItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Все");

  const uniqueStatuses = useMemo(() => {
    const statuses = tests.map(t => t.status).filter(Boolean);
    return ["Все", ...Array.from(new Set(statuses))];
  }, [tests]);

  const filteredTests = useMemo(() => {
    return tests.filter((t) => {
      const matchesSearch = !searchQuery.trim() ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.venues.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesStatus = statusFilter === "Все" || t.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, tests]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-black">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black italic uppercase leading-none">СВОД ТЕСТОВ</h1>
            <p className="text-slate-400 font-bold text-[10px] tracking-widest mt-2 uppercase">
              Актуальные тесты в пиццериях
            </p>
          </div>
          <Link href="/" className="font-bold text-[#00A3FF] hover:underline text-sm">
            ← В дашборд
          </Link>
        </header>

        {/* Блок фильтров и поиска */}
        <div className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Поиск по названию, пиццерии или владельцу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 text-base border-none shadow-sm rounded-2xl focus:ring-2 focus:ring-black outline-none transition-shadow bg-white"
          />
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {uniqueStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors ${
                    statusFilter === status 
                      ? 'bg-black text-white shadow-md' 
                      : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            {/* Общее количество тестов */}
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Отображено тестов: <span className="text-black">{filteredTests.length}</span>
            </div>
          </div>
        </div>

        {/* Сетка карточек с тестами */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTests.length > 0 ? (
            filteredTests.map((test, idx) => {
              
              const st = test.status.toLowerCase();
              let statusClass = "bg-amber-100 text-amber-700"; 
              if (st.includes('запущен')) statusClass = "bg-green-100 text-green-700";
              if (st.includes('завершен')) statusClass = "bg-slate-200 text-slate-500";

              const venuesCount = test.venues.split('\n').filter(v => v.trim() !== "").length;

              return (
                <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow">
                  
                  {/* Шапка карточки (Статус и Даты в одну строку) */}
                  <div className="flex justify-between items-center mb-5 gap-3">
                    <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-wider rounded-md whitespace-nowrap ${statusClass}`}>
                      {test.status || "Нет статуса"}
                    </span>
                    
                    <div className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                      {test.startDate || "—"} {test.endDate ? `— ${test.endDate}` : ""}
                    </div>
                  </div>
                  
                  {/* Оунер (Яркий бейдж СТРОГО над заголовком) */}
                  <div className="mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#00A3FF] text-white rounded-md text-[9px] font-black uppercase tracking-widest shadow-sm">
                      <svg className="w-3 h-3 opacity-90" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                      {test.owner || "Не указан"}
                    </span>
                  </div>

                  {/* Основная инфа */}
                  <h2 className="text-base font-black leading-tight mb-3">
                    {test.name}
                  </h2>

                  {/* Описание (теперь из колонки I) */}
                  <p className="text-xs text-slate-500 mb-4 flex-grow line-clamp-4 hover:line-clamp-none transition-all cursor-pointer" title="Нажми, чтобы развернуть текст">
                    {test.description || "Нет описания"}
                  </p>
                  
                  {/* Выпадающий список локаций (прижат к низу благодаря flex-grow у описания) */}
                  <div className="bg-slate-50 p-3 rounded-xl mt-auto">
                    <details className="group">
                      <summary className="text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer list-none flex justify-between items-center">
                        <span>Где проходит ({venuesCount})</span>
                        <span className="text-[#00A3FF] group-open:rotate-180 transition-transform text-xs">▼</span>
                      </summary>
                      <div className="mt-2 text-xs font-medium text-slate-600 whitespace-pre-wrap max-h-32 overflow-y-auto custom-scrollbar">
                        {test.venues || "Локации не указаны"}
                      </div>
                    </details>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center text-slate-400 font-medium">
              По вашему запросу тесты не найдены 🤷‍♂️
            </div>
          )}
        </div>
      </div>
    </main>
  );
}