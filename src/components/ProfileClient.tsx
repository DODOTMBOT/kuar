"use client";

import React from "react";
import { Card, CardBody, Divider } from "@heroui/react";
import Sidebar from "./Sidebar";

interface ProfileClientProps {
  user: any; // В идеале тут тип из Prisma, но для простоты пока any
  logoutAction: () => void;
}

export default function ProfileClient({ user, logoutAction }: ProfileClientProps) {
  // Вспомогательный компонент для вывода поля (Метка + Значение)
  const InfoField = ({ label, value }: { label: string, value: string | number | null }) => (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-bold text-slate-800">{value || "Не указано"}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-black">
      <Sidebar userName={user.firstName} companyName={user.company} logoutAction={logoutAction} />

      <main className="flex-1 md:ml-64 p-8 md:p-12">
        <header className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Личный кабинет</h1>
          <p className="text-slate-500 font-medium mt-2">Ваши регистрационные и юридические данные</p>
        </header>

        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-sm rounded-[2rem] bg-white">
            <CardBody className="p-10 md:p-14 space-y-12">
              
              {/* Базовая информация */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500 text-xl">👤</div>
                  <h2 className="text-xl font-black text-slate-800">Основной профиль</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-6 bg-slate-50 rounded-2xl">
                  <InfoField label="Имя" value={user.firstName} />
                  <InfoField label="Фамилия" value={user.lastName} />
                  <InfoField label="Компания" value={user.company} />
                  <InfoField label="Email (Логин)" value={user.email} />
                  <InfoField label="Роль в системе" value={user.role === 'superadmin' ? 'Администратор' : 'Партнер'} />
                </div>
              </section>

              <Divider className="opacity-50" />

              {/* Данные сети */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 text-xl">🍕</div>
                  <h2 className="text-xl font-black text-slate-800">Масштаб и ответственность</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-6 bg-slate-50 rounded-2xl">
                  <InfoField label="Количество заведений" value={user.venuesCount} />
                  <InfoField label="Ответственный (Имя)" value={`${user.respName} ${user.respLastName}`} />
                  <InfoField label="Телефон ответственного" value={user.respPhone} />
                  <InfoField label="Почта ответственного" value={user.respEmail} />
                </div>
              </section>

              <Divider className="opacity-50" />

              {/* Юридические реквизиты */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white text-xl">🏛</div>
                  <h2 className="text-xl font-black text-slate-800">Реквизиты компании</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6 bg-slate-50 rounded-2xl">
                  <InfoField label="ИНН" value={user.inn} />
                  <InfoField label="ОГРН / ОГРНИП" value={user.ogrn} />
                  <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                    <InfoField label="Юридический адрес" value={user.legalAddress} />
                  </div>
                  <InfoField label="Расчетный счет" value={user.bankAccount} />
                  <InfoField label="БИК Банка" value={user.bik} />
                </div>
              </section>

            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}