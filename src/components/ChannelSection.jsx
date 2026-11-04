import React, { useState, useMemo } from 'react';
import {
  Share2,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  User,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  Smartphone
} from 'lucide-react';

export default function ChannelSection({
  items = [],
  onCopy,
  onEdit,
  onDelete,
  searchQuery
}) {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedManager, setSelectedManager] = useState('all');
  const [showPasswords, setShowPasswords] = useState({});
  const [localSearch, setLocalSearch] = useState('');

  const togglePasswordVisibility = id => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Managers list
  const managers = useMemo(() => {
    const set = new Set();
    items.forEach(it => {
      if (it.manager && it.manager.trim()) set.add(it.manager.trim());
    });
    return Array.from(set);
  }, [items]);

  // Filtered items
  const filteredChannels = useMemo(() => {
    return items.filter(it => {
      if (selectedPlatform !== 'all' && it.platform !== selectedPlatform) return false;
      if (selectedManager !== 'all' && it.manager?.trim() !== selectedManager) return false;

      const query = (searchQuery || localSearch).trim().toLowerCase();
      if (query) {
        const matchName = (it.channelName || '').toLowerCase().includes(query);
        const matchType = (it.platformType || '').toLowerCase().includes(query);
        const matchManager = (it.manager || '').toLowerCase().includes(query);
        const matchVia = (it.viaName || '').toLowerCase().includes(query);
        if (!matchName && !matchType && !matchManager && !matchVia) return false;
      }

      return true;
    });
  }, [items, selectedPlatform, selectedManager, searchQuery, localSearch]);

  const getPlatformBadge = platform => {
    switch (platform) {
      case 'Facebook':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'TikTok':
        return 'bg-slate-900 text-white dark:bg-slate-800 dark:text-white border-slate-700';
      case 'YouTube':
        return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'Shopee':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Platform tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'Facebook', 'TikTok', 'YouTube', 'Shopee'].map(plat => (
            <button
              key={plat}
              onClick={() => setSelectedPlatform(plat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedPlatform === plat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {plat === 'all' ? `Tất cả kênh (${items.length})` : plat}
            </button>
          ))}
        </div>

        {/* Manager Filter & Search */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          {managers.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium hidden sm:inline">Quản lý:</span>
              <select
                value={selectedManager}
                onChange={e => setSelectedManager(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="all">Tất cả phụ trách</option>
                {managers.map(m => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="Tìm tên kênh, via..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

      </div>

      {/* Grid of Channels */}
      {filteredChannels.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Share2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            Không tìm thấy kênh nào
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Thử chọn bộ lọc khác hoặc tìm kiếm với từ khóa khác.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredChannels.map(item => {
            const hasUrl = !!item.url;
            const isPwVisible = showPasswords[item.id];

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-950/5 transition-all"
              >
                <div>
                  
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${getPlatformBadge(
                        item.platform
                      )}`}
                    >
                      {item.platform} • {item.platformType}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${
                        hasUrl
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {hasUrl ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Hoạt động
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-amber-500" />
                          Chuẩn bị
                        </>
                      )}
                    </span>
                  </div>

                  {/* Channel Title */}
                  <h4 className="font-bold text-base text-slate-900 dark:text-slate-100 line-clamp-2 min-h-[3rem]">
                    {item.channelName}
                  </h4>

                  {/* Manager and Via info */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    {item.manager && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        <User className="w-3 h-3 text-emerald-500" />
                        Phụ trách: <strong>{item.manager}</strong>
                      </span>
                    )}
                    {item.viaName && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        Via: {item.viaName}
                      </span>
                    )}
                  </div>

                  {/* Credentials / Account box if exists */}
                  {(item.account || item.password || item.twoFactor) && (
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
                      
                      {item.account && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400 shrink-0">Tài khoản:</span>
                          <div className="flex items-center gap-1.5 font-mono text-slate-800 dark:text-slate-200 truncate">
                            <span className="truncate">{item.account}</span>
                            <button
                              onClick={() => onCopy(item.account, 'Đã copy tài khoản')}
                              className="text-slate-400 hover:text-emerald-500 p-0.5"
                              title="Copy tài khoản"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {item.password && (
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400 shrink-0">Mật khẩu:</span>
                          <div className="flex items-center gap-1.5 font-mono text-slate-800 dark:text-slate-200">
                            <span>{isPwVisible ? item.password : '••••••••••••'}</span>
                            <button
                              onClick={() => togglePasswordVisibility(item.id)}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                              title={isPwVisible ? 'Ẩn mật khẩu' : 'Xem mật khẩu'}
                            >
                              {isPwVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                            <button
                              onClick={() => onCopy(item.password, 'Đã copy mật khẩu')}
                              className="text-slate-400 hover:text-emerald-500 p-0.5"
                              title="Copy mật khẩu"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {item.twoFactor && (
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                          <span className="text-slate-400 shrink-0">Mã 2FA:</span>
                          <div className="flex items-center gap-1.5 font-mono text-xs text-amber-600 dark:text-amber-400 truncate">
                            <span className="truncate max-w-[140px]">{item.twoFactor}</span>
                            <button
                              onClick={() => onCopy(item.twoFactor, 'Đã copy mã 2FA')}
                              className="text-slate-400 hover:text-amber-500 p-0.5"
                              title="Copy mã 2FA"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>

                {/* Footer Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {hasUrl && (
                      <button
                        onClick={() => onCopy(item.url, `Đã copy link ${item.channelName}`)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Copy link kênh"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit('channels', item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete('channels', item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {hasUrl ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-600 text-white font-medium text-xs transition-colors"
                    >
                      <span>Mở Kênh</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Chưa có link</span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

