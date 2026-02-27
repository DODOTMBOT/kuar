"use client";
import { useEffect, useState, useMemo } from "react";
import { Autocomplete, AutocompleteItem, Card, CardBody, Spinner, Button, Tooltip, Divider, Chip } from "@heroui/react";
import Papa from "papaparse";
import Link from "next/link";

export default function IngredientsClient({ dataUrl }: { dataUrl: string }) {
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResults, setSelectedResults] = useState<Record<string, string>[]>([]);

  const fieldLabels: Record<string, string> = {
    '_2': 'Описание',
    '_4': 'Изготовитель',
    '_8': 'В закрытой упаковке (хранение)',
    '_9': 'Срок после дефростации (в упаковке)',
    '_10': 'Срок после нарезки/вскрытия',
    '_11': 'Условия и срок дефростации',
  };

  useEffect(() => {
    if (!dataUrl) { setLoading(false); return; }
    fetch(dataUrl)
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const keys = results.meta.fields || [];
            let lastIngredientName = "";
            
            const parsedData = (results.data as Record<string, string>[]).map(row => {
              const currentName = row[keys[0]]?.trim();
              if (currentName && currentName.length > 2 && currentName !== keys[0]) {
                lastIngredientName = currentName;
              }
              return { ...row, [keys[0]]: lastIngredientName };
            }).filter(row => row[keys[0]] !== "" && row[keys[0]] !== undefined);

            if (keys.length > 0) {
              setColumns(keys);
              setData(parsedData);
            }
            setLoading(false);
          },
        });
      });
  }, [dataUrl]);

  const nameKey = columns[0];
  const uniqueIngredients = Array.from(new Set(data.map(item => item[nameKey])));

  // ЛОГИКА СРАВНЕНИЯ И ГРУППИРОВКИ
  const { commonInfo, differences } = useMemo(() => {
    if (selectedResults.length === 0) return { commonInfo: {}, differences: [] };

    const common: Record<string, string> = {};
    const keysToCompare = Object.keys(fieldLabels).filter(k => k !== '_4'); // Сравниваем всё, кроме изготовителя

    keysToCompare.forEach(key => {
      const values = selectedResults.map(r => r[key]?.trim());
      const uniqueValues = new Set(values);
      // Если у всех изготовителей значение одинаковое
      if (uniqueValues.size === 1) {
        common[key] = Array.from(uniqueValues)[0];
      }
    });

    const diffs = selectedResults.map(res => {
      const diffObj: Record<string, string> = { '_4': res['_4'] }; // Изготовитель всегда в блоке различий
      Object.keys(fieldLabels).forEach(key => {
        if (!common[key] && key !== '_4') {
          diffObj[key] = res[key];
        }
      });
      return diffObj;
    });

    return { commonInfo: common, differences: diffs };
  }, [selectedResults]);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 font-sans text-black">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-purple-600 tracking-tighter uppercase leading-none">Требования</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-3">Интеллектуальный анализ</p>
          </div>
          <Button as={Link} href="/" variant="light" size="sm" className="font-black text-[#00A3FF] rounded-xl">
            ← НАЗАД
          </Button>
        </header>

        {loading ? (
          <div className="flex justify-center p-20"><Spinner color="secondary" size="lg" /></div>
        ) : (
          <div className="space-y-8">
            <Autocomplete
              label="ПОИСК ИНГРЕДИЕНТА"
              labelPlacement="outside"
              placeholder="Начните вводить название (напр. Бекон)..."
              variant="bordered"
              onSelectionChange={(key) => {
                const results = data.filter(item => item[nameKey] === key);
                setSelectedResults(results);
              }}
              inputProps={{
                classNames: {
                  label: "!font-black !text-slate-500 !text-xs !tracking-[0.2em] mb-4 block",
                  input: "text-lg font-bold !outline-none !ring-0 border-none bg-transparent",
                  inputWrapper: "bg-white h-14 rounded-2xl px-5 border-2 border-slate-200 group-data-[focused=true]:border-purple-500 !ring-0 transition-all shadow-none"
                }
              }}
            >
              {uniqueIngredients.map((name) => (
                <AutocompleteItem key={name} textValue={name} className="rounded-lg py-2">
                  <span className="font-bold text-sm text-slate-700">{name}</span>
                </AutocompleteItem>
              ))}
            </Autocomplete>

            {selectedResults.length > 0 && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                {/* ЗАГОЛОВОК ОБЪЕКТА */}
                <div className="flex items-center gap-4 ml-2">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl">📦</div>
                    <h2 className="text-4xl font-black text-[#121212] tracking-tight">{selectedResults[0][nameKey]}</h2>
                </div>

                {/* БЛОК 1: ОБЩИЕ ДАННЫЕ */}
                {Object.keys(commonInfo).length > 0 && (
                  <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                    <CardBody className="p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <Chip color="secondary" variant="flat" size="sm" className="font-black uppercase text-[9px]">Общие требования</Chip>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                        {Object.keys(commonInfo).map(key => (
                          <div key={key} className="flex flex-col border-l-2 border-purple-100 pl-4 py-1 group relative">
                            <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider mb-2">{fieldLabels[key]}</span>
                            <div className="flex items-start justify-between gap-3">
                              <span className="text-[14px] font-bold text-slate-700 leading-snug whitespace-pre-line">{commonInfo[key]}</span>
                              <Button isIconOnly size="sm" variant="light" className="min-w-8 w-8 h-8 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-purple-500" onPress={() => copyToClipboard(commonInfo[key])}>📋</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                )}

                {/* БЛОК 2: РАЗЛИЧИЯ ПО ИЗГОТОВИТЕЛЯМ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {differences.map((diff, index) => (
                    <Card key={index} className="border-2 border-purple-50 shadow-none rounded-3xl bg-white/50 overflow-hidden">
                      <CardBody className="p-6">
                        <div className="mb-4">
                          <p className="text-[9px] text-purple-400 font-black uppercase tracking-widest mb-1">Изготовитель</p>
                          <h3 className="text-xl font-black text-slate-800 leading-tight">{diff['_4']}</h3>
                        </div>
                        <Divider className="mb-4 bg-purple-100/50" />
                        <div className="space-y-4">
                          {Object.keys(diff).map(key => {
                            if (key === '_4' || !diff[key] || diff[key].toLowerCase() === 'нет') return null;
                            return (
                              <div key={key} className="flex flex-col group relative">
                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider mb-1">{fieldLabels[key]}</span>
                                <div className="flex items-start justify-between gap-3">
                                  <span className="text-[13px] font-bold text-slate-600 leading-snug">{diff[key]}</span>
                                  <Button isIconOnly size="sm" variant="light" className="min-w-6 w-6 h-6 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-purple-500" onPress={() => copyToClipboard(diff[key])}>📋</Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {!loading && selectedResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 opacity-30 border-2 border-dashed border-slate-200 rounded-[4rem] bg-white/50">
                <p className="font-black text-slate-400 text-center uppercase tracking-widest text-xs">Выберите ингредиент для анализа данных</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}