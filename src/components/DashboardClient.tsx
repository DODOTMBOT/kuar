// src/components/DashboardClient.tsx
"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import Link from 'next/link';
import Sidebar from "./Sidebar";

interface Venue {
  id: string;
  name: string;
  safeBalance: number;
  registers: { balance: number }[]; // Изменено: теперь кассы - это массив
}

interface DashboardProps {
  userName: string;
  companyName: string;
  userRole: string;
  venues: Venue[]; // Принимаем заведения
  logoutAction: () => void;
}

export default function DashboardClient({ userName, companyName, userRole, venues, logoutAction }: DashboardProps) {
  const isSuperAdmin = userRole === 'superadmin';
  
  // Состояние выбранного заведения (по умолчанию первое)
  const [selectedVenueId, setSelectedVenueId] = useState<string>(venues.length > 0 ? venues[0].id : "");

  // Находим активное заведение
  const activeVenue = venues.find(v => v.id === selectedVenueId);
  
  // Считаем сумму всех касс конкретного заведения
  const registerTotal = activeVenue?.registers?.reduce((sum, r) => sum + r.balance, 0) || 0;
  // Считаем общую сумму (в сейфе + во всех кассах)
  const totalMoney = activeVenue ? (activeVenue.safeBalance || 0) + registerTotal : 0;

  const modules = [
    { id: 'contacts', title: '📞 Контакты', desc: 'База всех пиццерий', color: 'bg-[#FF5500]', href: '/contacts' },
    { id: 'ingredients', title: '🥗 Составы', desc: 'Требования к ингредиентам', color: 'bg-slate-800', href: '/ingredients' },
    { id: 'violations', title: '🚨 Нарушения', desc: 'Градация и стандарты', color: 'bg-red-500', href: '/violations' },
    { id: 'tests', title: '🧪 Тесты', desc: 'Свод актуальных тестов', color: 'bg-blue-500', href: '/tests' },
    ...(isSuperAdmin ? [{ id: 'admin', title: '⚙️ Админ', desc: 'Настройки системы', color: 'bg-slate-900', href: '/admin' }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-black w-full">
      <Sidebar userName={userName} companyName={companyName} logoutAction={logoutAction} />

      <main className="flex-1 md:ml-64 p-8 md:p-12 w-full">
        <header className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Главная панель</h1>
            <p className="text-slate-500 font-medium mt-2">Сводка по заведениям и модули</p>
          </div>

          {/* Переключатель заведений (Dropdown) */}
          {venues.length > 0 && (
            <div className="bg-white border border-gray-200 p-2 rounded-xl shadow-sm flex items-center">
              <span className="text-sm font-bold text-slate-500 mr-3 px-2 uppercase tracking-widest">Точка:</span>
              <select 
                className="bg-slate-50 border-none text-slate-800 font-bold rounded-lg p-2 outline-none focus:ring-2 focus:ring-[#FF5500] cursor-pointer"
                value={selectedVenueId}
                onChange={(e) => setSelectedVenueId(e.target.value)}
              >
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          )}
        </header>

        {/* Финансы выбранного заведения */}
        {activeVenue ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#FF5500]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Всего денег</p>
              <p className="text-3xl font-black text-slate-800">{totalMoney.toLocaleString('ru-RU')} ₽</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">В сейфе</p>
              <p className="text-3xl font-black text-slate-800">{(activeVenue.safeBalance || 0).toLocaleString('ru-RU')} ₽</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">В кассах</p>
              <p className="text-3xl font-black text-slate-800">{registerTotal.toLocaleString('ru-RU')} ₽</p>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto mb-16 bg-white p-6 rounded-2xl border border-dashed border-gray-300 text-center">
            <p className="text-slate-500 font-medium">У вас пока нет добавленных заведений.</p>
            <Link href="/venues" className="text-[#FF5500] font-bold mt-2 inline-block hover:underline">Добавить заведение →</Link>
          </div>
        )}

        {/* Модули */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {modules.map((m) => (
            <Card key={m.id} isPressable as={Link} href={m.href} className="border-none shadow-sm hover:shadow-lg transition-all bg-white rounded-[2rem] p-2">
              <CardHeader className="flex gap-4 p-6">
                <div className={`w-14 h-14 rounded-2xl ${m.color} flex items-center justify-center text-2xl text-white shadow-md`}>
                  {m.title.split(' ')[0]}
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-slate-800">{m.title.split(' ')[1]}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Модуль</p>
                </div>
              </CardHeader>
              <CardBody className="px-6 pb-6 pt-0">
                <p className="text-slate-500 text-sm font-medium">{m.desc}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}