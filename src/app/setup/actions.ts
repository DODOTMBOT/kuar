'use server'

import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function completeSetup(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('kuar_session')?.value;

  if (!userId) throw new Error("Unauthorized");

  const data = {
    venuesCount: parseInt(formData.get("venuesCount") as string),
    respName: formData.get("respName") as string,
    respLastName: formData.get("respLastName") as string,
    respPhone: formData.get("respPhone") as string,
    respEmail: formData.get("respEmail") as string,
    inn: formData.get("inn") as string,
    ogrn: formData.get("ogrn") as string,
    legalAddress: formData.get("legalAddress") as string,
    bankAccount: formData.get("bankAccount") as string,
    bik: formData.get("bik") as string,
    isSetupCompleted: true // Помечаем, что настройка завершена
  };

  await prisma.user.update({
    where: { id: userId },
    data: data
  });

  redirect('/');
}