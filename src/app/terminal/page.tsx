// src/app/terminal/page.tsx
import { prisma as db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TerminalClient from "@/components/TerminalClient"; // Подключаем нашу кассу
import { logout } from "@/app/login/actions";

export default async function TerminalPage() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("kuar_session")?.value;

  if (!sessionValue) redirect("/login");
  if (!sessionValue.startsWith("venue_")) redirect("/");

  const venueId = sessionValue.replace("venue_", "");
  const venue = await db.venue.findUnique({
    where: { id: venueId },
    include: { owner: true, registers: true } // Подтягиваем кассы
  });

  if (!venue) redirect("/login");

  // Подсчет "В кассах" и "Всего денег" для шапки
  const registerTotal = venue.registers.reduce((sum: number, r: any) => sum + r.balance, 0);
  const totalMoney = (venue.safeBalance || 0) + registerTotal;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userName={venue.name} companyName={venue.owner.company} logoutAction={logout} userType="venue" />

      <main className="flex-1 p-8 md:ml-64">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Касса / Прием заказов</h1>
            <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm text-sm text-gray-500 font-medium">📍 {venue.address}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#FF5500]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Всего денег</p>
              <p className="text-3xl font-black text-slate-800">{totalMoney.toLocaleString('ru-RU')} ₽</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">В сейфе</p>
              <p className="text-3xl font-black text-slate-800">{(venue.safeBalance || 0).toLocaleString('ru-RU')} ₽</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">В кассах</p>
              <p className="text-3xl font-black text-slate-800">{registerTotal.toLocaleString('ru-RU')} ₽</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Отрисовываем наши кассы с переключателями */}
            <TerminalClient registers={venue.registers} />

            <div className="flex flex-col gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Действия</h2>
                <button className="w-full bg-[#FF5500] hover:bg-[#FF5500]/90 text-white font-bold py-3 rounded-lg transition-colors mb-3">+ Новый заказ</button>
                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-lg transition-colors">Вызвать курьера</button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}