import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { logout } from "@/app/login/actions";
import ProfileClient from "@/components/ProfileClient";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('kuar_session')?.value;

  if (!userId) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    redirect('/login');
  }

  // Если не прошел настройку, отправляем туда
  if (user.role === 'owner' && !user.isSetupCompleted) {
    redirect('/setup');
  }

  return <ProfileClient user={user} logoutAction={logout} />;
}