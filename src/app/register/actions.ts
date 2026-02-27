'use server'

import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export async function registerPartner(formData: any) {
  // 1. Валидация совпадения паролей
  if (formData.password !== formData.confirmPassword) {
    throw new Error("PASSWORDS_DONT_MATCH")
  }

  // 2. Проверка уникальности email
  const existingUser = await prisma.user.findUnique({
    where: { email: formData.email }
  })
  if (existingUser) throw new Error("USER_EXISTS")

  try {
    // 3. Создаем пользователя
    const user = await prisma.user.create({
      data: {
        email: formData.email,
        password: formData.password, 
        name: formData.name,
        lastName: formData.lastName,
      }
    })

    // 4. Создаем ресторан (venueType и city пока ставим дефолтные)
    await prisma.venue.create({
      data: {
        name: formData.venueName,
        type: "restaurant",
        city: "Не указан",
        ownerId: user.id,
      }
    })

    // 5. Создаем сессию
    const cookieStore = await cookies()
    cookieStore.set('kuar_session', user.id, { httpOnly: true, secure: true })

  } catch (error) {
    console.error("Database error:", error)
    throw new Error("DB_ERROR")
  }

  redirect('/')
}