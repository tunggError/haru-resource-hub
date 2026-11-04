import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export default function DailyChecklistSection({
  dailyReports = {},
  checklistSheetUrl,
  onToggleTask,
  onSync,
  isSyncing,
  onCopy
}) {
  const dateKeys = useMemo(() => {
    return Object.keys(dailyReports || {});
  }, [dailyReports]);

  const [selectedDate, setSelectedDate] = useState(() => {
    if (dailyReports['04/11']) return '04/11';
    const keys = Object.keys(dailyReports || {});
    return keys[keys.length - 1] || '04/11';
  });

  // Get current date reports
  const currentMembers = dailyReports[selectedDate] || [];

  // Calculate team progress for selected date
  const teamStats = useMemo(() => {
    let total = 0;
    let completed = 0;

    currentMembers.forEach(m => {
      (m.tasks || []).forEach(t => {
        total++;
        if (t.completed) completed++;
      });
    });

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  }, [currentMembers]);

  // Format report for copying to Telegram / Zalo
  const handleCopyDailyReport = () => {
    let text = `📊 BÁO CÁO CÔNG VIỆC NGÀY ${selectedDate} - HARU5C TEAM\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    currentMembers.forEach(m => {
      text += `👤 ${m.name} (${m.role})\n`;
      if (m.reason) {
        text += `⚠️ Trạng thái: ${m.reason}\n`;
      }
      if (m.tasks && m.tasks.length > 0) {
        text += `📌 Công việc:\n`;
        m.tasks.forEach((t) => {
          text += `  ${t.completed ? '✅' : '⏳'} ${t.text}\n`;
        });
      }
      if (m.doneRaw) {
        text += `📝 Kết quả hoàn thành:\n${m.doneRaw}\n`;
      }
      text += `\n`;
    });

    onCopy(text, `Đã copy báo cáo ngày ${selectedDate} để gửi Zalo/Telegram!`);
  };

  const getRoleBadgeStyle = role => {
    const rLow = (role || '').toLowerCase();
    if (rLow.includes('lead')) {
      return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    }
    if (rLow.includes('content')) {
      return 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    }
    return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800';
  };

  const getAvatarGradient = name => {
    const n = (name || '').toLowerCase();
    if (n.includes('vương')) return 'from-purple-600 to-indigo-600';
    if (n.includes('phước')) return 'from-emerald-600 to-teal-600';
    if (n.includes('tùng')) return 'from-blue-600 to-cyan-600';
    if (n.includes('nhung')) return 'from-rose-500 to-pink-600';
    return 'from-slate-600 to-slate-800';
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-800 p-6 sm:p-7 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-emerald-100 border border-white/20">
              <CheckSquare className="w-3.5 h-3.5 text-amber-300" />
              <span>Hệ Thống Báo Cáo & Checklist Hàng Ngày</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Theo Dõi Tiến Độ Nhân Sự Haru5C
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Quản lý đầu việc hàng ngày của từng nhân sự (Vương, Phước, Tùng, Nhung), check trực tiếp tiến độ hoàn thành, báo cáo lý do chưa hoàn thành và xuất báo cáo gửi Zalo/Telegram.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            <a
              href={checklistSheetUrl || 'https://docs.google.com/spreadsheets/d/1jsQPZeIsKwkOYAxZ3uq0OZ5TiCqUDBrPb0zrTxQghzQ/edit?gid=0#gid=0'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-bold hover:bg-emerald-50 text-xs sm:text-sm transition-all shadow-md"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Mở Sheet Báo Cáo</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <button
              onClick={handleCopyDailyReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs sm:text-sm border border-white/30 transition-all"
              title="Sao chép toàn bộ báo cáo hôm nay để gửi Zalo / Telegram"
            >
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Copy Báo Cáo Gửi Zalo/Telegram</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Selector Strip & Progress */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Chọn ngày báo cáo:
            </span>
          </div>

          {/* Progress Summary */}
          {teamStats.total > 0 && (
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="text-slate-500 dark:text-slate-400">
                Tiến độ toàn đội ngày {selectedDate}:
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                {teamStats.completed}/{teamStats.total} việc ({teamStats.percent}%)
              </span>
            </div>
          )}
        </div>

        {/* Date Pills Horizontal Scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {dateKeys.map(date => {
            const isSelected = selectedDate === date;
            const isToday = date === '04/11';
            const dayReports = dailyReports[date] || [];
            const taskCount = dayReports.reduce((acc, m) => acc + (m.tasks?.length || 0), 0);

            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>{date}</span>
                {isToday && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md uppercase font-black ${
                    isSelected ? 'bg-white/30 text-white' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    Hôm nay
                  </span>
                )}
                {taskCount > 0 && !isToday && (
                  <span className="text-[10px] opacity-75">
                    ({taskCount} việc)
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Visual Team Progress Bar */}
        {teamStats.total > 0 && (
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${teamStats.percent}%` }}
            />
          </div>
        )}

      </div>

      {/* Members Checklist Cards */}
      {currentMembers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <CheckSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            Chưa có báo cáo nào trong ngày {selectedDate}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Hãy chọn ngày khác hoặc cập nhật dữ liệu từ Google Sheet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {currentMembers.map(member => {
            const tasks = member.tasks || [];
            const completedCount = tasks.filter(t => t.completed).length;
            const memberPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
            const isOff = member.reason?.toLowerCase() === 'off';

            return (
              <div
                key={member.id}
                className={`flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all ${
                  isOff
                    ? 'border-slate-200 dark:border-slate-800 opacity-60'
                    : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:shadow-lg'
                }`}
              >
                <div>
                  
                  {/* Member Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${getAvatarGradient(
                          member.name
                        )} text-white font-extrabold flex items-center justify-center text-base shadow-sm`}
                      >
                        {member.name.substring(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                            {member.name}
                          </h4>
                          {isOff && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                              Nghỉ (OFF)
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border inline-block mt-0.5 ${getRoleBadgeStyle(
                            member.role
                          )}`}
                        >
                          {member.role || 'Marketing'}
                        </span>
                      </div>
                    </div>

                    {tasks.length > 0 && !isOff && (
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {completedCount}/{tasks.length} xong
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {memberPercent}% hoàn thành
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reason / Status Alert if exists */}
                  {member.reason && !isOff && (
                    <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Lý do chưa hoàn thành:</span> {member.reason}
                      </div>
                    </div>
                  )}

                  {/* Checklist Items */}
                  {tasks.length > 0 ? (
                    <div className="space-y-2 mt-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Danh sách công việc:
                      </span>
                      {tasks.map(task => (
                        <div
                          key={task.id}
                          onClick={() => onToggleTask(selectedDate, member.name, task.id)}
                          className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer group select-none ${
                            task.completed
                              ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-slate-600 dark:text-slate-400'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 hover:border-emerald-400'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              task.completed
                                ? 'bg-emerald-600 text-white'
                                : 'border-2 border-slate-300 dark:border-slate-600 group-hover:border-emerald-500'
                            }`}
                          >
                            {task.completed && <CheckCircle2 className="w-4 h-4" />}
                          </div>
                          <span
                            className={`text-xs sm:text-sm font-medium leading-relaxed ${
                              task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                            }`}
                          >
                            {task.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-xs text-slate-400 italic">
                      Chưa có đầu việc cụ thể trong ngày này
                    </div>
                  )}

                  {/* Done Details Summary */}
                  {member.doneRaw && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Kết quả báo cáo:
                      </span>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                        {member.doneRaw}
                      </div>
                    </div>
                  )}

                </div>

                {/* Member Footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Ngày {selectedDate}</span>
                  <button
                    onClick={() => {
                      const summary = `👤 ${member.name} (${selectedDate}):\n${member.tasks?.map(t => `${t.completed ? '✅' : '⏳'} ${t.text}`).join('\n') || ''}`;
                      onCopy(summary, `Đã copy công việc của ${member.name}`);
                    }}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 font-medium"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy việc nhân sự</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
