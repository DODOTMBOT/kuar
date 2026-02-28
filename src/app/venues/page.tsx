// src/app/venues/page.tsx
import { prisma as db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { createVenue } from "./actions";
import { logout } from "@/app/login/actions"; // Берем ваш логаут

export default async function VenuesPage() {
  const cookieStore = await cookies();
  // ИСПРАВЛЕНО: имя куки kuar_session
  const userId = cookieStore.get("kuar_session")?.value;

  if (!userId) {
    redirect("/login");
  }

  // Получаем пользователя и его заведения
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      venues: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  // БЛОКИРОВКА: Если данные не заполнены и пользователь не админ
  if (user.role === 'owner' && !user.isSetupCompleted) {
    redirect('/setup');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        userName={user.firstName}
        companyName={user.company}
        logoutAction={logout}
      />

      <main className="flex-1 p-8 md:ml-64">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Управление заведениями</h1>

          {/* Форма добавления точки */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Добавить новую точку</h2>
            
            <form action={createVenue} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Название заведения</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="Например: Кофейня на Ленина" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Адрес</label>
                <input 
                  type="text" 
                  name="address" 
                  required 
                  className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="ул. Ленина, д. 10" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Логин для входа</label>
                <input 
                  type="text" 
                  name="login" 
                  required 
                  className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="point1_login" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Пароль</label>
                <input 
                  type="password" 
                  name="password" 
                  required 
                  className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="••••••••" 
                />
              </div>
              <div className="md:col-span-2 pt-2">
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Создать точку
                </button>
              </div>
            </form>
          </div>

          {/* Список заведений */}
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Ваши точки ({user.venues.length})
          </h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 font-medium text-gray-600 text-sm">Название</th>
                  <th className="p-4 font-medium text-gray-600 text-sm">Адрес</th>
                  <th className="p-4 font-medium text-gray-600 text-sm">Логин для точки</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {user.venues.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-400">
                      У вас еще нет добавленных заведений
                    </td>
                  </tr>
                ) : (
                  user.venues.map((venue: any) => (
                    <tr key={venue.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 font-medium text-gray-800">{venue.name}</td>
                      <td className="p-4 text-gray-600 text-sm">{venue.address}</td>
                      <td className="p-4 text-gray-500 text-sm font-mono bg-gray-50/50">{venue.login}</td>
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