import React from 'react';
import {
  FolderGit2,
  Image as ImageIcon,
  Video as VideoIcon,
  Share2,
  Wrench,
  Swords,
  ExternalLink,
  Star,
  Copy,
  FolderOpen,
  Sparkles
} from 'lucide-react';

export default function OverviewStats({
  data,
  activeTab,
  onTabChange,
  onCopy,
  onTogglePin
}) {
  const media = data?.media || [];
  const channels = data?.channels || [];
  const tools = data?.tools || [];
  const competitors = data?.competitors || [];

  const photoCount = media.filter(m => m.category === 'ảnh').length;
  const videoCount = media.filter(m => m.category === 'video').length;
  const pinnedMedia = media.filter(m => m.isPinned);
  const masterFolder = media.find(m => m.category === 'root') || {
    url: 'https://drive.google.com/drive/folders/1uwBsbBsm9uJYGZ2bJWOEAXQgImR-x1wg?usp=sharing',
    title: 'Nguyên Liệu Tổng'
  };

  const stats = [
    {
      id: 'media',
      label: 'Kho Media Haru',
      count: media.length,
      detail: `${photoCount} Thư mục Ảnh • ${videoCount} Video`,
      icon: ImageIcon,
      gradient: 'from-blue-500 to-indigo-600',
      activeColor: 'ring-blue-500'
    },
    {
      id: 'channels',
      label: 'Tài Khoản Kênh',
      count: channels.length,
      detail: 'Facebook, TikTok, Shopee, YouTube',
      icon: Share2,
      gradient: 'from-emerald-500 to-teal-600',
      activeColor: 'ring-emerald-500'
    },
    {
      id: 'tools',
      label: 'Công Cụ AI & SaaS',
      count: tools.length,
      detail: 'ChatGPT, Gemini, Veo3, LadiPage...',
      icon: Wrench,
      gradient: 'from-amber-500 to-orange-600',
      activeColor: 'ring-amber-500'
    },
    {
      id: 'competitors',
      label: 'Phân Tích Đối Thủ',
      count: competitors.length,
      detail: 'Rootbio, Kagreen, Bio36, Dasshu...',
      icon: Swords,
      gradient: 'from-rose-500 to-pink-600',
      activeColor: 'ring-rose-500'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Master Drive Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/20">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-20 top-0 w-32 h-32 bg-teal-400/20 rounded-full blur-xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-emerald-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Thư mục Master Google Drive</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Trung Tâm Tài Nguyên Haru5C
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              Giải pháp loại bỏ nhầm lẫn link rải rác trên Google Sheet. Tất cả 39 thư mục ảnh & video, 11 kênh social, tài khoản AI và bài học đối thủ được phân loại khoa học tại một nơi duy nhất.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <a
              href={masterFolder.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-emerald-800 font-bold hover:bg-emerald-50 active:scale-95 transition-all shadow-lg shadow-black/10 text-sm whitespace-nowrap"
            >
              <FolderOpen className="w-4 h-4 text-emerald-600" />
              <span>Mở Drive Tổng</span>
              <ExternalLink className="w-4 h-4 text-emerald-500" />
            </a>
            <button
              onClick={() => onCopy(masterFolder.url, 'Đã copy link Folder Tổng!')}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-medium transition-all text-sm active:scale-95"
              title="Sao chép link Google Drive tổng"
            >
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Copy Link</span>
            </button>
          </div>
        </div>

        {/* Quick info footer */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-emerald-100/80">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            Đồng bộ tự động từ Google Sheet
          </span>
          <span>•</span>
          <span>Cập nhật gần nhất: {data?.sheetInfo?.lastSyncedAt || 'Hôm nay'}</span>
        </div>
      </div>

      {/* Pinned Quick Access Shelf */}
      {pinnedMedia.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Truy Cập Nhanh / Thường Dùng</span>
            </div>
            <span className="text-xs text-slate-400">
              {pinnedMedia.length} mục đã ghim
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {pinnedMedia.map(item => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700/80 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all text-xs font-medium text-slate-700 dark:text-slate-200 shrink-0"
              >
                {item.category === 'ảnh' ? (
                  <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                ) : (
                  <VideoIcon className="w-3.5 h-3.5 text-purple-500" />
                )}
                <span className="font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {item.rawTitle || item.title}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-500" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Metric Cards Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          const isActive = activeTab === s.id;

          return (
            <button
              key={s.id}
              onClick={() => onTabChange(s.id)}
              className={`text-left p-5 rounded-2xl border transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-white dark:bg-slate-900 border-emerald-500/50 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${s.gradient} text-white flex items-center justify-center shadow-md shadow-black/5 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-slate-800 dark:text-white">
                  {s.count}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {s.label}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {s.detail}
                </p>
              </div>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
}

