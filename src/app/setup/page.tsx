'use client';

import React, { useState } from "react";
import { Input, Button, Divider, Card, CardBody } from "@heroui/react";
import { completeSetup } from "./actions";

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false);

  // КОНФИГУРАЦИЯ: Оставили "непробиваемые" настройки, чуть уменьшили высоту (h-12)
  const inputProps = {
    variant: "flat" as const,
    labelPlacement: "outside" as const,
    radius: "full" as const, 
    isRequired: true,
    classNames: {
      label: "text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-3",
      
      input: [
        "bg-transparent",
        "!border-0",           
        "!outline-none",       
        "!ring-0",             
        "focus:!border-0",     
        "focus:!ring-0",       
        "text-sm font-semibold text-slate-800 ml-1"
      ].join(" "),

      innerWrapper: "bg-transparent !border-0 !outline-none !ring-0",

      inputWrapper: [
        "bg-[#F1F5F9]",                           
        "!border-0",                              
        "!shadow-none",                           
        "!ring-0",                                
        "data-[hover=true]:bg-[#F1F5F9]",         
        "data-[focus=true]:bg-[#F1F5F9]",         
        "data-[focus=true]:!ring-0",              
        "h-12" // <-- Сделали компактнее
      ].join(" "),
    },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center py-12 px-4 sm:px-6 font-sans">
      <div className="max-w-[560px] w-full mb-8 text-center">
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Активация</h1>
        <p className="text-slate-500 text-sm mt-2 font-medium">Заполните данные для начала работы</p>
      </div>

      <Card className="max-w-[560px] w-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] bg-white">
        <CardBody className="p-8 sm:p-10">
          <form action={async (fd) => {
            setIsLoading(true);
            await completeSetup(fd);
          }} className="space-y-8"> 

            {/* Блок 1 */}
            <section className="space-y-5">
              <div className="flex items-center gap-2 ml-3">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Масштаб сети</p>
              </div>
              <Input {...inputProps} name="venuesCount" type="number" label="Количество заведений" placeholder="Напр: 5" />
            </section>

            <Divider className="opacity-40" />

            {/* Блок 2 */}
            <section className="space-y-5">
              <div className="flex items-center gap-2 ml-3">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Ответственный</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input {...inputProps} name="respName" label="Имя" placeholder="Иван" />
                <Input {...inputProps} name="respLastName" label="Фамилия" placeholder="Иванов" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input {...inputProps} name="respPhone" label="Телефон" placeholder="+7..." />
                <Input {...inputProps} name="respEmail" type="email" label="Почта" placeholder="mail@example.com" />
              </div>
            </section>

            <Divider className="opacity-40" />

            {/* Блок 3 */}
            <section className="space-y-5">
              <div className="flex items-center gap-2 ml-3">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Реквизиты</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input {...inputProps} name="inn" label="ИНН" placeholder="10 или 12 цифр" />
                <Input {...inputProps} name="ogrn" label="ОГРН" placeholder="Номер записи" />
              </div>
              <Input {...inputProps} name="legalAddress" label="Юридический адрес" placeholder="Город, улица, дом" />
              <div className="grid grid-cols-2 gap-4">
                <Input {...inputProps} name="bankAccount" label="Расчетный счет" placeholder="20 цифр" />
                <Input {...inputProps} name="bik" label="БИК" placeholder="9 цифр" />
              </div>
            </section>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-[#121212] text-white font-bold h-14 rounded-full text-base shadow-lg hover:bg-black active:scale-[0.98] transition-all"
                isLoading={isLoading}
              >
                ЗАВЕРШИТЬ НАСТРОЙКУ
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}