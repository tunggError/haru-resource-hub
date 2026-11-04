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
  Sparkles,
  CheckSquare,
  CalendarCheck2,
  Users,
  Clapperboard
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
  const dailyReports = data?.dailyReports || {};
  const dutySchedule = data?.dutySchedule || [];
  const mediaProductions = data?.mediaProductions || [];

  const photoCount = media.filter(m => m.category === 'ảnh').length;
  const videoCount = media.filter(m => m.category === 'video').length;
  const pinnedMedia = media.filter(m => m.isPinned);
  const masterFolder = media.find(m => m.category === 'root') || {
    url: 'https://drive.google.com/drive/folders/1uwBsbBsm9uJYGZ2bJWOEAXQgImR-x1wg?usp=sharing',
    title: 'Nguyên Liệu Tổng'
  };

  // Today duty
  const todayDuty = dutySchedule.find(d => d.date === '04/11') || {
    assignees: 'Tuấn - Hiệu',
    dayOfWeek: 'T4'
  };

  // Calculate today's tasks
  const todayTasks = (dailyReports['04/11'] || []).reduce((acc, m) => acc + (m.tasks?.length || 0), 0);

  const stats = [
    {
      id: 'checklist',
      label: 'Checklist Hàng Ngày',
      count: todayTasks || 18,
      detail: 'Đầu việc 4 nhân sự ngày hôm nay',
      icon: CheckSquare,
      gradient: 'from-teal-500 to-emerald-600',
      activeColor: 'ring-teal-500'
    },
    {
      id: 'production',
      label: 'Quản Lý Media & Mã',
      count: mediaProductions.length,
      detail: 'Mã Content & Video 4 nhân sự',
      icon: Clapperboard,
      gradient: 'from-blue-600 to-indigo-700',
      activeColor: 'ring-blue-600'
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
      id: 'duty',
      label: 'Lịch Trực Nhật',
      count: todayDuty.assignees || 'Tuấn - Hiệu',
      isText: true,
      detail: 'Hôm nay (04/11 - T4) trực nhật',
      icon: CalendarCheck2,
      gradient: 'from-amber-500 to-orange-600',
      activeColor: 'ring-amber-500'
    },
    {
      id: 'media',
      label: 'Kho Media Haru',
      count: media.length - 1,
      detail: `${photoCount} Thư mục Ảnh • ${videoCount} Video`,
      icon: ImageIcon,
      gradient: 'from-cyan-500 to-blue-600',
      activeColor: 'ring-cyan-500'
    },
    {
      id: 'tools',
      label: 'Công Cụ AI & SaaS',
      count: tools.length,
      detail: 'ChatGPT, Gemini, Veo3, LadiPage...',
      icon: Wrench,
      gradient: 'from-purple-500 to-indigo-600',
      activeColor: 'ring-purple-500'
    },
    {
      id: 'competitors',
      label: 'Đối Thủ Cạnh Tranh',
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
          <div className="flex items-start sm:items-center gap-4 max-w-2xl">
            <div className="relative shrink-0">
              <img
                src="/haru5c-logo.png"
                alt="Logo Haru5C"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-contain bg-white p-1 shadow-2xl ring-4 ring-white/30"
              />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-emerald-100 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Năng Lượng Cho Cây – Giàu Cho Đất</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Hệ Thống Quản Trị Haru5C
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Tất cả 38 thư mục ảnh & video, 11 kênh social, tài khoản công cụ AI, báo cáo checklist hằng ngày và lịch trực nhật văn phòng được tổng hợp tại một nơi duy nhất.
              </p>
            </div>
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

        {/* Quick info footer with Today Duty highlight */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-emerald-100/90">
          <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-xl border border-white/20 font-semibold">
            <span>🧹 Trực nhật hôm nay (04/11 - T4):</span>
            <strong className="text-white text-sm underline decoration-amber-300 decoration-2">
              {todayDuty.assignees || 'Tuấn - Hiệu'}
            </strong>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              Đồng bộ tự động từ 3 Google Sheet
            </span>
            <span>•</span>
            <span>Cập nhật: {data?.sheetInfo?.lastSyncedAt || 'Hôm nay'}</span>
          </div>
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

      {/* Metric Cards Navigation (7 items) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
        {stats.map(s => {
          const Icon = s.icon;
          const isActive = activeTab === s.id;

          return (
            <button
              key={s.id}
              onClick={() => onTabChange(s.id)}
              className={`text-left p-4 rounded-2xl border transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-white dark:bg-slate-900 border-emerald-500/50 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${s.gradient} text-white flex items-center justify-center shadow-md shadow-black/5 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {s.isText ? (
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 truncate max-w-[100px] text-right">
                    {s.count}
                  </span>
                ) : (
                  <span className="text-xl font-black text-slate-800 dark:text-white">
                    {s.count}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {s.label}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
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
