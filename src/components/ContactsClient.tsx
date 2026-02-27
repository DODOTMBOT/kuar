"use client";
import { useEffect, useState } from "react";
import { Autocomplete, AutocompleteItem, Card, CardBody, Spinner, Button, Tooltip } from "@heroui/react";
import Papa from "papaparse";
import Link from "next/link";

export default function ContactsClient({ dataUrl }: { dataUrl: string }) {
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPizzeria, setSelectedPizzeria] = useState<Record<string, string> | null>(null);

  // Карта соответствия технических имен колонок и понятных названий
  const fieldLabels: Record<string, string> = {
    '_1': 'Территориальный менеджер',
    '_2': 'Регион',
    '_3': 'Адрес',
    '_4': 'Партнер',
    '_7': 'Почта партнера',
    '_8': 'Управляющий',
    '_9': 'Номер управляющего',
    '_10': 'Почта управляющего',
    '_11': 'Территориальный управляющий',
    '_12': 'Номер территориального управляющего',
    '_13': 'Почта территориального управляющего',
    '_14': 'РУ/ОД/Контроллинг',
    '_15': 'Телефон РУ/ОД/Контроллинг и тд',
    '_16': 'Почта РУ/ОД/Контроллинг и тд',
  };

  useEffect(() => {
    if (!dataUrl) {
      setLoading(false);
      return;
    }

    fetch(dataUrl)
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const keys = results.meta.fields || [];
            // Фильтруем данные: убираем заголовки, если они попали в строки, и пустые ячейки
            const parsedData = (results.data as Record<string, string>[]).filter(
              row => row[keys[0]] && row[keys[0]] !== keys[0]
            );
            
            if (keys.length > 0) {
              setColumns(keys);
              setData(parsedData);
            }
            setLoading(false);
          },
          error: () => setLoading(false)
        });
      })
      .catch(() => setLoading(false));
  }, [dataUrl]);

  // Функция копирования в буфер обмена
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const nameKey = columns[0];

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 font-sans text-black">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#FF5500] tracking-tighter uppercase leading-none">Контакты</h1>
                      </div>
          <Button 
            as={Link} href="/" variant="light" size="sm"
            className="font-black text-[#00A3FF] rounded-xl hover:bg-blue-50"
          >
            ← НАЗАД
          </Button>
        </header>

        {loading ? (
          <div className="flex justify-center p-20"><Spinner color="warning" /></div>
        ) : (
          <div className="space-y-6">
            {/* Поиск с выпадающим списком */}
            <Autocomplete
              label="ПОИСК ПИЦЦЕРИИ"
              labelPlacement="outside"
              placeholder="Начните вводить (напр. Москва 1-1)..."
              variant="bordered"
              onSelectionChange={(key) => {
                const found = data.find(item => item[nameKey] === key);
                setSelectedPizzeria(found || null);
              }}
              classNames={{
                base: "w-full",
                popoverContent: "rounded-xl border border-slate-100 bg-white shadow-xl",
              }}
              inputProps={{
                classNames: {
                  label: "!font-black !text-slate-400 !text-[10px] !tracking-widest mb-3 block uppercase",
                  input: "text-base font-bold !outline-none !ring-0 border-none",
                  inputWrapper: "bg-white h-14 rounded-2xl px-5 border-2 border-slate-200 group-data-[focused=true]:border-[#FF5500] !ring-0 transition-all shadow-none"
                }
              }}
            >
              {data.map((item) => (
                <AutocompleteItem key={item[nameKey]} textValue={item[nameKey]} className="rounded-lg py-2">
                  <span className="font-bold text-sm text-slate-700">{item[nameKey]}</span>
                </AutocompleteItem>
              ))}
            </Autocomplete>

            {/* Карточка с деталями */}
            {selectedPizzeria ? (
              <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <CardBody className="p-8">
                  <div className="flex items-center gap-4 mb-8 border-b border-slate-50 pb-6">
                    <div>
                      <h2 className="text-3xl font-black text-[#121212] tracking-tight">{selectedPizzeria[nameKey]}</h2>
                      <p className="text-[#00A3FF] font-black uppercase text-[9px] tracking-widest">Карточка пиццерии</p>
                    </div>
                  </div>
                  
                  {/* Сетка данных */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                    {columns.map((col) => {
                      const value = selectedPizzeria[col];
                      // Отображаем только если поле не пустое и это не имя пиццерии (заголовок)
                      if (col === nameKey || !value || value.trim() === "") return null;

                      // Получаем красивое название из словаря, если его нет — выводим как есть
                      const displayLabel = fieldLabels[col] || col;

                      return (
                        <div key={col} className="flex flex-col border-l-2 border-slate-100 pl-4 py-1 group hover:border-[#FF5500] transition-colors relative">
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">
                            {displayLabel}
                          </span>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[15px] font-bold text-slate-700 leading-tight break-words">
                              {value}
                            </span>
                            <Tooltip content="Копировать" closeDelay={0} radius="sm" className="font-bold text-xs">
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                className="min-w-8 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-[#FF5500] hover:bg-orange-50"
                                onPress={() => copyToClipboard(value)}
                              >
                                📋
                              </Button>
                            </Tooltip>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 opacity-30 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-white/50">
                <p className="font-black text-slate-400 text-center uppercase tracking-widest text-xs">
                  Выберите объект для просмотра данных
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}