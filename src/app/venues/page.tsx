// src/app/venues/page.tsx
import { prisma as db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { createVenue, createRegister } from "./actions"; // Подключили новый экшен
import { logout } from "@/app/login/actions";

export default async function VenuesPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("kuar_session")?.value;

  if (!userId) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      venues: {
        orderBy: { createdAt: "desc" },
        include: { registers: true } // <--- Теперь мы подтягиваем кассы из БД
      }
    }
  });

  if (!user) redirect("/login");
  if (user.role === 'owner' && !user.isSetupCompleted) redirect('/setup');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userName={user.firstName} companyName={user.company} logoutAction={logout} />

      <main className="flex-1 p-8 md:ml-64">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Управление заведениями</h1>

          {/* Форма добавления точки (Осталась без изменений) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 max-w-4xl">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Добавить новую точку</h2>
            <form action={createVenue} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm text-gray-600 mb-1">Название заведения</label><input type="text" name="name" required className="w-full border p-2.5 rounded-lg" placeholder="Например: Кофейня на Ленина" /></div>
              <div><label className="block text-sm text-gray-600 mb-1">Адрес</label><input type="text" name="address" required className="w-full border p-2.5 rounded-lg" placeholder="ул. Ленина, д. 10" /></div>
              <div><label className="block text-sm text-gray-600 mb-1">Логин для входа</label><input type="text" name="login" required className="w-full border p-2.5 rounded-lg" placeholder="point1_login" /></div>
              <div><label className="block text-sm text-gray-600 mb-1">Пароль</label><input type="password" name="password" required className="w-full border p-2.5 rounded-lg" placeholder="••••••••" /></div>
              <div className="md:col-span-2 pt-2"><button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700">Создать точку</button></div>
            </form>
          </div>

          <h2 className="text-lg font-semibold mb-4 text-gray-700">Ваши точки ({user.venues.length})</h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 font-medium text-gray-600 text-sm">Название</th>
                  <th className="p-4 font-medium text-gray-600 text-sm">Логин / Адрес</th>
                  <th className="p-4 font-medium text-gray-600 text-sm">Кассы заведения</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {user.venues.length === 0 ? (
                  <tr><td colSpan={3} className="p-8 text-center text-gray-400">Нет заведений</td></tr>
                ) : (
                  user.venues.map((venue: any) => (
                    <tr key={venue.id} className="hover:bg-gray-50/50 transition align-top">
                      <td className="p-4 font-medium text-gray-800">{venue.name}</td>
                      <td className="p-4">
                        <div className="text-gray-500 text-sm font-mono mb-1">{venue.login}</div>
                        <div className="text-gray-400 text-xs">{venue.address}</div>
                      </td>
                      <td className="p-4">
                        {/* Список касс точки */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {venue.registers.map((r: any) => (
                            <span key={r.id} className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                              {r.name}
                            </span>
                          ))}
                        </div>
                        {/* Форма добавления новой кассы */}
                        <form action={createRegister} className="flex gap-2">
                          <input type="hidden" name="venueId" value={venue.id} />
                          <input type="text" name="name" required placeholder="Название кассы" className="border border-gray-200 text-xs p-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 w-36" />
                          <button type="submit" className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-3 rounded-lg transition-colors">+</button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}