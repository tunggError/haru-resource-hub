import React, { useState } from 'react';
import {
  Wrench,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  User,
  KeyRound,
  ShieldCheck,
  Edit2,
  Trash2,
  Cpu,
  Sparkles
} from 'lucide-react';

export default function ToolSection({
  items = [],
  onCopy,
  onEdit,
  onDelete,
  searchQuery
}) {
  const [showPasswords, setShowPasswords] = useState({});

  const togglePasswordVisibility = id => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredTools = items.filter(t => {
    const query = (searchQuery || '').trim().toLowerCase();
    if (!query) return true;
    return (
      (t.name || '').toLowerCase().includes(query) ||
      (t.manager || '').toLowerCase().includes(query) ||
      (t.account || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Tool Introduction Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-transparent border border-amber-200 dark:border-amber-900/60 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              Tài Khoản Công Cụ AI & Thiết Kế Đội Ngũ
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tài khoản dùng chung ChatGPT, Gemini + Veo3, LadiPage, Capcut... Bảo mật và copy mã xác thực 2FA 1 chạm.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map(tool => {
          const isPwVisible = showPasswords[tool.id];

          return (
            <div
              key={tool.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-950/5 transition-all"
            >
              <div>
                
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                      {tool.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                        {tool.name}
                      </h4>
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                        Công cụ AI / SaaS
                      </span>
                    </div>
                  </div>

                  {tool.manager && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <User className="w-3 h-3" />
                      {tool.manager}
                    </span>
                  )}
                </div>

                {/* Account Details Box */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs">
                  
                  {/* Email / User */}
                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium">Tài khoản đăng nhập:</span>
                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200">
                      <span className="truncate">{tool.account || 'Chưa cập nhật email'}</span>
                      {tool.account && (
                        <button
                          onClick={() => onCopy(tool.account, 'Đã copy tài khoản')}
                          className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 p-0.5"
                          title="Copy tài khoản"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <span className="text-slate-400 font-medium">Mật khẩu:</span>
                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200">
                      <span>{isPwVisible ? (tool.password || '(Không có)') : '••••••••••••••••'}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => togglePasswordVisibility(tool.id)}
                          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5"
                          title={isPwVisible ? 'Ẩn' : 'Hiện'}
                        >
                          {isPwVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        {tool.password && (
                          <button
                            onClick={() => onCopy(tool.password, 'Đã copy mật khẩu')}
                            className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 p-0.5"
                            title="Copy mật khẩu"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2FA Code if available */}
                  {tool.authCode && (
                    <div className="space-y-1 pt-1 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Mã bảo mật 2FA:
                        </span>
                        <span className="text-[10px] text-slate-400">Authenticator Secret</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 font-mono text-xs text-amber-900 dark:text-amber-200 font-semibold">
                        <span className="truncate">{tool.authCode}</span>
                        <button
                          onClick={() => onCopy(tool.authCode, 'Đã copy mã xác thực 2FA!')}
                          className="text-amber-600 hover:text-amber-800 dark:text-amber-300 p-0.5"
                          title="Copy mã 2FA"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {onEdit && (
                    <button
                      onClick={() => onEdit('tools', tool)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete('tools', tool.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {tool.url && (
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs transition-colors shadow-xs"
                  >
                    <span>Truy cập Web</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

