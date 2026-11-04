import React, { useState, useMemo } from 'react';
import {
  Clapperboard,
  FileText,
  Video,
  PlusCircle,
  Search,
  Filter,
  User,
  Users,
  Link as LinkIcon,
  ExternalLink,
  Copy,
  Edit2,
  Trash2,
  Sparkles,
  CheckCircle2,
  Clock,
  PlayCircle,
  Layers,
  ArrowRight,
  TrendingUp,
  Tag,
  Hash,
  X,
  Save,
  Shuffle
} from 'lucide-react';

export default function MediaProductionSection({
  productions = [],
  onCreate,
  onUpdate,
  onDelete,
  onCopy
}) {
  const [filterStaff, setFilterStaff] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    staff: 'Tùng',
    contentCode: '',
    videoCode: '',
    contentType: 'Edit không có live',
    contentTitle: '',
    contentSummary: '',
    videoSummary: '',
    writer: 'Tùng',
    editor: 'Tùng',
    adsRunner: 'Tùng',
    link: '',
    status: 'Đang Quay / Dựng',
    note: ''
  });

  const staffMembers = ['Tùng', 'Vương', 'Phước', 'Nhung'];

  const staffPrefixes = {
    'Tùng': 'T',
    'Vương': 'V',
    'Phước': 'P',
    'Nhung': 'N'
  };

  const statusOptions = [
    'Lên Ý Tưởng',
    'Đang Viết KB',
    'Đang Quay / Dựng',
    'Đã Hoàn Thiện',
    'Đang Chạy Ads'
  ];

  const contentTypeOptions = [
    'Edit không có live',
    'Edit ghép thêm live',
    'Ghép live + frame',
    'Hướng Dẫn Sử Dụng',
    'Feedback Khách Hàng',
    'Review Nhà Vườn',
    'Video AI Thực Tế',
    'Livestream Cắt Đoạn',
    'Khác'
  ];

  // Helper: Auto-generate code pair for staff
  const generateCodes = (staffName, isRandom = false) => {
    const prefix = staffPrefixes[staffName] || staffName.charAt(0).toUpperCase();

    if (isRandom) {
      // Random 3-char hex hash
      const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
      return {
        contentCode: `Content_${prefix}${randomPart}`,
        videoCode: `Video_${prefix}${randomPart}`
      };
    } else {
      // Find next sequential number for this staff
      const existingNumbers = productions
        .map(p => {
          const match = p.contentCode?.match(new RegExp(`Content_${prefix}([0-9]+)`, 'i'));
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter(n => n > 0);

      const nextNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
      return {
        contentCode: `Content_${prefix}${nextNum}`,
        videoCode: `Video_${prefix}${nextNum}`
      };
    }
  };

  // Open modal for Create
  const handleOpenCreate = () => {
    const defaultStaff = 'Tùng';
    const codes = generateCodes(defaultStaff);
    setEditingItem(null);
    setFormData({
      staff: defaultStaff,
      contentCode: codes.contentCode,
      videoCode: codes.videoCode,
      contentType: 'Edit không có live',
      contentTitle: '',
      contentSummary: '',
      videoSummary: '',
      writer: defaultStaff,
      editor: defaultStaff,
      adsRunner: defaultStaff,
      link: '',
      status: 'Đang Quay / Dựng',
      note: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = item => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  // When staff changes in form, suggest new code if creating
  const handleStaffChange = newStaff => {
    setFormData(prev => {
      if (!editingItem) {
        const codes = generateCodes(newStaff);
        return {
          ...prev,
          staff: newStaff,
          writer: newStaff,
          editor: newStaff,
          adsRunner: newStaff === 'Nhung' ? 'Vương' : newStaff,
          contentCode: codes.contentCode,
          videoCode: codes.videoCode
        };
      }
      return { ...prev, staff: newStaff };
    });
  };

  // Trigger random code generation
  const handleRegenerateRandomCodes = () => {
    const codes = generateCodes(formData.staff || 'Tùng', true);
    setFormData(prev => ({
      ...prev,
      contentCode: codes.contentCode,
      videoCode: codes.videoCode
    }));
  };

  // Trigger sequential code generation
  const handleRegenerateSeqCodes = () => {
    const codes = generateCodes(formData.staff || 'Tùng', false);
    setFormData(prev => ({
      ...prev,
      contentCode: codes.contentCode,
      videoCode: codes.videoCode
    }));
  };

  // Save Modal
  const handleSubmitModal = e => {
    e.preventDefault();
    if (!formData.contentTitle.trim()) {
      alert('Vui lòng nhập chủ đề / nội dung content!');
      return;
    }

    if (editingItem) {
      onUpdate(editingItem.id, formData);
    } else {
      onCreate(formData);
    }
    setIsModalOpen(false);
  };

  // Filtered productions
  const filteredProductions = useMemo(() => {
    return productions.filter(p => {
      // Filter by Staff
      if (filterStaff !== 'all') {
        const involved = [p.writer, p.editor, p.adsRunner, p.staff].filter(Boolean);
        if (!involved.includes(filterStaff)) return false;
      }

      // Filter by Status
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;

      // Filter by Search Query
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const matchCode = (p.contentCode || '').toLowerCase().includes(q) || (p.videoCode || '').toLowerCase().includes(q);
        const matchTitle = (p.contentTitle || '').toLowerCase().includes(q);
        const matchContent = (p.contentSummary || '').toLowerCase().includes(q);
        const matchVideo = (p.videoSummary || '').toLowerCase().includes(q);
        const matchType = (p.contentType || '').toLowerCase().includes(q);
        if (!matchCode && !matchTitle && !matchContent && !matchVideo && !matchType) return false;
      }

      return true;
    });
  }, [productions, filterStaff, filterStatus, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = productions.length;
    const runningAds = productions.filter(p => p.status === 'Đang Chạy Ads').length;
    const completed = productions.filter(p => p.status === 'Đã Hoàn Thiện').length;
    const inProgress = productions.filter(p => p.status === 'Đang Quay / Dựng' || p.status === 'Đang Viết KB').length;

    const countByStaff = {};
    staffMembers.forEach(s => {
      countByStaff[s] = productions.filter(p => [p.writer, p.editor, p.staff].includes(s)).length;
    });

    return { total, runningAds, completed, inProgress, countByStaff };
  }, [productions]);

  const getStatusBadge = status => {
    switch (status) {
      case 'Đang Chạy Ads':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'Đã Hoàn Thiện':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'Đang Quay / Dựng':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-700';
      case 'Đang Viết KB':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-blue-100 border border-white/20">
              <Clapperboard className="w-3.5 h-3.5 text-amber-300" />
              <span>Quản Lý Sản Xuất Media • Mã Content & Mã Video</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Trung Tâm Quản Lý Kịch Bản & Video Haru5C
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Giải quyết bài toán kết nối giữa <strong>Mã Content</strong> và <strong>Mã Video</strong>. Từng nhân viên nắm rõ nội dung kịch bản viết về cái gì, video quay cảnh gì và đang ở khâu nào — thao tác trực tiếp 100% trên ứng dụng.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-900 font-extrabold hover:bg-blue-50 active:scale-95 transition-all shadow-lg text-xs sm:text-sm whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span>Tạo Mã & Kịch Bản Mới</span>
            </button>
          </div>
        </div>

        {/* Quick Stats in Banner */}
        <div className="mt-6 pt-5 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
            <span className="text-blue-200 text-xs block">Tổng số đầu việc:</span>
            <span className="text-xl font-black text-white">{stats.total} sản phẩm</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
            <span className="text-emerald-200 text-xs block">Đang chạy Ads:</span>
            <span className="text-xl font-black text-emerald-300">{stats.runningAds} video</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
            <span className="text-blue-200 text-xs block">Đã hoàn thiện:</span>
            <span className="text-xl font-black text-blue-200">{stats.completed} video</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
            <span className="text-amber-200 text-xs block">Đang quay / dựng:</span>
            <span className="text-xl font-black text-amber-300">{stats.inProgress} việc</span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Staff Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1">
            <User className="w-3.5 h-3.5" /> Nhân sự:
          </span>
          <button
            onClick={() => setFilterStaff('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              filterStaff === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            Tất cả ({productions.length})
          </button>
          {staffMembers.map(staff => (
            <button
              key={staff}
              onClick={() => setFilterStaff(staff === filterStaff ? 'all' : staff)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                filterStaff === staff
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {staff} ({stats.countByStaff[staff] || 0})
            </button>
          ))}
        </div>

        {/* Status Filter & Search */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 text-xs">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            {statusOptions.map(st => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm mã hoặc chủ đề..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

      </div>

      {/* Production Items Grid */}
      {filteredProductions.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Clapperboard className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            Không tìm thấy sản phẩm media nào
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Bấm nút <strong>"Tạo Mã & Kịch Bản Mới"</strong> để thêm sản phẩm đầu tiên!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredProductions.map(item => {
            return (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-950/5 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  
                  {/* Top: Linked Codes Header */}
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Content Code Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono text-xs font-bold">
                        <FileText className="w-3.5 h-3.5 text-blue-500" />
                        <span>{item.contentCode}</span>
                      </span>

                      {/* Connection Icon */}
                      <span className="text-slate-300 dark:text-slate-600 font-black">🔗</span>

                      {/* Video Code Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-mono text-xs font-bold">
                        <Video className="w-3.5 h-3.5 text-purple-500" />
                        <span>{item.videoCode}</span>
                      </span>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Main Title & Type */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {item.contentType}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug pt-1">
                      {item.contentTitle}
                    </h3>
                  </div>

                  {/* 2-Column Details: What is Content about? & What is Video doing? */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    
                    {/* Content Detail Box */}
                    <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-1.5">
                      <div className="flex items-center justify-between text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider text-[10px]">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Content Viết Về:
                        </span>
                        {item.contentSummary && (
                          <button
                            onClick={() => onCopy(item.contentSummary, 'Đã copy nội dung Content!')}
                            className="hover:text-blue-900 dark:hover:text-white"
                            title="Copy nội dung"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {item.contentSummary || 'Chưa cập nhật tóm tắt nội dung content'}
                      </p>
                    </div>

                    {/* Video Detail Box */}
                    <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 space-y-1.5">
                      <div className="flex items-center justify-between text-purple-700 dark:text-purple-300 font-bold uppercase tracking-wider text-[10px]">
                        <span className="flex items-center gap-1">
                          <Video className="w-3 h-3" /> Video Quay / Dựng Về:
                        </span>
                        {item.videoSummary && (
                          <button
                            onClick={() => onCopy(item.videoSummary, 'Đã copy nội dung Video!')}
                            className="hover:text-purple-900 dark:hover:text-white"
                            title="Copy nội dung"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {item.videoSummary || 'Chưa cập nhật cách quay dựng video'}
                      </p>
                    </div>

                  </div>

                  {/* 3 Roles Info Strip */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    {item.writer && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        ✍️ Viết KB: <strong>{item.writer}</strong>
                      </span>
                    )}
                    {item.editor && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        🎬 Dựng video: <strong>{item.editor}</strong>
                      </span>
                    )}
                    {item.adsRunner && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800/60">
                        🚀 Chạy Ads: <strong>{item.adsRunner}</strong>
                      </span>
                    )}
                  </div>

                  {/* Note if exists */}
                  {item.note && (
                    <div className="mt-2.5 text-xs text-slate-400 italic">
                      Ghi chú: {item.note}
                    </div>
                  )}

                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Chỉnh sửa sản phẩm"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        const summary = `📌 [${item.contentCode} 🔗 ${item.videoCode}]\n📝 Tiêu đề: ${item.contentTitle}\n✍️ Viết KB: ${item.writer} | 🎬 Dựng: ${item.editor} | 🚀 Ads: ${item.adsRunner || 'Chưa giao'}\n📄 Nội dung Content: ${item.contentSummary}\n🎬 Video: ${item.videoSummary}\n${item.link ? `🔗 Link: ${item.link}` : ''}`;
                        onCopy(summary, `Đã copy thông tin cặp mã ${item.contentCode}`);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                      title="Copy toàn bộ thông tin"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {item.link ? (
                    <a
                      href={item.link.startsWith('http') ? item.link : '#'}
                      target={item.link.startsWith('http') ? '_blank' : '_self'}
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white font-medium text-xs transition-colors truncate max-w-[200px]"
                      title={item.link}
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">Xem File / Video</span>
                      {item.link.startsWith('http') && <ExternalLink className="w-3 h-3 shrink-0" />}
                    </a>
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">Chưa đính kèm link</span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                  {editingItem ? 'Chỉnh Sửa Sản Phẩm Media' : 'Tạo Mã & Kịch Bản Mới'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tự động sinh và kết nối Mã Content & Mã Video theo nhân viên
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitModal} className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
              
              {/* Staff Choice & Code Generator Controls */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="font-bold text-slate-800 dark:text-slate-200">
                    Nhân viên phụ trách:
                  </label>
                  <div className="flex items-center gap-1.5">
                    {staffMembers.map(staff => (
                      <button
                        key={staff}
                        type="button"
                        onClick={() => handleStaffChange(staff)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          formData.staff === staff
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        {staff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto Generated Code Pair */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                      Mã Content:
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.contentCode}
                      onChange={e => setFormData({ ...formData, contentCode: e.target.value })}
                      placeholder="Content_T1"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-blue-600 dark:text-blue-400 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                      Mã Video (Liên kết):
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.videoCode}
                      onChange={e => setFormData({ ...formData, videoCode: e.target.value })}
                      placeholder="Video_T1"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-purple-600 dark:text-purple-400 text-xs outline-none"
                    />
                  </div>
                </div>

                {/* Regeneration Buttons */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400 text-[11px]">Sinh mã phù hợp:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRegenerateSeqCodes}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-[11px] font-semibold hover:bg-slate-100"
                      title="Sinh mã theo số thứ tự kế tiếp"
                    >
                      # Theo thứ tự (T1, T2...)
                    </button>
                    <button
                      type="button"
                      onClick={handleRegenerateRandomCodes}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-semibold hover:bg-indigo-100 flex items-center gap-1"
                      title="Sinh mã ngẫu nhiên duy nhất"
                    >
                      <Shuffle className="w-3 h-3" />
                      <span>Ngẫu nhiên duy nhất</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Title & Format */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Chủ đề / Tiêu đề Content:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contentTitle}
                    onChange={e => setFormData({ ...formData, contentTitle: e.target.value })}
                    placeholder="Ví dụ: Quy trình kích rễ cây sầu riêng vụ nghịch..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Dạng Content:
                  </label>
                  <select
                    value={formData.contentType}
                    onChange={e => setFormData({ ...formData, contentType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-medium"
                  >
                    {contentTypeOptions.map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Content Explanation (What is content writing about?) */}
              <div>
                <label className="block font-bold text-blue-700 dark:text-blue-400 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Content viết về cái gì? (Tóm tắt kịch bản & thông điệp chính):</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.contentSummary}
                  onChange={e => setFormData({ ...formData, contentSummary: e.target.value })}
                  placeholder="Ghi rõ nội dung bài viết, luận điểm chính, lời thoại hoặc câu key..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none leading-relaxed"
                />
              </div>

              {/* Video Explanation (What is video doing?) */}
              <div>
                <label className="block font-bold text-purple-700 dark:text-purple-400 mb-1 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5" />
                  <span>Video làm về nội dung gì? (Cách quay dựng, cảnh quay, hiệu ứng):</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.videoSummary}
                  onChange={e => setFormData({ ...formData, videoSummary: e.target.value })}
                  placeholder="Quay cảnh gì? Cắt livestream đoạn nào? Ghép khung frame hay dùng cảnh trám gì?..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none leading-relaxed"
                />
              </div>

              {/* Assignees (3 Roles) */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs mb-1">
                    Người Viết KB:
                  </label>
                  <select
                    value={formData.writer}
                    onChange={e => setFormData({ ...formData, writer: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    {staffMembers.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs mb-1">
                    Người Dựng/Hoàn Thiện:
                  </label>
                  <select
                    value={formData.editor}
                    onChange={e => setFormData({ ...formData, editor: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    {staffMembers.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs mb-1">
                    Người Chạy Ads:
                  </label>
                  <select
                    value={formData.adsRunner}
                    onChange={e => setFormData({ ...formData, adsRunner: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option value="">Chưa có</option>
                    {staffMembers.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Link & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Link Video Drive / Tài liệu:
                  </label>
                  <input
                    type="text"
                    value={formData.link || ''}
                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Trạng thái tiến độ:
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-semibold text-indigo-600 dark:text-indigo-400"
                  >
                    {statusOptions.map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ghi chú nội bộ:
                </label>
                <input
                  type="text"
                  value={formData.note || ''}
                  onChange={e => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Ví dụ: Chờ kỹ sư gửi kịch bản, chạy thử ngân sách 200k..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingItem ? 'Lưu Thay Đổi' : 'Tạo Sản Phẩm Media'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
