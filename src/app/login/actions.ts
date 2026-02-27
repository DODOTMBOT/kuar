'use server'

import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export async function loginUser(formData: any) {
  const user = await prisma.user.findUnique({
    where: { email: formData.email }
  })

  if (!user || user.password !== formData.password) {
    throw new Error("AUTH_FAILED")
  }

  // Устанавливаем куку
  const cookieStore = await cookies()
  cookieStore.set('kuar_session', user.id, { httpOnly: true, secure: true })

  redirect('/')
}

// Добавим функцию выхода
export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('kuar_session')
  redirect('/')
}