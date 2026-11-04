import React, { useState } from 'react';
import {
  Swords,
  ExternalLink,
  Copy,
  Gift,
  Target,
  FileText,
  Newspaper,
  Edit2,
  Trash2,
  CheckCircle,
  Video
} from 'lucide-react';

export default function CompetitorSection({
  items = [],
  onCopy,
  onEdit,
  onDelete,
  searchQuery
}) {
  const filteredCompetitors = items.filter(c => {
    const query = (searchQuery || '').trim().toLowerCase();
    if (!query) return true;
    return (
      (c.brand || '').toLowerCase().includes(query) ||
      (c.usp || '').toLowerCase().includes(query) ||
      (c.message || '').toLowerCase().includes(query) ||
      (c.promotion || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-rose-500/5 dark:from-rose-950/30 dark:via-pink-950/20 dark:to-transparent border border-rose-200 dark:border-rose-900/60 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              Nghiên Cứu Đối Thủ Cạnh Tranh Trực Tiếp
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Phân tích USP, thông điệp truyền thông, chính sách giá & ưu đãi, cùng link video ads thực chiến của đối thủ trong ngành phân bón hữu cơ.
            </p>
          </div>
        </div>
      </div>

      {/* Competitors List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCompetitors.map((comp, idx) => {
          return (
            <div
              key={comp.id || idx}
              className="flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500/40 hover:shadow-xl hover:shadow-rose-950/5 transition-all"
            >
              <div className="space-y-5">
                
                {/* Header Brand */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-rose-500/20">
                      {comp.brand.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-black text-xl text-slate-900 dark:text-slate-100">
                        {comp.brand}
                      </h4>
                      <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                        Đối thủ cùng phân khúc
                      </span>
                    </div>
                  </div>

                  {comp.fbUrl && (
                    <a
                      href={comp.fbUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Xem Reel / Fanpage</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Key USP */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    <Target className="w-3.5 h-3.5 text-rose-500" />
                    <span>Key Chính / USP</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                    {comp.usp || 'Chưa cập nhật'}
                  </p>
                </div>

                {/* Message / Content Copy */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      <span>Thông Điệp & Câu Key Truyền Thông</span>
                    </span>
                    {comp.message && (
                      <button
                        onClick={() => onCopy(comp.message, `Đã copy thông điệp của ${comp.brand}`)}
                        className="text-xs text-slate-400 hover:text-emerald-500 flex items-center gap-1 font-medium"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    )}
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed max-h-44 overflow-y-auto">
                    {comp.message || 'Chưa có thông điệp cụ thể'}
                  </div>
                </div>

                {/* Promotion / Offers */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                      <Gift className="w-3.5 h-3.5 text-amber-600" />
                      <span>Chính Sách Khuyến Mãi / Ưu Đãi</span>
                    </span>
                    {comp.promotion && (
                      <button
                        onClick={() => onCopy(comp.promotion, 'Đã copy ưu đãi')}
                        className="text-xs text-amber-700 dark:text-amber-400 hover:text-amber-900 flex items-center gap-1 font-medium"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200 whitespace-pre-line">
                    {comp.promotion || 'Không có ưu đãi đặc biệt'}
                  </p>
                </div>

                {/* Verification Sources */}
                {comp.sources && (
                  <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <Newspaper className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span>Nguồn tham khảo: <strong className="text-slate-700 dark:text-slate-300">{comp.sources}</strong></span>
                  </div>
                )}

              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {onEdit && (
                    <button
                      onClick={() => onEdit('competitors', comp)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Chỉnh sửa đối thủ"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete('competitors', comp.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Xóa đối thủ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {comp.fbUrl && (
                  <button
                    onClick={() => onCopy(comp.fbUrl, `Đã copy link của ${comp.brand}`)}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Link FB</span>
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

