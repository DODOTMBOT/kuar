import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import IngredientsClient from "@/components/IngredientsClient";

export default async function IngredientsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('kuar_session')?.value;

  // Проверка авторизации
  if (!userId) redirect('/login');

  // Получаем ссылку на таблицу ингредиентов из настроек системы
  const config = await prisma.systemConfig.findUnique({ 
    where: { key: 'ingredients_url' } 
  });
  
  let rawUrl = config?.value || "";
  let finalUrl = rawUrl;

  // Преобразуем стандартную ссылку Google Таблицы в формат для экспорта CSV
  if (rawUrl.includes("docs.google.com/spreadsheets")) {
    finalUrl = rawUrl.replace(/\/edit.*$/, "/export?format=csv");
  }

  return (
    <IngredientsClient dataUrl={finalUrl} />
  );
}