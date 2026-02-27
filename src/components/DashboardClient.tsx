"use client";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import Link from 'next/link';
import Sidebar from "./Sidebar";

interface DashboardProps {
  userName: string;
  companyName: string;
  userRole: string;
  logoutAction: () => void;
}

export default function DashboardClient({ userName, companyName, userRole, logoutAction }: DashboardProps) {
  const isSuperAdmin = userRole === 'superadmin';

  const modules = [
    { id: 'contacts', title: '📞 Контакты', desc: 'База всех пиццерий', color: 'bg-[#FF5500]', href: '/contacts' },
    { id: 'ingredients', title: '🥗 Составы', desc: 'Требования к ингредиентам', color: 'bg-slate-800', href: '/ingredients' },
    { id: 'violations', title: '🚨 Нарушения', desc: 'Градация и стандарты', color: 'bg-red-500', href: '/violations' },
    { id: 'tests', title: '🧪 Тесты', desc: 'Свод актуальных тестов', color: 'bg-blue-500', href: '/tests' },
    ...(isSuperAdmin ? [{ id: 'admin', title: '⚙️ Админ', desc: 'Настройки системы', color: 'bg-slate-900', href: '/admin' }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-black">
      {/* Подключаем боковое меню */}
      <Sidebar userName={userName} companyName={companyName} logoutAction={logoutAction} />

      {/* Основной контент (сдвигаем на ширину меню на десктопе) */}
      <main className="flex-1 md:ml-64 p-8 md:p-12">
        <header className="max-w-6xl mx-auto mb-16">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Главная панель</h1>
          <p className="text-slate-500 font-medium mt-2">Выберите модуль для работы</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {modules.map((m) => (
            <Card 
              key={m.id} isPressable as={Link} href={m.href} 
              className="border-none shadow-sm hover:shadow-lg transition-all bg-white rounded-[2rem] p-2"
            >
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