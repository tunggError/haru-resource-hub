import React from 'react';
import {
  FolderRoot,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  Moon,
  Sun,
  FileSpreadsheet,
  Sparkles
} from 'lucide-react';

export default function Navbar({
  sheetInfo,
  onSync,
  isSyncing,
  onOpenAddModal,
  isDark,
  onToggleTheme
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <img
                src="/haru5c-logo.png"
                alt="Logo Haru5C"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-contain bg-white shadow-md shadow-emerald-950/10 ring-2 ring-emerald-500/30 p-0.5 group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-300 bg-clip-text text-transparent tracking-tight">
                  HARU5C HUB
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  Chính Hãng
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
                Năng Lượng Cho Cây – Giàu Cho Đất
              </p>
            </div>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Sheet Link */}
            <a
              href={sheetInfo?.sheetUrl || 'https://docs.google.com/spreadsheets/d/1rs11DMTVgLmMbZJ0XnQTVqiTM3K5drrFrpGvQeyJ8fQ/edit?gid=214358388#gid=214358388'}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              title="Mở Google Sheet dữ liệu gốc"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Sheet Gốc</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* Sync Button */}
            <button
              onClick={onSync}
              disabled={isSyncing}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isSyncing
                  ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-not-allowed'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60 shadow-xs'
              }`}
              title="Đồng bộ dữ liệu trực tiếp từ 3 Google Sheet"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-500' : 'text-emerald-600 dark:text-emerald-400'}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ Sheet'}</span>
            </button>

            {/* Add Resource Button */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm hover:shadow shadow-emerald-600/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden xs:inline">Thêm mới</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
