'use client';

import React, { useState } from "react";
import { Input, Button, Card, CardBody } from "@heroui/react";
import Link from 'next/link';
import { loginUser } from "./actions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await loginUser({ email, password });
    } catch (error: any) {
      if (error.message?.includes("NEXT_REDIRECT")) return;
      alert("Ошибка входа");
      setIsLoading(false);
    }
  };

  const inputClasses = {
    input: "border-none !ring-0 !outline-none", // Прямой запрет рамок на самом инпуте
    inputWrapper: "bg-slate-100/70 hover:bg-slate-200/50 transition-all border-none rounded-2xl h-14 px-5 shadow-none",
    label: "font-bold text-slate-500 mb-1"
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-16 h-16 bg-white shadow-xl shadow-blue-500/5 rounded-2xl flex items-center justify-center mb-8 border border-white">
         <span className="text-3xl">🔑</span>
      </div>

      <h1 className="text-5xl font-black mb-10 text-[#FF5500] tracking-tighter">DODOBOT</h1>
      
      <Card className="max-w-[400px] w-full shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-none p-4 rounded-[2.5rem] bg-white">
        <CardBody className="p-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-[#121212]">Вход в систему</h2>
          </div>
          
          <div className="space-y-5">
            <Input 
              label="Email" labelPlacement="outside" placeholder="Email" variant="flat" 
              classNames={inputClasses} onValueChange={setEmail}
            />
            
            <Input 
              label="Пароль" labelPlacement="outside" type="password" placeholder="••••••••" variant="flat" 
              classNames={inputClasses} onValueChange={setPassword}
            />

            <Button 
              className="w-full bg-[#FF5500] text-white font-black h-16 rounded-2xl text-lg mt-4 shadow-xl shadow-orange-100 transition-transform active:scale-95"
              isLoading={isLoading}
              onClick={handleLogin}
            >
              Войти
            </Button>
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-sm font-bold text-slate-300">
              Нет аккаунта? <Link href="/register" className="text-[#00A3FF] hover:underline ml-1">Создать аккаунт</Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}