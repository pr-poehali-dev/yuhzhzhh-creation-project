import { useEffect, useState } from "react";
import funcUrls from "../../backend/func2url.json";

type Visit = {
  id: number;
  visited_at: string;
  ip: string;
  device: string;
  os: string;
  browser: string;
  referrer: string;
};

type Stats = {
  total: number;
  unique: number;
  devices: { device: string; count: number }[];
  os_stats: { os: string; count: number }[];
  browsers: { browser: string; count: number }[];
  visits: Visit[];
};

const DEVICE_EMOJI: Record<string, string> = {
  mobile: "📱",
  tablet: "📟",
  desktop: "💻",
};

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
      <div className="text-3xl font-bold text-[#E8430A]">{value}</div>
      <div className="text-gray-500 text-sm mt-1">{label}</div>
    </div>
  );
}

function BarList({ items }: { items: { label: string; count: number }[] }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className="w-24 text-sm text-gray-600 truncate">{item.label}</div>
          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
            <div
              className="bg-[#E8430A] h-5 rounded-full transition-all"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
          <div className="text-sm text-gray-700 w-6 text-right">{item.count}</div>
        </div>
      ))}
    </div>
  );
}

function formatDate(dt: string) {
  const d = new Date(dt);
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Analytics() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch((funcUrls as Record<string, string>)["get-analytics"])
      .then((r) => r.json())
      .then((data) => {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        setStats(typeof parsed === "string" ? JSON.parse(parsed) : parsed);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="wse-bg min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="wse-bg min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Ошибка загрузки данных</div>
      </div>
    );
  }

  return (
    <div className="wse-bg min-h-screen pb-10">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Аналитика посещений</h1>

        {/* Счётчики */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard label="Всего посещений" value={stats.total} />
          <StatCard label="Уникальных IP" value={stats.unique} />
        </div>

        {/* Устройства */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <h2 className="font-semibold text-gray-800 mb-4">Устройства</h2>
          <BarList
            items={stats.devices.map((d) => ({
              label: `${DEVICE_EMOJI[d.device] || "🖥️"} ${d.device}`,
              count: d.count,
            }))}
          />
        </div>

        {/* ОС */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
          <h2 className="font-semibold text-gray-800 mb-4">Операционные системы</h2>
          <BarList items={stats.os_stats.map((o) => ({ label: o.os, count: o.count }))} />
        </div>

        {/* Браузеры */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Браузеры</h2>
          <BarList items={stats.browsers.map((b) => ({ label: b.browser, count: b.count }))} />
        </div>

        {/* Таблица посещений */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Последние посещения</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Время</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">IP</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Устройство</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">ОС / Браузер</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Источник</th>
                </tr>
              </thead>
              <tbody>
                {stats.visits.map((v) => (
                  <tr key={v.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{formatDate(v.visited_at)}</td>
                    <td className="px-4 py-3 text-gray-600">{v.ip}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {DEVICE_EMOJI[v.device] || "🖥️"} {v.device}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{v.os} / {v.browser}</td>
                    <td className="px-4 py-3 text-gray-400 max-w-[120px] truncate">
                      {v.referrer || "прямой"}
                    </td>
                  </tr>
                ))}
                {stats.visits.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      Посещений пока нет
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}