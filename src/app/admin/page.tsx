import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import AdminPanelClient from "@/components/AdminPanelClient";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('kuar_session')?.value;

  const user = userId ? await prisma.user.findUnique({
    where: { id: userId }
  }) : null;

  if (!user || user.role !== 'superadmin') {
    redirect('/');
  }

  const allUsers = await prisma.user.findMany({ include: { venues: true } });
  const allVenues = await prisma.venue.findMany({ include: { owner: true } });
  
  const contactsConfig = await prisma.systemConfig.findUnique({ where: { key: 'contacts_url' } });
  const ingredientsConfig = await prisma.systemConfig.findUnique({ where: { key: 'ingredients_url' } });
  const violationsUpdate = await prisma.systemConfig.findUnique({ where: { key: 'violations_updated_at' } });
  
  // Подтягиваем ссылку на таблицу с тестами
  const testsConfig = await prisma.systemConfig.findUnique({ where: { key: 'tests_url' } });

  return (
    <AdminPanelClient 
      users={allUsers} 
      venues={allVenues} 
      currentContactsUrl={contactsConfig?.value || ""}
      currentIngredientsUrl={ingredientsConfig?.value || ""}
      currentViolationsUpdate={violationsUpdate?.value || null}
      currentTestsUrl={testsConfig?.value || ""}
    />
  );
}