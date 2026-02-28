// src/app/page.tsx
import { prisma as db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";
import { logout } from "@/app/login/actions";

export default async function Home() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("kuar_session")?.value;

  if (!sessionValue) {
    redirect("/login");
  }

  // Если это заведение (точка), отправляем в её собственный раздел
  if (sessionValue.startsWith("venue_")) {
    redirect("/terminal");
  }

  // --- Ниже логика только для ПАРТНЕРА ---
  const user = await db.user.findUnique({
    where: { id: sessionValue },
    include: { 
      venues: {
        include: { registers: true } // <--- ИСПРАВЛЕНО: обязательно подтягиваем кассы для подсчета баланса
      } 
    }
  });

  if (!user) {
    redirect("/login");
  }

  // Блокируем доступ, если профиль не дозаполнен
  if (user.role === "owner" && !user.isSetupCompleted) {
    redirect("/setup");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardClient 
        userName={user.firstName} 
        userRole={user.role} 
        companyName={user.company} 
        venues={user.venues} // Передаем заведения (уже вместе с их кассами)
        logoutAction={logout} 
      />
    </div>
  );
}