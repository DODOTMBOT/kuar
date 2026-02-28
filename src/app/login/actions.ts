"use server";

import { prisma as db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs"; 

// Принимаем либо FormData, либо обычный объект (если вы шлете JSON)
export async function loginUser(payload: FormData | { email?: string, password?: string }) {
  let identifier = "";
  let password = "";

  // Проверяем тип пришедших данных и безопасно извлекаем значения
  if (payload instanceof FormData) {
    identifier = (payload.get("email") as string) || "";
    password = (payload.get("password") as string) || "";
  } else {
    identifier = payload.email || "";
    password = payload.password || "";
  }

  if (!identifier || !password) {
    throw new Error("Не заполнены все поля");
  }

  // 1. ИЩЕМ ПАРТНЕРА (User) по email
  const user = await db.user.findUnique({
    where: { email: identifier }
  });

  if (user) {
    // ВАШ СТАРЫЙ КОД (если для юзеров пароль не хэшировался)
    if (user.password !== password) {
      throw new Error("AUTH_FAILED");
    }

    const cookieStore = await cookies();
    // Обычная кука для партнера
    cookieStore.set("kuar_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    });

    // Редирект должен быть вне блоков try/catch или if, если он внутри функции server action
    return redirect("/");
  }

  // 2. ИЩЕМ ЗАВЕДЕНИЕ (Venue) по логину
  const venue = await db.venue.findUnique({
    where: { login: identifier }
  });

  if (venue) {
    // Для заведений мы хэшировали пароль при создании, поэтому используем bcrypt.compare
    const isPasswordValid = await bcrypt.compare(password, venue.password);

    if (!isPasswordValid) {
      throw new Error("AUTH_FAILED");
    }

    const cookieStore = await cookies();
    // Добавляем префикс "venue_", чтобы система понимала, что зашел не владелец, а точка
    cookieStore.set("kuar_session", `venue_${venue.id}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    return redirect("/"); 
  }

  // 3. Если ни партнера, ни заведения не найдено
  throw new Error("AUTH_FAILED");
}

export async function logout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("kuar_session");
  redirect("/login");
}