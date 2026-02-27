import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ContactsClient from "@/components/ContactsClient";

export default async function ContactsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('kuar_session')?.value;

  if (!userId) redirect('/login');

  const config = await prisma.systemConfig.findUnique({
    where: { key: 'contacts_url' }
  });
  
  let rawUrl = config?.value || "";
  let finalUrl = rawUrl;

  // Конвертируем ссылку Google Таблицы в прямой CSV экспорт
  if (rawUrl.includes("docs.google.com/spreadsheets")) {
    finalUrl = rawUrl.replace(/\/edit.*$/, "/export?format=csv");
  }

  return (
    <ContactsClient dataUrl={finalUrl} />
  );
}