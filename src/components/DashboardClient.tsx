"use client";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import Link from 'next/link';

// Интерфейс для пропсов
interface DashboardProps {
  userName: string;
  userRole: string;
  venueName: string;
  logoutAction: () => void;
}

export default function DashboardClient({ userName, userRole, venueName, logoutAction }: DashboardProps) {
  const isSuperAdmin = userRole === 'superadmin';

  const modules = [
    // Модуль: Контакты пиццерий
    { 
      id: 'contacts', 
      title: '📞 Контакты', 
      desc: 'Контактные данные всех пиццерий сети', 
      color: 'bg-[#FF5500]', 
      href: '/contacts' 
    },
    // Модуль: Требования к ингредиентам
    { 
      id: 'ingredients', 
      title: '🥗 Требования', 
      desc: 'Требования к ингредиентам Евразия', 
      color: 'bg-purple-600', 
      href: '/ingredients' 
    },
    // Модуль: Градация нарушений
    { 
      id: 'violations', 
      title: '🚨 Градация', 
      desc: 'Поиск по базе нарушений из презентации', 
      color: 'bg-red-500', 
      href: '/violations' 
    },
    // НОВЫЙ МОДУЛЬ: Свод тестов
    { 
      id: 'tests', 
      title: '🧪 Тесты', 
      desc: 'Свод актуальных тестов в пиццериях', 
      color: 'bg-blue-500', 
      href: '/tests' 
    },
    // Модуль админки (только для супер-админа)
    ...(isSuperAdmin ? [{ 
      id: 'admin', 
      title: '⚙️ Админ', 
      desc: 'Управление системой и ссылками', 
      color: 'bg-slate-800', 
      href: '/admin' 
    }] : []),
    { 
      id: 'check', 
      title: '📋 Чек-листы', 
      desc: 'Цифровые стандарты и проверки', 
      color: 'bg-slate-100', 
      text: 'text-slate-400', 
      href: '#' 
    },
    { 
      id: 'market', 
      title: '🛒 Маркет', 
      desc: 'Закупки и складской учет', 
      color: 'bg-slate-100', 
      text: 'text-slate-400', 
      href: '#' 
    },
  ];

  return (
    <main className="min-h-screen bg-white p-6 md:p-12 font-sans text-black">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-20">
        <div>
          <h1 className="text-6xl font-black text-[#FF5500] tracking-tighter uppercase">DODOBOT</h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-[#121212] font-black text-xl tracking-tight">{venueName}</p>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
            <p className="text-[#00A3FF] font-bold text-lg">{userName}</p>
            {isSuperAdmin && (
              <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-black uppercase rounded-md">Admin</span>
            )}
          </div>
        </div>
        <Button onPress={logoutAction} variant="light" className="font-black text-red-500 text-lg hover:bg-red-50 rounded-2xl transition-colors">
          Выйти
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {modules.map((m) => (
          <Card 
            key={m.id} 
            isPressable 
            as={Link} 
            href={m.href} 
            className="border-none shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] transition-all bg-white rounded-[2.5rem] group"
          >
            <CardHeader className="flex gap-4 p-8">
              <div className={`w-16 h-16 rounded-[1.5rem] ${m.color} flex items-center justify-center text-3xl text-white shadow-inner`}>
                {m.title.split(' ')[0]}
              </div>
              <div className="flex flex-col text-left justify-center">
                <p className="text-2xl font-black text-[#121212] group-hover:text-[#FF5500] transition-colors">{m.title.split(' ')[1]}</p>
                <p className="text-[10px] text-slate-300 uppercase font-black tracking-widest mt-1">Модуль системы</p>
              </div>
            </CardHeader>
            <CardBody className="px-8 pb-10 pt-0">
              <p className={`${m.text || 'text-slate-500'} font-bold leading-relaxed`}>{m.desc}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </main>
  );
}