import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Calendar,
  User,
  Users,
  Copy,
  ExternalLink,
  Edit2,
  CheckCircle2,
  Search,
  Filter,
  Check,
  Flame,
  Coffee,
  Sun
} from 'lucide-react';

export default function DutyScheduleSection({
  dutySchedule = [],
  dutySheetUrl,
  onCopy,
  onUpdateAssignee
}) {
  const [filterPerson, setFilterPerson] = useState('all');
  const [onlyAssigned, setOnlyAssigned] = useState(false);
  const [editingDate, setEditingDate] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Extract all unique persons assigned
  const allPersons = useMemo(() => {
    const set = new Set();
    dutySchedule.forEach(d => {
      if (d.assignees) {
        d.assignees.split('-').forEach(p => {
          const clean = p.trim();
          if (clean) set.add(clean);
        });
      }
    });
    return Array.from(set).sort();
  }, [dutySchedule]);

  // Today is 04/11
  const todayItem = dutySchedule.find(d => d.date === '04/11') || {
    date: '04/11',
    dayOfWeek: 'T4',
    assignees: 'Tuấn - Hiệu'
  };

  // Tomorrow is 05/11
  const tomorrowItem = dutySchedule.find(d => d.date === '05/11') || {
    date: '05/11',
    dayOfWeek: 'T5',
    assignees: 'Nguyệt - Tiến'
  };

  // Filtered days
  const filteredSchedule = useMemo(() => {
    return dutySchedule.filter(d => {
      if (onlyAssigned && !d.assignees?.trim()) return false;
      if (filterPerson !== 'all') {
        if (!d.assignees || !d.assignees.toLowerCase().includes(filterPerson.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [dutySchedule, onlyAssigned, filterPerson]);

  // Copy week schedule
  const handleCopyWeekSchedule = () => {
    let text = `🧹 LỊCH TRỰC NHẬT VĂN PHÒNG HARU5C (TUẦN 02/11 - 07/11)\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    const weekItems = dutySchedule.filter(d => ['02/11', '03/11', '04/11', '05/11', '06/11', '07/11'].includes(d.date));
    weekItems.forEach(d => {
      const isToday = d.date === '04/11';
      text += `${isToday ? '👉 ' : '  '}• ${d.dayOfWeek} (${d.date}): ${d.assignees || 'Chưa phân công'}${isToday ? ' 🌟 (HÔM NAY)' : ''}\n`;
    });
    text += `\n📌 Nhiệm vụ: Đổ rác, lau bàn trà, quét văn phòng cuối ngày. Cảm ơn cả nhà!`;

    onCopy(text, 'Đã sao chép lịch trực nhật tuần này để gửi nhóm Zalo!');
  };

  const handleStartEdit = (date, currentVal) => {
    setEditingDate(date);
    setEditValue(currentVal || '');
  };

  const handleSaveEdit = (date) => {
    if (onUpdateAssignee) {
      onUpdateAssignee(date, editValue);
    }
    setEditingDate(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Duty Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 p-6 sm:p-8 text-white shadow-xl shadow-orange-950/20">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-amber-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Lịch Trực Nhật Văn Phòng • Tháng 11/2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Lịch Phân Công Trực Nhật Haru5C
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              Phân công xoay vòng trực nhật vệ sinh văn phòng, đổ rác, chăm sóc không gian làm việc chung sạch đẹp mỗi ngày.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <a
              href={dutySheetUrl || 'https://docs.google.com/spreadsheets/d/1LanBepyxSocj4yZhbz1bAPwK-xODh-O85Teprvo-zTA/edit?gid=0#gid=0'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-orange-900 font-bold hover:bg-orange-50 text-xs sm:text-sm shadow-md transition-all whitespace-nowrap"
            >
              <span>Sheet Trực Nhật</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleCopyWeekSchedule}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold text-xs sm:text-sm transition-all"
              title="Sao chép lịch tuần này để gửi vào nhóm Zalo"
            >
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Copy Lịch Tuần</span>
            </button>
          </div>
        </div>

        {/* Today and Tomorrow Highlight Cards */}
        <div className="mt-6 pt-5 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Today Card */}
          <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-orange-600 flex flex-col items-center justify-center shadow-md font-black">
                <span className="text-[10px] uppercase tracking-wider text-orange-400">HÔM NAY</span>
                <span className="text-base leading-none">04/11</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-amber-200">Trực Nhật Hôm Nay (Thứ 4):</span>
                <h3 className="text-lg font-black text-white">
                  {todayItem.assignees || 'Chưa phân công'}
                </h3>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-emerald-400/30 text-emerald-100 text-xs font-bold border border-emerald-300/40">
              Đang trực
            </div>
          </div>

          {/* Tomorrow Card */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex flex-col items-center justify-center font-bold">
                <span className="text-[10px] uppercase tracking-wider text-amber-200">NGÀY MAI</span>
                <span className="text-base leading-none">05/11</span>
              </div>
              <div>
                <span className="text-xs text-amber-200/80">Trực Nhật Ngày Mai (Thứ 5):</span>
                <h3 className="text-base font-bold text-white">
                  {tomorrowItem.assignees || 'Chưa phân công'}
                </h3>
              </div>
            </div>
            <div className="text-xs text-amber-200/70">
              Thứ 5
            </div>
          </div>

        </div>

      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Person Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Lọc nhân sự:
          </span>
          <button
            onClick={() => setFilterPerson('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              filterPerson === 'all'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            Tất cả ({dutySchedule.length} ngày)
          </button>
          {allPersons.map(p => (
            <button
              key={p}
              onClick={() => setFilterPerson(p === filterPerson ? 'all' : p)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                filterPerson === p
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Toggle only assigned */}
        <div className="flex items-center gap-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={onlyAssigned}
              onChange={e => setOnlyAssigned(e.target.checked)}
              className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300 dark:border-slate-700"
            />
            <span>Chỉ xem ngày đã có người trực</span>
          </label>
        </div>

      </div>

      {/* Grid of Schedule Days */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
        {filteredSchedule.map(item => {
          const isToday = item.date === '04/11';
          const hasAssignees = !!item.assignees?.trim();
          const isWeekend = item.isWeekend;
          const isEditing = editingDate === item.date;

          return (
            <div
              key={item.date}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                isToday
                  ? 'bg-gradient-to-b from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/20 border-orange-500 ring-2 ring-orange-500/30 shadow-lg shadow-orange-950/5'
                  : isWeekend && !hasAssignees
                  ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-60'
                  : hasAssignees
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-orange-400/60 hover:shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                
                {/* Header Date & Day */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-black px-2 py-0.5 rounded-lg ${
                        isToday
                          ? 'bg-orange-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono'
                      }`}
                    >
                      {item.date}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isWeekend ? 'text-rose-500 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {item.dayOfWeek}
                    </span>
                  </div>

                  {isToday ? (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-600 text-white">
                      Hôm nay
                    </span>
                  ) : isWeekend && !hasAssignees ? (
                    <span className="text-[10px] font-bold text-slate-400">
                      Nghỉ
                    </span>
                  ) : null}
                </div>

                {/* Assignees Body */}
                <div className="py-2">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        placeholder="Nhập tên người trực..."
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-orange-400 rounded-lg outline-none"
                        autoFocus
                      />
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSaveEdit(item.date)}
                          className="px-2 py-1 bg-orange-600 text-white rounded text-[10px] font-bold"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingDate(null)}
                          className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px]"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : hasAssignees ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Users className="w-3.5 h-3.5 text-orange-500" />
                        <span>Người trực:</span>
                      </div>
                      <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{item.assignees}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic py-1">
                      {isWeekend ? 'Cuối tuần' : 'Chưa phân công'}
                    </div>
                  )}
                </div>

              </div>

              {/* Bottom Card Footer */}
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>T11/2026</span>
                {!isEditing && (
                  <button
                    onClick={() => handleStartEdit(item.date, item.assignees)}
                    className="hover:text-orange-600 dark:hover:text-orange-400 p-1 rounded"
                    title="Chỉnh sửa người trực"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

