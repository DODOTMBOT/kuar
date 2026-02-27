"use client";

import { useState } from "react";
import { registerPartner } from "./actions";

export default function RegisterPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Простая функция оценки сложности пароля (от 0 до 4)
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length > 7) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strengthScore = getPasswordStrength(password);
  
  // Цвета для индикатора
  const strengthColors = ["bg-gray-200", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
  const strengthLabels = ["", "Слабый", "Средний", "Хороший", "Надежный"];

  const handleSubmit = async (formData: FormData) => {
    try {
      setError("");
      await registerPartner(formData);
    } catch (err: any) {
      if (err.message.includes("PASSWORDS_DONT_MATCH")) setError("Пароли не совпадают");
      else if (err.message.includes("USER_EXISTS")) setError("Пользователь с такой почтой уже существует");
      else if (err.message.includes("FILL_ALL_FIELDS")) setError("Заполните все поля");
      else setError("Произошла ошибка при регистрации");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-900">Регистрация партнера</h1>
        
        {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">{error}</div>}

        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Имя</label>
              <input name="firstName" type="text" required className="mt-1 w-full rounded-md border p-2 border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Фамилия</label>
              <input name="lastName" type="text" required className="mt-1 w-full rounded-md border p-2 border-gray-300" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Компания (например, Додо)</label>
            <input name="company" type="text" required className="mt-1 w-full rounded-md border p-2 border-gray-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Электронная почта</label>
            <input name="email" type="email" required className="mt-1 w-full rounded-md border p-2 border-gray-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Пароль</label>
            <input 
              name="password" 
              type="password" 
              required 
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border p-2 border-gray-300" 
            />
            {/* Индикатор сложности */}
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-gray-200">
                  {[...Array(4)].map((_, index) => (
                    <div 
                      key={index} 
                      className={`h-full w-1/4 transition-colors ${index < strengthScore ? strengthColors[strengthScore] : 'bg-transparent'}`}
                    />
                  ))}
                </div>
                <p className={`text-xs mt-1 font-medium text-${strengthColors[strengthScore].replace('bg-', '')}`}>
                  {strengthLabels[strengthScore]}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Подтверждение пароля</label>
            <input name="confirmPassword" type="password" required className="mt-1 w-full rounded-md border p-2 border-gray-300" />
          </div>

          <button type="submit" className="w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 transition-colors">
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
}