import React, { useState, useMemo } from 'react';
import {
  FolderOpen,
  Image as ImageIcon,
  Video as VideoIcon,
  Star,
  Copy,
  ExternalLink,
  Search,
  Filter,
  Grid,
  List,
  Edit2,
  Trash2,
  Sparkles,
  Tag,
  Check
} from 'lucide-react';

export default function MediaSection({
  items = [],
  onCopy,
  onTogglePin,
  onEdit,
  onDelete,
  searchQuery
}) {
  const [filterType, setFilterType] = useState('all'); // all, ảnh, video, pinned
  const [selectedTag, setSelectedTag] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid, table
  const [localSearch, setLocalSearch] = useState('');

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set();
    items.forEach(it => {
      (it.tags || []).forEach(t => {
        if (t !== 'Ảnh' && t !== 'Video') set.add(t);
      });
    });
    return Array.from(set);
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter(it => {
      // Don't show master root folder in sub-cards to avoid confusion, or show it pinned
      if (it.category === 'root') return false;

      // Filter by type
      if (filterType === 'ảnh' && it.category !== 'ảnh') return false;
      if (filterType === 'video' && it.category !== 'video') return false;
      if (filterType === 'pinned' && !it.isPinned) return false;

      // Filter by tag
      if (selectedTag !== 'all' && (!it.tags || !it.tags.includes(selectedTag))) {
        return false;
      }

      // Filter by search query
      const query = (searchQuery || localSearch).trim().toLowerCase();
      if (query) {
        const matchTitle = (it.title || '').toLowerCase().includes(query);
        const matchDesc = (it.description || '').toLowerCase().includes(query);
        const matchTags = (it.tags || []).some(t => t.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchTags) return false;
      }

      return true;
    });
  }, [items, filterType, selectedTag, searchQuery, localSearch]);

  const photoCount = items.filter(m => m.category === 'ảnh').length;
  const videoCount = items.filter(m => m.category === 'video').length;
  const pinnedCount = items.filter(m => m.isPinned && m.category !== 'root').length;

  return (
    <div className="space-y-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Type Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            Tất cả ({items.length - 1})
          </button>
          
          <button
            onClick={() => setFilterType('ảnh')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              filterType === 'ảnh'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Kho Ảnh ({photoCount})</span>
          </button>

          <button
            onClick={() => setFilterType('video')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              filterType === 'video'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <VideoIcon className="w-3.5 h-3.5" />
            <span>Kho Video ({videoCount})</span>
          </button>

          <button
            onClick={() => setFilterType('pinned')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              filterType === 'pinned'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Đã ghim ({pinnedCount})</span>
          </button>
        </div>

        {/* View Switcher & Quick Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="Tìm thư mục media..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title="Xem dạng thẻ Bento"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title="Xem dạng bảng"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Sub-tag filters */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-medium px-2 py-1 shrink-0 flex items-center gap-1">
            <Tag className="w-3 h-3" /> Chủ đề:
          </span>
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1 rounded-full font-medium transition-colors shrink-0 ${
              selectedTag === 'all'
                ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Tất cả chủ đề
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? 'all' : tag)}
              className={`px-3 py-1 rounded-full font-medium transition-colors shrink-0 ${
                selectedTag === tag
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Content Rendering */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <FolderOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            Không tìm thấy thư mục nào phù hợp
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn các bộ lọc phía trên.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map(item => {
            const isImage = item.category === 'ảnh';
            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-950/5 transition-all relative overflow-hidden"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isImage
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                            : 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400'
                        }`}
                      >
                        {isImage ? <ImageIcon className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isImage
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        }`}
                      >
                        {isImage ? 'Ảnh' : 'Video'}
                      </span>
                    </div>

                    {/* Pin button */}
                    <button
                      onClick={() => onTogglePin(item.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        item.isPinned
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                          : 'text-slate-300 hover:text-amber-500 dark:text-slate-600'
                      }`}
                      title={item.isPinned ? 'Bỏ ghim' : 'Ghim lên đầu'}
                    >
                      <Star className={`w-4 h-4 ${item.isPinned ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>

                  {/* Card Title */}
                  <h4 className="font-bold text-base text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.description || 'Thư mục tài nguyên Google Drive'}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.tags.map(t => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onCopy(item.url, `Đã copy link ${item.title}`)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Sao chép link Google Drive"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {onEdit && (
                      <button
                        onClick={() => onEdit('media', item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete('media', item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-600 text-white font-medium text-xs transition-colors"
                  >
                    <span>Mở Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Table Mode */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">Ghim</th>
                  <th className="py-3.5 px-4 w-16">Loại</th>
                  <th className="py-3.5 px-4">Tên Thư Mục / Dạng Nguyên Liệu</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Tags / Nhóm</th>
                  <th className="py-3.5 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredItems.map(item => {
                  const isImage = item.category === 'ảnh';
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onTogglePin(item.id)}
                          className="text-slate-300 hover:text-amber-500 dark:text-slate-600 transition-colors"
                        >
                          <Star
                            className={`w-4 h-4 mx-auto ${
                              item.isPinned ? 'fill-amber-500 text-amber-500' : ''
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            isImage
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                          }`}
                        >
                          {isImage ? <ImageIcon className="w-3 h-3" /> : <VideoIcon className="w-3 h-3" />}
                          {isImage ? 'Ảnh' : 'Video'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-1">
                          {item.description}
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {(item.tags || []).map(t => (
                            <span
                              key={t}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onCopy(item.url, `Đã copy link ${item.title}`)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Copy link"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors"
                          >
                            <span>Mở</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

