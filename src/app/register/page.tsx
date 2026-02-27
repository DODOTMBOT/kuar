"use client";

import React, { useState, useMemo } from "react";
import { Input, Button, Card, CardBody } from "@heroui/react";
import Link from 'next/link';
import { registerPartner } from "./actions";

export default function RegisterPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const strengthScore = useMemo(() => {
    let score = 0;
    if (!password) return 0;
    if (password.length > 7) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const strengthLabels = ["", "Слабый", "Средний", "Хороший", "Надежный"];
  const strengthColors = ["bg-slate-100", "bg-red-500", "bg-orange-500", "bg-blue-500", "bg-green-500"];

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError("");
    try {
      await registerPartner(formData);
    } catch (err: any) {
      if (err.message.includes("PASSWORDS_DONT_MATCH")) setError("Пароли не совпадают");
      else if (err.message.includes("USER_EXISTS")) setError("Пользователь уже существует");
      else setError("Ошибка регистрации. Проверьте все поля.");
      setIsLoading(false);
    }
  };

  const inputClasses = {
    inputWrapper: "bg-slate-100/70 hover:bg-slate-200/50 transition-all border-none rounded-2xl h-14 px-5 shadow-none",
    label: "font-bold text-slate-500 mb-1"
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
      <h1 className="text-5xl font-black mb-10 text-[#FF5500] tracking-tighter uppercase">DODOBOT</h1>
      
      <Card className="max-w-[450px] w-full shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-none p-4 rounded-[2.5rem] bg-white">
        <CardBody className="p-6">
          <h2 className="text-2xl font-black text-[#121212] text-center mb-8">Регистрация</h2>
          
          {error && <div className="mb-6 p-4 text-sm text-red-500 bg-red-50 rounded-2xl font-bold text-center">{error}</div>}

          <form action={handleSubmit} className="space-y-5">
            <div className="flex gap-4">
              <Input name="firstName" label="Имя" labelPlacement="outside" placeholder="Иван" variant="flat" classNames={inputClasses} isRequired />
              <Input name="lastName" label="Фамилия" labelPlacement="outside" placeholder="Иванов" variant="flat" classNames={inputClasses} isRequired />
            </div>

            <Input name="company" label="Компания" labelPlacement="outside" placeholder="Напр: Додо Пицца" variant="flat" classNames={inputClasses} isRequired />
            <Input name="email" type="email" label="Email" labelPlacement="outside" placeholder="mail@example.com" variant="flat" classNames={inputClasses} isRequired />

            <div className="space-y-2">
              <Input 
                name="password" type="password" label="Пароль" labelPlacement="outside" placeholder="••••••••" 
                variant="flat" classNames={inputClasses} onValueChange={setPassword} isRequired 
              />
              {password && (
                <div className="px-1">
                  <div className="flex gap-1 h-1.5 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-full w-1/4 rounded-full transition-colors ${i <= strengthScore ? strengthColors[strengthScore] : 'bg-slate-100'}`} />
                    ))}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{strengthLabels[strengthScore]}</p>
                </div>
              )}
            </div>

            <Input name="confirmPassword" type="password" label="Подтверждение" labelPlacement="outside" placeholder="••••••••" variant="flat" classNames={inputClasses} isRequired />

            <Button 
              type="submit" 
              className="w-full bg-[#FF5500] text-white font-black h-16 rounded-2xl text-lg mt-4 shadow-xl shadow-orange-100 transition-transform active:scale-95"
              isLoading={isLoading}
            >
              Создать аккаунт
            </Button>
          </form>
          
          <div className="mt-8 text-center pt-6 border-t border-slate-50">
            <p className="text-sm font-bold text-slate-300">
              Есть аккаунт? <Link href="/login" className="text-[#00A3FF] hover:underline ml-1">Войти</Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}