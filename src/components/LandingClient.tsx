"use client";
import { Button } from "@heroui/react";
import Link from "next/link";

export default function LandingClient() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <h1 className="text-8xl font-black text-[#FF5500] mb-4 tracking-tighter">DODOBOT</h1>
      <p className="text-xl text-slate-400 mb-10 max-w-md font-bold leading-tight">
        Инструмент для территориальных менеджеров
      </p>
      
      <div className="flex gap-4">
        <Button 
          as={Link} href="/login" 
          variant="flat" 
          className="bg-slate-100 text-[#121212] font-black px-8 h-14 rounded-2xl transition-transform active:scale-95"
        >
          Войти
        </Button>
        <Button 
          as={Link} href="/register" 
          className="bg-[#FF5500] text-white font-black px-10 h-14 rounded-2xl shadow-xl shadow-orange-200 transition-transform active:scale-95"
        >
          Начать работу
        </Button>
      </div>
    </main>
  );
}