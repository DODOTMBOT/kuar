"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function registerPartner(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const company = formData.get("company") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Базовая валидация
  if (!firstName || !lastName || !company || !email || !password) {
    throw new Error("FILL_ALL_FIELDS");
  }

  if (password !== confirmPassword) {
    throw new Error("PASSWORDS_DONT_MATCH");
  }

  // Проверка уникальности email
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    throw new Error("USER_EXISTS");
  }

  // Создание пользователя в БД
  await prisma.user.create({
    data: {
      firstName,
      lastName,
      company,
      email,
      password, // Позже сюда стоит добавить bcrypt
    },
  });

  // После успешной регистрации отправляем на страницу логина
  redirect("/login");
}