"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";

interface SidebarProps {
  userName: string;
  companyName: string;
  logoutAction: () => void;
}

export default function Sidebar({ userName, companyName, logoutAction }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Дашборд", path: "/", icon: "📊" },
    { name: "Свод тестов", path: "/tests", icon: "🧪" },
    { name: "База контакты", path: "/contacts", icon: "📞" },
    { name: "Ингредиенты", path: "/ingredients", icon: "🥗" },
    { name: "Личный кабинет", path: "/profile", icon: "👤" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 h-screen fixed left-0 top-0 flex flex-col justify-between hidden md:flex z-50">
      <div className="p-8">
        <div className="mb-12">
          <h2 className="text-3xl font-black text-[#FF5500] tracking-tighter uppercase">DODOBOT</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">SaaS Platform</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} className="block">
                <div className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                  isActive 
                    ? "bg-slate-100 text-slate-900 font-bold" 
                    : "text-slate-500 font-medium hover:bg-slate-50 hover:text-slate-700"
                }`}>
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-slate-50">
        <div className="bg-slate-50 rounded-2xl p-4 mb-4">
          <p className="text-xs font-bold text-slate-800 truncate">{userName}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">{companyName}</p>
        </div>
        <Button 
          onPress={logoutAction} 
          variant="light" 
          className="w-full justify-start text-red-500 font-bold text-sm px-4"
        >
          🚪 Выйти из аккаунта
        </Button>
      </div>
    </aside>
  );
}