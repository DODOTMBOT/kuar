import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import DashboardClient from "@/components/DashboardClient";
import LandingClient from "@/components/LandingClient";
import { logout } from "@/app/login/actions";

export default async function Home() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('kuar_session')?.value;

  let user = null;

  if (userId) {
    // Оборачиваем запрос к базе в try...catch
    try {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: { venues: true }
      });
    } catch (error) {
      console.error("🚨 База данных Timeweb недоступна на главной странице (P1001):", error);
    }
  }

  // Если юзера нет или база данных недоступна — показываем лендинг
  if (!user) {
    return <LandingClient />;
  }

  // Если всё ок, пускаем в дашборд
  return (
    <DashboardClient 
      userName={user.name} 
      userRole={user.role} 
      venueName={user.venues?.[0]?.name || "Без локации"} 
      logoutAction={logout}
    />
  );
}