// src/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";

interface SidebarProps {
  userName: string;
  companyName: string;
  logoutAction: () => void;
  userType?: "owner" | "venue"; // Добавляем тип пользователя (по умолчанию "owner")
}

// 1. Меню для партнера (владельца бизнеса)
const OWNER_MENU_ITEMS = [
  { name: "Дашборд", path: "/", icon: "📊" },
  { name: "Касса", path: "/cash", icon: "💰" },
  { name: "Курьеры", path: "/couriers", icon: "🛵" },
  { name: "Заведения", path: "/venues", icon: "🏪" },
  { name: "Интеграции", path: "/integrations", icon: "🔗" },
  { name: "Личный кабинет", path: "/profile", icon: "👤" },
];

// 2. Меню для рабочего терминала (конкретной точки)
const VENUE_MENU_ITEMS = [
  { name: "Терминал", path: "/terminal", icon: "💻" },
  { name: "Заказы", path: "/terminal/orders", icon: "📦" }, // Будущие разделы точки
  { name: "Настройки точки", path: "/terminal/settings", icon: "⚙️" },
];

export default function Sidebar({ userName, companyName, logoutAction, userType = "owner" }: SidebarProps) {
  const pathname = usePathname();

  // Выбираем, какое меню показать
  const menuItems = userType === "venue" ? VENUE_MENU_ITEMS : OWNER_MENU_ITEMS;

  return (
    <aside className="w-64 bg-white border-r border-slate-100 h-screen fixed left-0 top-0 hidden md:flex flex-col justify-between z-50">
      
      <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
        <div className="mb-12">
          {/* Можно даже менять логотип/заголовок для точки, но пока оставим общий */}
          <h2 className="text-3xl font-black text-[#FF5500] tracking-tighter uppercase">DODOBOT</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {userType === "venue" ? "Work Terminal" : "SaaS Platform"}
          </p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(`${item.path}/`));
            
            return (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                  isActive 
                    ? "bg-slate-100 text-slate-900 font-bold" 
                    : "text-slate-500 font-medium hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-slate-50 shrink-0">
        <div className="bg-slate-50 rounded-2xl p-4 mb-4">
          <p className="text-xs font-bold text-slate-800 truncate" title={userName}>
            {userName}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate" title={companyName}>
            {companyName}
          </p>
        </div>
        
        <Button 
          onPress={logoutAction} 
          variant="light" 
          className="w-full justify-start text-red-500 font-bold text-sm px-4"
        >
          🚪 Завершить смену
        </Button>
      </div>
      
    </aside>
  );
}