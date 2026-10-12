import React from 'react';

const games = [
  {
    id: 'snake',
    title: 'Snake Classic',
    description: 'Makan apel merah, tambah panjang tubuhmu, dan hindari dinding arena.',
    icon: '🐍',
    tag: 'Classic',
    path: './games/Snake/snake.html',
    gradient: 'from-emerald-500 to-teal-700',
    btnColor: 'bg-emerald-500 hover:bg-emerald-600',
  },
  {
    id: 'tetris',
    title: 'Tetris Classic',
    description: 'Susun formasi balok jatuh, bersihkan baris, dan cetak skor rekor baru.',
    icon: '🧱',
    tag: 'Arcade',
    path: './games/Tetris/tetris.html',
    gradient: 'from-cyan-500 to-blue-700',
    btnColor: 'bg-cyan-500 hover:bg-cyan-600',
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center px-4 py-8">
      {/* Header Platform */}
      <header className="text-center mb-8 max-w-md w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-sky-400 mb-3">
          <span>✨</span> Modern Web Arcade
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Mini <span className="text-sky-400">Arcade</span> Hub
        </h1>
        <p className="text-sm text-slate-400">
          Koleksi game retro ringan yang dioptimalkan untuk perangkat ponsel.
        </p>
      </header>

      {/* Grid Katalog Game */}
      <main className="w-full max-w-md space-y-4">
        {games.map((game) => (
          <div
            key={game.id}
            className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg transition-all duration-200 active:scale-[0.98]"
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${game.gradient} flex items-center justify-center text-3xl shadow-inner`}>
                {game.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
                    {game.title}
                  </h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {game.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {game.description}
                </p>
                <a
                  href={game.path}
                  className={`block w-full py-2.5 text-center text-xs font-bold text-white rounded-xl shadow-md transition ${game.btnColor}`}
                >
                  Mainkan Sekarang ➔
                </a>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Footer Info */}
      <footer className="mt-auto pt-10 text-center text-xs text-slate-600">
        Dikembangkan langsung dari HP menggunakan React & Tailwind CSS
      </footer>
    </div>
  );
}
