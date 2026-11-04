import React from 'react';
import {
  FolderRoot,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  Moon,
  Sun,
  FileSpreadsheet,
  Sparkles,
  Layers
} from 'lucide-react';

export default function Navbar({
  sheetInfo,
  onSync,
  isSyncing,
  onOpenAddModal,
  isDark,
  onToggleTheme,
  stats
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 ring-4 ring-emerald-500/10">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                  Haru Resource Hub
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  Haru5C Team
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Trung tâm tổng hợp & quản lý tài nguyên media, kênh social & công cụ
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
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
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
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isSyncing
                  ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-not-allowed'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/60'
              }`}
              title="Đồng bộ dữ liệu trực tiếp từ Google Sheet"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-500' : 'text-emerald-600 dark:text-emerald-400'}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ Sheet'}</span>
            </button>

            {/* Add Resource Button */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm hover:shadow shadow-emerald-600/30 transition-all"
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

