'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import fs from 'fs'

/**
 * Обновление ссылки на Google Таблицу контактов
 */
export async function updateContactsUrl(url: string) {
  try {
    await prisma.systemConfig.upsert({
      where: { key: 'contacts_url' },
      update: { value: url },
      create: { key: 'contacts_url', value: url }
    });
    revalidatePath('/admin');
    revalidatePath('/contacts');
    return { success: true };
  } catch (error) {
    console.error("Error updating contacts URL:", error);
    return { success: false };
  }
}

/**
 * Обновление ссылки на Google Таблицу ингредиентов
 */
export async function updateIngredientsUrl(url: string) {
  try {
    await prisma.systemConfig.upsert({
      where: { key: 'ingredients_url' },
      update: { value: url },
      create: { key: 'ingredients_url', value: url }
    });
    revalidatePath('/admin');
    revalidatePath('/ingredients');
    return { success: true };
  } catch (error) {
    console.error("Error updating ingredients URL:", error);
    return { success: false };
  }
}

/**
 * Обновление ссылки на Google Таблицу тестов
 */
export async function updateTestsUrl(url: string) {
  try {
    await prisma.systemConfig.upsert({
      where: { key: 'tests_url' },
      update: { value: url },
      create: { key: 'tests_url', value: url }
    });
    revalidatePath('/admin');
    revalidatePath('/tests');
    return { success: true };
  } catch (error) {
    console.error("Error updating tests URL:", error);
    return { success: false };
  }
}

/**
 * Загрузка PDF-файла градации нарушений
 */
export async function uploadViolationsPdf(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    
    if (!file || file.size === 0) {
      return { success: false, error: "Файл не выбран или пуст" };
    }

    // Проверка формата
    if (file.type !== 'application/pdf') {
      return { success: false, error: "Допускаются только PDF файлы" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const publicDir = path.join(process.cwd(), 'public');
    
    // ПРОВЕРКА: Создаем папку public, если её вдруг нет (важно для контейнеров/хостинга)
    if (!fs.existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true });
    }

    const filePath = path.join(publicDir, 'violations.pdf');

    // ЗАПИСЬ: Сохраняем файл на диск
    await writeFile(filePath, buffer);

    // БД: Пытаемся обновить метку времени (оборачиваем в отдельный блок, чтобы P1001 не «ломал» всё)
    try {
      await prisma.systemConfig.upsert({
        where: { key: 'violations_updated_at' },
        update: { value: new Date().toISOString() },
        create: { key: 'violations_updated_at', value: new Date().toISOString() }
      });
    } catch (dbError) {
      console.warn("⚠️ Файл записан, но БД недоступна для обновления метки:", dbError);
      // Не возвращаем ошибку, так как файл физически уже на месте
    }

    revalidatePath('/admin');
    revalidatePath('/violations');

    return { success: true };
  } catch (error: any) {
    console.error("❌ Критическая ошибка при загрузке:", error);
    return { success: false, error: error.message || "Ошибка сервера при обработке файла" };
  }
}