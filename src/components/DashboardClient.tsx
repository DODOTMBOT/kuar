"use client";
import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import Link from 'next/link';

interface DashboardProps {
  userName: string;
  userRole: string;
  venueName: string;
  logoutAction: () => void;
}

export default function DashboardClient({ userName, userRole, venueName, logoutAction }: DashboardProps) {
  const isSuperAdmin = userRole === 'superadmin';

  const modules = [
    { id: 'contacts', title: '📞 Контакты', desc: 'База всех пиццерий', color: 'bg-[#FF5500]', href: '/contacts' },
    { id: 'ingredients', title: '🥗 Составы', desc: 'Требования к ингредиентам', color: 'bg-purple-600', href: '/ingredients' },
    { id: 'violations', title: '🚨 Нарушения', desc: 'Градация и стандарты', color: 'bg-red-500', href: '/violations' },
    { id: 'tests', title: '🧪 Тесты', desc: 'Свод актуальных тестов', color: 'bg-blue-500', href: '/tests' },
    ...(isSuperAdmin ? [{ id: 'admin', title: '⚙️ Админ', desc: 'Настройки системы', color: 'bg-slate-800', href: '/admin' }] : []),
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans text-black">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-20">
        <div>
          <div className="flex items-center gap-3 mt-4">
            <p className="text-[#121212] font-black text-xl">{venueName}</p>
            <Chip size="sm" variant="flat" color="primary" className="font-bold">{userName}</Chip>
            {isSuperAdmin && <Chip size="sm" color="secondary" className="font-black uppercase text-[10px]">Admin</Chip>}
          </div>
        </div>
        <Button onPress={logoutAction} variant="light" className="font-black text-red-500 hover:bg-red-50 rounded-2xl">Выйти</Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {modules.map((m) => (
          <Card 
            key={m.id} isPressable as={Link} href={m.href} 
            className="border-none shadow-sm hover:shadow-xl transition-all bg-white rounded-[2.5rem] p-4"
          >
            <CardHeader className="flex gap-4 p-6">
              <div className={`w-14 h-14 rounded-2xl ${m.color} flex items-center justify-center text-2xl text-white shadow-lg`}>
                {m.title.split(' ')[0]}
              </div>
              <div className="text-left">
                <p className="text-xl font-black text-[#121212]">{m.title.split(' ')[1]}</p>
                <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Модуль</p>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-8 pt-0">
              <p className="text-slate-500 font-bold text-sm leading-relaxed">{m.desc}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </main>
  );
}