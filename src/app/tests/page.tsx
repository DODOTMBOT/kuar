import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Papa from "papaparse";
import TestsClient from "@/components/TestsClient";

export default async function TestsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('kuar_session')?.value;
  if (!userId) redirect('/login');

  let config = null;

  try {
    config = await prisma.systemConfig.findUnique({
      where: { key: 'tests_url' }
    });
  } catch (error) {
    console.error("🚨 Ошибка подключения к базе данных Timeweb (P1001):", error);
  }

  if (!config || !config.value) {
    return (
      <div className="p-10 text-center font-sans">
        <h1 className="text-2xl font-bold mb-2">Тесты пока не загружены</h1>
        <p className="text-gray-500">Администратору нужно добавить ссылку на таблицу в панели управления. Либо база данных временно недоступна.</p>
      </div>
    );
  }

  let testsData: any[] = [];

  try {
    let fetchUrl = config.value;
    
    if (fetchUrl.includes('/edit')) {
      fetchUrl = fetchUrl.replace(/\/edit.*$/, '/export?format=csv');
    }

    const res = await fetch(fetchUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error("Не удалось скачать таблицу");
    const csvText = await res.text();

    const parsed = Papa.parse(csvText, { skipEmptyLines: true });
    const rows = parsed.data as string[][];
    
    let headerIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      const col0 = (rows[i][0] || "").replace(/\s+/g, '').toLowerCase();
      const col1 = (rows[i][1] || "").replace(/\s+/g, '').toLowerCase();
      
      if (col0.includes("чтотестируе") || col1.includes("продуктоунер")) {
        headerIndex = i;
        break;
      }
    }

    if (headerIndex !== -1 && headerIndex < rows.length - 1) {
      testsData = rows.slice(headerIndex + 1).map((row) => ({
        name: row[0] || "",
        owner: row[1] || "",
        venues: row[4] || "",
        status: row[5] || "",
        startDate: row[6] || "",
        endDate: row[7] || "",
        description: row[8] || "", // <-- ТЯНЕМ ИЗ СТОЛБЦА I (индекс 8)
      })).filter(test => test.name.trim() !== ""); 
    }

  } catch (error) {
    console.error("Ошибка при парсинге тестов:", error);
  }

  return (
    <TestsClient tests={testsData} />
  );
}