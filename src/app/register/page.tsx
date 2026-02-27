"use client";

import React, { useState } from "react";
import { Input, Button, Card, CardBody } from "@heroui/react";
import Link from "next/link";
import { registerPartner } from "./actions";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", lastName: "", email: "", venueName: "", password: "", confirmPassword: "",
  });

  const isInvalidPass = formData.confirmPassword !== "" && formData.password !== formData.confirmPassword;

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      await registerPartner(formData);
    } catch (error: any) {
      if (error.message?.includes("NEXT_REDIRECT")) return;
      alert("Ошибка при регистрации");
      setIsLoading(false);
    }
  };

  const inputClasses = {
    input: "border-none !ring-0 !outline-none",
    inputWrapper: "bg-slate-100/70 hover:bg-slate-200/50 transition-all border-none rounded-2xl h-14 px-5 shadow-none",
    label: "font-bold text-slate-500 mb-1"
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <Card className="max-w-[480px] w-full shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-none p-4 rounded-[2.5rem] bg-white">
        <CardBody className="p-6">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-[#FF5500] tracking-tighter mb-2">DODOBOT</h1>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Регистрация</p>
          </div>

          <div className="space-y-5">
            <div className="flex gap-4">
              <Input label="Имя" labelPlacement="outside" placeholder="Иван" variant="flat" classNames={inputClasses} onValueChange={(v) => setFormData({...formData, name: v})}/>
              <Input label="Фамилия" labelPlacement="outside" placeholder="Арутюнов" variant="flat" classNames={inputClasses} onValueChange={(v) => setFormData({...formData, lastName: v})}/>
            </div>
            
            <Input label="Email" labelPlacement="outside" placeholder="Email" variant="flat" classNames={inputClasses} onValueChange={(v) => setFormData({...formData, email: v})}/>
            <Input label="Название ресторана" labelPlacement="outside" placeholder="Basil's" variant="flat" classNames={inputClasses} onValueChange={(v) => setFormData({...formData, venueName: v})}/>

            <div className="flex gap-4">
              <Input label="Пароль" labelPlacement="outside" type="password" placeholder="••••" variant="flat" classNames={inputClasses} onValueChange={(v) => setFormData({...formData, password: v})}/>
              <Input label="Подтверждение" labelPlacement="outside" type="password" placeholder="••••" variant="flat" isInvalid={isInvalidPass} classNames={inputClasses} onValueChange={(v) => setFormData({...formData, confirmPassword: v})}/>
            </div>

            <Button 
              className="w-full bg-[#FF5500] text-white font-black h-16 rounded-2xl text-xl mt-6 shadow-xl shadow-orange-100 active:scale-95 transition-transform"
              isLoading={isLoading}
              isDisabled={isInvalidPass || !formData.email || !formData.password}
              onClick={handleRegister}
            >
              Создать аккаунт
            </Button>
          </div>

          <p className="mt-8 text-center text-sm font-bold text-slate-300">
            Есть аккаунт? <Link href="/login" className="text-[#00A3FF] hover:underline ml-1">Войти</Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}