"use client";
import { useState, useRef } from "react";
import { 
  Input, 
  Button, 
  Card, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell, 
  User, 
  Chip,
  Divider
} from "@heroui/react";
import { updateContactsUrl, updateIngredientsUrl, updateTestsUrl, uploadViolationsPdf } from "@/app/admin/actions";
import Link from "next/link";

// Полный интерфейс пропсов (добавили currentTestsUrl)
interface AdminPanelProps {
  users: any[];
  venues: any[];
  currentContactsUrl: string;
  currentIngredientsUrl: string;
  currentViolationsUpdate: string | null;
  currentTestsUrl?: string; 
}

export default function AdminPanelClient({ 
  users, 
  venues, 
  currentContactsUrl, 
  currentIngredientsUrl,
  currentViolationsUpdate,
  currentTestsUrl = "" // Значение по умолчанию
}: AdminPanelProps) {
  // Состояния для URL
  const [contactsUrl, setContactsUrl] = useState(currentContactsUrl);
  const [ingredientsUrl, setIngredientsUrl] = useState(currentIngredientsUrl);
  const [testsUrl, setTestsUrl] = useState(currentTestsUrl);
  
  // Состояния загрузки
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Сохранение ссылок для Google Таблиц
  const saveUrl = async (type: 'contacts' | 'ingredients' | 'tests') => {
    setIsSaving(true);
    let res;
    
    if (type === 'contacts') {
      res = await updateContactsUrl(contactsUrl);
    } else if (type === 'ingredients') {
      res = await updateIngredientsUrl(ingredientsUrl);
    } else if (type === 'tests') {
      res = await updateTestsUrl(testsUrl);
    }
    
    if (res?.success) alert("Данные успешно сохранены");
    else alert("Ошибка при сохранении");
    
    setIsSaving(false);
  };

  // Загрузка PDF файла
  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return alert("Пожалуйста, выберите файл");

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadViolationsPdf(formData);
    if (res.success) {
      alert("Файл градации успешно обновлен!");
      window.location.reload(); // Перезагрузка для обновления даты в UI
    } else {
      alert(`Ошибка загрузки: ${res.error}`);
    }
    setIsUploading(false);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-black">
      <div className="max-w-7xl mx-auto">
        {/* Шапка */}
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black italic uppercase leading-none">DODOBOT ADMIN</h1>
            <p className="text-slate-400 font-bold text-[10px] tracking-widest mt-2 uppercase">Панель управления системы</p>
          </div>
          <Link href="/" className="font-bold text-[#00A3FF] hover:underline">← Вернуться в дашборд</Link>
        </header>

        {/* Сетка настроек (изменили на grid-cols-1 md:grid-cols-2 lg:grid-cols-4 для адаптивности) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Ссылка: Контакты */}
          <Card className="p-6 border-none shadow-sm rounded-3xl bg-white">
            <h2 className="text-[10px] font-black mb-4 uppercase text-slate-400 tracking-[0.2em]">📞 Контакты (CSV)</h2>
            <div className="flex flex-col gap-3">
              <Input 
                value={contactsUrl} 
                onValueChange={setContactsUrl} 
                variant="flat" 
                size="sm" 
                radius="lg" 
                placeholder="URL Google Таблицы"
              />
              <Button 
                onPress={() => saveUrl('contacts')} 
                isLoading={isSaving} 
                className="bg-[#FF5500] text-white font-black rounded-xl"
              >
                ОБНОВИТЬ ССЫЛКУ
              </Button>
            </div>
          </Card>

          {/* Ссылка: Ингредиенты */}
          <Card className="p-6 border-none shadow-sm rounded-3xl bg-white">
            <h2 className="text-[10px] font-black mb-4 uppercase text-slate-400 tracking-[0.2em]">🥗 Ингредиенты (CSV)</h2>
            <div className="flex flex-col gap-3">
              <Input 
                value={ingredientsUrl} 
                onValueChange={setIngredientsUrl} 
                variant="flat" 
                size="sm" 
                radius="lg" 
                placeholder="URL Google Таблицы"
              />
              <Button 
                onPress={() => saveUrl('ingredients')} 
                isLoading={isSaving} 
                className="bg-purple-600 text-white font-black rounded-xl"
              >
                ОБНОВИТЬ ССЫЛКУ
              </Button>
            </div>
          </Card>

          {/* Ссылка: Тесты (НОВАЯ КАРТОЧКА) */}
          <Card className="p-6 border-none shadow-sm rounded-3xl bg-white">
            <h2 className="text-[10px] font-black mb-4 uppercase text-slate-400 tracking-[0.2em]">🧪 Тесты (CSV)</h2>
            <div className="flex flex-col gap-3">
              <Input 
                value={testsUrl} 
                onValueChange={setTestsUrl} 
                variant="flat" 
                size="sm" 
                radius="lg" 
                placeholder="URL Google Таблицы"
              />
              <Button 
                onPress={() => saveUrl('tests')} 
                isLoading={isSaving} 
                className="bg-blue-600 text-white font-black rounded-xl"
              >
                ОБНОВИТЬ ССЫЛКУ
              </Button>
            </div>
          </Card>

          {/* Загрузка PDF: Градация */}
          <Card className="p-6 border-none shadow-sm rounded-3xl bg-white">
            <h2 className="text-[10px] font-black mb-4 uppercase text-slate-400 tracking-[0.2em]">🚨 Градация (PDF)</h2>
            <div className="flex flex-col gap-3">
              {currentViolationsUpdate ? (
                <Chip size="sm" color="success" variant="flat" className="font-bold uppercase text-[9px] w-full text-center">
                  Обновлено: {new Date(currentViolationsUpdate).toLocaleDateString()}
                </Chip>
              ) : (
                <Chip size="sm" color="warning" variant="flat" className="font-bold uppercase text-[9px] w-full text-center">
                  Нет файла
                </Chip>
              )}
              <input 
                type="file" 
                accept=".pdf" 
                ref={fileInputRef} 
                className="text-[10px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[9px] file:font-black file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200 cursor-pointer w-full" 
              />
              <Button 
                onPress={handleUpload} 
                isLoading={isUploading} 
                className="bg-red-500 text-white font-black rounded-xl"
              >
                ЗАГРУЗИТЬ PDF
              </Button>
            </div>
          </Card>
          
        </div>

        {/* Раздел таблиц */}
        <div className="space-y-8">
          {/* Таблица 1: Пользователи */}
          <section>
            <h3 className="text-xl font-black mb-4 px-2">МЕНЕДЖЕРЫ И РОЛИ</h3>
            <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
              <Table aria-label="Users table" removeWrapper>
                <TableHeader>
                  <TableColumn className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest">ПОЛЬЗОВАТЕЛЬ</TableColumn>
                  <TableColumn className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest">РОЛЬ</TableColumn>
                  <TableColumn className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest">ДОСТУП К ПИЦЦЕРИЯМ</TableColumn>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-b border-slate-50 last:border-none">
                      <TableCell>
                        <User 
                          name={`${user.name} ${user.lastName}`}
                          description={user.email}
                          avatarProps={{radius: "lg", src: `https://i.pravatar.cc/150?u=${user.id}`}}
                          classNames={{ name: "font-bold", description: "text-slate-400" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" variant="dot" color={user.role === 'superadmin' ? 'secondary' : 'default'} className="font-black uppercase text-[9px]">
                          {user.role}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.venues?.length > 0 ? user.venues.map((v: any) => (
                            <Chip key={v.id} size="sm" variant="flat" className="text-[10px] font-bold">{v.name}</Chip>
                          )) : <span className="text-slate-300 italic text-xs">Нет привязки</span>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </section>

          {/* Таблица 2: Пиццерии (Вендоры) */}
          <section>
            <h3 className="text-xl font-black mb-4 px-2 uppercase tracking-tighter">Список пиццерий</h3>
            <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
              <Table aria-label="Venues table" removeWrapper>
                <TableHeader>
                  <TableColumn className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest">НАЗВАНИЕ</TableColumn>
                  <TableColumn className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest">ГОРОД / ТИП</TableColumn>
                  <TableColumn className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest">ВЛАДЕЛЕЦ</TableColumn>
                </TableHeader>
                <TableBody>
                  {venues.map((venue) => (
                    <TableRow key={venue.id} className="border-b border-slate-50 last:border-none">
                      <TableCell className="font-bold text-[#121212]">{venue.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs">{venue.city}</span>
                          <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{venue.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold text-[#00A3FF]">
                          {venue.owner ? `${venue.owner.name} ${venue.owner.lastName}` : "Система"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}