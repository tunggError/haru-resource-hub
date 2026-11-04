import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import OverviewStats from './components/OverviewStats';
import MediaSection from './components/MediaSection';
import ChannelSection from './components/ChannelSection';
import ToolSection from './components/ToolSection';
import CompetitorSection from './components/CompetitorSection';
import DailyChecklistSection from './components/DailyChecklistSection';
import ResourceModal from './components/ResourceModal';
import Toast from './components/Toast';
import {
  fetchAllData,
  togglePin,
  syncGoogleSheet,
  toggleChecklistTask,
  createResource,
  updateResource,
  deleteResource
} from './services/api';
import {
  Search,
  FolderOpen,
  Share2,
  Wrench,
  Swords,
  CheckSquare,
  Layers,
  Sparkles,
  Command,
  Download,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [data, setData] = useState({
    media: [],
    channels: [],
    tools: [],
    competitors: [],
    dailyReports: {},
    proposals: [],
    sheetInfo: {}
  });
  const [activeTab, setActiveTab] = useState('checklist'); // Default to checklist or media
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('haru_theme') === 'dark';
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'media',
    initialData: null
  });
  const [toasts, setToasts] = useState([]);
  const searchInputRef = useRef(null);

  // Apply dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('haru_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('haru_theme', 'light');
    }
  }, [isDark]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast helper
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const dismissToast = id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Copy helper
  const handleCopy = (text, message = 'Đã sao chép vào bộ nhớ tạm!') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    addToast(message, 'success');
  };

  // Fetch initial data
  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await fetchAllData();
      setData(res);
      localStorage.setItem('haru_resources_cache', JSON.stringify(res));
    } catch (err) {
      console.error('Failed to load data:', err);
      addToast('Không thể tải dữ liệu từ máy chủ', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Pin toggle
  const handleTogglePin = async id => {
    try {
      const res = await togglePin(id);
      if (res.success) {
        setData(prev => ({ ...prev, media: res.media }));
        addToast('Đã cập nhật trạng thái ghim!', 'success');
      }
    } catch (err) {
      addToast('Lỗi khi cập nhật ghim', 'error');
    }
  };

  // Checklist Task Toggle
  const handleToggleTask = async (date, memberName, taskId) => {
    // Optimistic UI update
    setData(prev => {
      const updatedReports = { ...prev.dailyReports };
      if (updatedReports[date]) {
        updatedReports[date] = updatedReports[date].map(m => {
          if (m.name === memberName && m.tasks) {
            return {
              ...m,
              tasks: m.tasks.map(t => {
                if (t.id === taskId) {
                  return { ...t, completed: !t.completed };
                }
                return t;
              })
            };
          }
          return m;
        });
      }
      return { ...prev, dailyReports: updatedReports };
    });

    try {
      const res = await toggleChecklistTask(date, memberName, taskId);
      if (res.success) {
        setData(prev => ({ ...prev, dailyReports: res.dailyReports }));
      }
    } catch (err) {
      console.error(err);
      addToast('Lỗi khi cập nhật tiến độ công việc', 'error');
    }
  };

  // Sync Google Sheet (Both sheets)
  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const res = await syncGoogleSheet();
      if (res.success) {
        setData(res.data);
        addToast('Đồng bộ Google Sheet & Báo Cáo thành công!', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast(`Lỗi đồng bộ: ${err.message}`, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // CRUD actions
  const handleOpenAddModal = (type = activeTab) => {
    setModalState({
      isOpen: true,
      type: type === 'checklist' ? 'media' : type,
      initialData: null
    });
  };

  const handleEdit = (type, item) => {
    setModalState({
      isOpen: true,
      type,
      initialData: item
    });
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài nguyên này?')) return;
    try {
      const res = await deleteResource(type, id);
      if (res.success) {
        setData(res.data);
        addToast('Đã xóa tài nguyên thành công', 'success');
      }
    } catch (err) {
      addToast('Lỗi khi xóa tài nguyên', 'error');
    }
  };

  const handleSaveModal = async (type, itemData, id) => {
    try {
      if (id) {
        const res = await updateResource(type, id, itemData);
        if (res.success) {
          setData(res.data);
          addToast('Cập nhật tài nguyên thành công!', 'success');
        }
      } else {
        const res = await createResource(type, itemData);
        if (res.success) {
          setData(res.data);
          addToast('Thêm tài nguyên mới thành công!', 'success');
        }
      }
    } catch (err) {
      addToast('Lỗi khi lưu tài nguyên', 'error');
    }
  };

  const todayTasks = (data.dailyReports?.['04/11'] || []).reduce((acc, m) => acc + (m.tasks?.length || 0), 0);

  const tabs = [
    { id: 'checklist', label: 'Báo Cáo & Checklist', icon: CheckSquare, count: todayTasks || 18 },
    { id: 'media', label: 'Kho Media Haru', icon: FolderOpen, count: data.media?.length - 1 || 0 },
    { id: 'channels', label: 'Tài Khoản Kênh', icon: Share2, count: data.channels?.length || 0 },
    { id: 'tools', label: 'Công Cụ AI & SaaS', icon: Wrench, count: data.tools?.length || 0 },
    { id: 'competitors', label: 'Nghiên Cứu Đối Thủ', icon: Swords, count: data.competitors?.length || 0 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Toast System */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Navbar */}
      <Navbar
        sheetInfo={data.sheetInfo}
        onSync={handleSync}
        isSyncing={isSyncing}
        onOpenAddModal={() => handleOpenAddModal(activeTab)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* Top Hero & Quick Stats */}
        <OverviewStats
          data={data}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onCopy={handleCopy}
          onTogglePin={handleTogglePin}
        />

        {/* Global Search & Nav Tabs Bar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-800 overflow-x-auto scrollbar-none">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Global Search Box */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm mọi tài nguyên (Ctrl+K)..."
                className="w-full pl-10 pr-12 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs text-slate-900 dark:text-slate-100"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Xóa
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Tab Content Display */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Đang tải toàn bộ dữ liệu tài nguyên & báo cáo Haru5C...
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-200">
            {activeTab === 'checklist' && (
              <DailyChecklistSection
                dailyReports={data.dailyReports}
                proposals={data.proposals}
                checklistSheetUrl={data.sheetInfo?.checklistSheetUrl}
                onToggleTask={handleToggleTask}
                onSync={handleSync}
                isSyncing={isSyncing}
                onCopy={handleCopy}
              />
            )}

            {activeTab === 'media' && (
              <MediaSection
                items={data.media}
                onCopy={handleCopy}
                onTogglePin={handleTogglePin}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'channels' && (
              <ChannelSection
                items={data.channels}
                onCopy={handleCopy}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'tools' && (
              <ToolSection
                items={data.tools}
                onCopy={handleCopy}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'competitors' && (
              <CompetitorSection
                items={data.competitors}
                onCopy={handleCopy}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchQuery={searchQuery}
              />
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">
              H
            </div>
            <span>Haru Resource Hub • Đội Ngũ Haru5C Organic Bio Fertilizer</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/api/export"
              target="_blank"
              download
              className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sao lưu dữ liệu (JSON)</span>
            </a>
            <span>•</span>
            <a
              href={data.sheetInfo?.checklistSheetUrl || 'https://docs.google.com/spreadsheets/d/1jsQPZeIsKwkOYAxZ3uq0OZ5TiCqUDBrPb0zrTxQghzQ/edit?gid=0#gid=0'}
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Sheet Báo Cáo</span>
            </a>
            <span>•</span>
            <a
              href={data.sheetInfo?.sheetUrl || 'https://docs.google.com/spreadsheets/d/1rs11DMTVgLmMbZJ0XnQTVqiTM3K5drrFrpGvQeyJ8fQ/edit?gid=214358388#gid=214358388'}
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Sheet Tài Nguyên</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Resource Modal (Create/Edit) */}
      <ResourceModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        initialData={modalState.initialData}
        onClose={() => setModalState({ isOpen: false, type: 'media', initialData: null })}
        onSave={handleSaveModal}
      />

    </div>
  );
}
