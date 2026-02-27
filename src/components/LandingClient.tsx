"use client";
import { Button, Card, CardBody } from "@heroui/react";
import Link from "next/link";

export default function LandingClient() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FF5500]/5 rounded-full blur-3xl -z-10" />

      <Card className="max-w-3xl w-full border-none shadow-[0_40px_100px_rgba(0,0,0,0.04)] rounded-[4rem] bg-white p-12 md:p-20 text-center">
        <CardBody className="p-0 flex flex-col items-center">
          <div className="w-24 h-24 bg-[#FF5500] rounded-[2.5rem] flex items-center justify-center text-5xl mb-12 shadow-2xl shadow-orange-200">
            🤖
          </div>
          
          <h1 className="text-8xl font-black text-[#121212] mb-6 tracking-tighter uppercase">DODOBOT</h1>
          
          <p className="text-2xl text-slate-400 mb-16 max-w-lg font-bold leading-tight">
            Инструментарий территориального менеджера пиццерии
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 w-full max-w-md">
            <Button 
              as={Link} href="/login" 
              className="flex-1 bg-slate-100 text-[#121212] font-black h-20 rounded-3xl text-xl transition-all active:scale-95"
            >
              Войти
            </Button>
            <Button 
              as={Link} href="/register" 
              className="flex-1 bg-[#FF5500] text-white font-black h-20 rounded-3xl text-xl shadow-2xl shadow-orange-200 active:scale-95"
            >
              Регистрация
            </Button>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}