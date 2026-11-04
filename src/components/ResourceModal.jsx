import React, { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';

export default function ResourceModal({
  isOpen,
  onClose,
  onSave,
  type = 'media', // media, channels, tools, competitors
  initialData = null
}) {
  const [activeType, setActiveType] = useState(type);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setActiveType(type || 'media');
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      // Default templates
      if (type === 'media') {
        setFormData({
          title: '',
          rawTitle: '',
          type: 'image',
          category: 'ảnh',
          url: '',
          description: '',
          tags: 'Ảnh, Thiết kế'
        });
      } else if (type === 'channels') {
        setFormData({
          channelName: '',
          platform: 'Facebook',
          platformType: 'Facebook Performance',
          url: '',
          account: '',
          password: '',
          twoFactor: '',
          viaName: '',
          manager: 'Vương'
        });
      } else if (type === 'tools') {
        setFormData({
          name: '',
          account: '',
          password: '',
          authCode: '',
          manager: '',
          url: ''
        });
      } else if (type === 'competitors') {
        setFormData({
          brand: '',
          usp: '',
          message: '',
          promotion: '',
          sources: '',
          fbUrl: ''
        });
      }
    }
  }, [isOpen, type, initialData]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const finalData = { ...formData };

    if (activeType === 'media') {
      if (typeof finalData.tags === 'string') {
        finalData.tags = finalData.tags
          .split(',')
          .map(t => t.trim())
          .filter(Boolean);
      }
      finalData.rawTitle = finalData.rawTitle || finalData.title;
    }

    onSave(activeType, finalData, initialData?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
              {initialData ? 'Chỉnh Sửa Tài Nguyên' : 'Thêm Tài Nguyên Mới'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cập nhật vào kho tài nguyên chung của đội ngũ Haru5C
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Selector (only when adding new) */}
        {!initialData && (
          <div className="px-5 pt-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            {[
              { id: 'media', label: 'Media (Ảnh/Video)' },
              { id: 'channels', label: 'Kênh Social' },
              { id: 'tools', label: 'Công cụ AI' },
              { id: 'competitors', label: 'Đối thủ' }
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setActiveType(t.id);
                  setFormData({});
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeType === t.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {/* MEDIA FORM */}
          {activeType === 'media' && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Loại tài nguyên:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleChange('category', 'ảnh');
                      handleChange('type', 'image');
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      formData.category === 'ảnh'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Kho Ảnh
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleChange('category', 'video');
                      handleChange('type', 'video');
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      formData.category === 'video'
                        ? 'bg-purple-50 border-purple-500 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Kho Video
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tên thư mục / Dạng tư liệu:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bảng giá đại lý mới, Feedback đợt 2..."
                  value={formData.title || ''}
                  onChange={e => handleChange('title', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Đường dẫn Google Drive:
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={formData.url || ''}
                  onChange={e => handleChange('url', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (phân cách bằng dấu phẩy):
                </label>
                <input
                  type="text"
                  placeholder="Sản phẩm, Bảng giá, Đại lý..."
                  value={
                    Array.isArray(formData.tags)
                      ? formData.tags.join(', ')
                      : formData.tags || ''
                  }
                  onChange={e => handleChange('tags', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mô tả chi tiết:
                </label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú về thư mục này..."
                  value={formData.description || ''}
                  onChange={e => handleChange('description', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </>
          )}

          {/* CHANNELS FORM */}
          {activeType === 'channels' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nền tảng:
                  </label>
                  <select
                    value={formData.platform || 'Facebook'}
                    onChange={e => handleChange('platform', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="Facebook">Facebook</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Shopee">Shopee</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Loại kênh / Mục đích:
                  </label>
                  <input
                    type="text"
                    placeholder="Brand, Performance..."
                    value={formData.platformType || ''}
                    onChange={e => handleChange('platformType', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tên kênh / Fanpage:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tổng Kho Phân Bón Haru5C..."
                  value={formData.channelName || ''}
                  onChange={e => handleChange('channelName', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Link Fanpage / Kênh:
                </label>
                <input
                  type="url"
                  placeholder="https://facebook.com/..."
                  value={formData.url || ''}
                  onChange={e => handleChange('url', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Người phụ trách:
                  </label>
                  <input
                    type="text"
                    placeholder="Vương, Phước, Tùng..."
                    value={formData.manager || ''}
                    onChange={e => handleChange('manager', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tên Via:
                  </label>
                  <input
                    type="text"
                    placeholder="Tên via quản trị..."
                    value={formData.viaName || ''}
                    onChange={e => handleChange('viaName', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tài khoản / Mail:
                  </label>
                  <input
                    type="text"
                    value={formData.account || ''}
                    onChange={e => handleChange('account', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mật khẩu:
                  </label>
                  <input
                    type="text"
                    value={formData.password || ''}
                    onChange={e => handleChange('password', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mã 2FA:
                </label>
                <input
                  type="text"
                  value={formData.twoFactor || ''}
                  onChange={e => handleChange('twoFactor', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>
            </>
          )}

          {/* TOOLS FORM */}
          {activeType === 'tools' && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tên công cụ AI / SaaS:
                </label>
                <input
                  type="text"
                  required
                  placeholder="ChatGPT, Midjourney, LadiPage..."
                  value={formData.name || ''}
                  onChange={e => handleChange('name', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Link website công cụ:
                </label>
                <input
                  type="url"
                  placeholder="https://chatgpt.com..."
                  value={formData.url || ''}
                  onChange={e => handleChange('url', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email / Tài khoản:
                  </label>
                  <input
                    type="text"
                    value={formData.account || ''}
                    onChange={e => handleChange('account', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mật khẩu:
                  </label>
                  <input
                    type="text"
                    value={formData.password || ''}
                    onChange={e => handleChange('password', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mã 2FA (Secret Key):
                  </label>
                  <input
                    type="text"
                    value={formData.authCode || ''}
                    onChange={e => handleChange('authCode', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Người phụ trách:
                  </label>
                  <input
                    type="text"
                    placeholder="Vương, Hiệu..."
                    value={formData.manager || ''}
                    onChange={e => handleChange('manager', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* COMPETITORS FORM */}
          {activeType === 'competitors' && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Thương hiệu đối thủ:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tên đối thủ..."
                  value={formData.brand || ''}
                  onChange={e => handleChange('brand', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Key USP chính:
                </label>
                <input
                  type="text"
                  placeholder="Kích rễ, cải tạo đất, nano..."
                  value={formData.usp || ''}
                  onChange={e => handleChange('usp', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Thông điệp, câu key truyền thông cụ thể:
                </label>
                <textarea
                  rows={3}
                  value={formData.message || ''}
                  onChange={e => handleChange('message', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chính sách ưu đãi / Khuyến mãi:
                </label>
                <input
                  type="text"
                  placeholder="Mua 3 tặng 1, giảm 45%..."
                  value={formData.promotion || ''}
                  onChange={e => handleChange('promotion', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nguồn tham khảo:
                  </label>
                  <input
                    type="text"
                    placeholder="VTV9, Báo Dân Việt..."
                    value={formData.sources || ''}
                    onChange={e => handleChange('sources', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Link Reel / Fanpage FB:
                  </label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/..."
                    value={formData.fbUrl || ''}
                    onChange={e => handleChange('fbUrl', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
            >
              <Save className="w-4 h-4" />
              <span>{initialData ? 'Lưu thay đổi' : 'Thêm tài nguyên'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

