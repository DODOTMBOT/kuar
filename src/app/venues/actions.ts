// src/app/venues/actions.ts
"use server";

import { prisma as db } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// Создание нового заведения
export async function createVenue(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("kuar_session")?.value;

  if (!userId) {
    throw new Error("Не авторизован");
  }

  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const login = formData.get("login") as string;
  const password = formData.get("password") as string;

  if (!name || !address || !login || !password) {
    throw new Error("Все поля обязательны для заполнения");
  }

  const existingVenue = await db.venue.findUnique({
    where: { login },
  });

  if (existingVenue) {
    throw new Error("Этот логин уже занят другим заведением");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.venue.create({
    data: {
      name,
      address,
      login,
      password: hashedPassword,
      ownerId: userId,
    },
  });

  revalidatePath("/venues");
}

// Добавление новой кассы к заведению
export async function createRegister(formData: FormData) {
  const venueId = formData.get("venueId") as string;
  const name = formData.get("name") as string;

  if (!venueId || !name) {
    throw new Error("Не указано название кассы или заведение");
  }

  // Создаем новую кассу и привязываем её к заведению
  await db.cashRegister.create({
    data: { name, venueId },
  });

  revalidatePath("/venues");
}