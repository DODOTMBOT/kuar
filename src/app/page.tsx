import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import DashboardClient from "@/components/DashboardClient";
import LandingClient from "@/components/LandingClient";
import { logout } from "@/app/login/actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('kuar_session')?.value;

  let user = null;

  if (userId) {
    try {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: { venues: true }
      });
    } catch (error) {
      console.error("🚨 Ошибка БД:", error);
    }
  }

  if (!user) {
    return <LandingClient />;
  }

  // БЛОКИРОВКА: Если данные не заполнены и пользователь не админ
  if (user.role === 'owner' && !user.isSetupCompleted) {
    redirect('/setup');
  }

  return (
    <DashboardClient 
      userName={user.firstName} 
      userRole={user.role} 
      venueName={user.venues?.[0]?.name || "Новый партнер"} 
      logoutAction={logout}
    />
  );
}