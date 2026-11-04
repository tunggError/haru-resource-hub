# Haru Resource Hub - Phần Mềm Quản Lý Tài Nguyên Đội Ngũ Haru5C

Hệ thống Web App hiện đại giải quyết triệt để tình trạng link Google Drive và tài khoản rải rác, gây nhầm lẫn trên Google Sheet của đội ngũ Haru5C.

## 🚀 Tính Năng Chính

1. **Kho Nguyên Liệu Media (Ảnh & Video)**:
   - Thư mục Google Drive Master tổng hợp toàn bộ tài nguyên.
   - 19 Thư mục Ảnh (Sản phẩm, Bảng giá, Feedback, KOL/KOC, Background, Kỹ sư, Chuyên gia...).
   - 19 Thư mục Video (Feedback đợt 1, Review đợt 1, Livestream, Cảnh trám B-roll, Nhà máy, Hiệu ứng...).
   - Đánh dấu **Ghim (Favorite)** để truy cập nhanh các mục hay dùng.
   - Hai chế độ xem: **Thẻ Bento Grid** và **Bảng Danh Sách**.
   - Phân loại theo thẻ Tag (Sản phẩm, Chiến dịch Đợt 1, Bằng chứng Review, Uy tín Chuyên môn...).

2. **Quản Lý Kênh Mạng Xã Hội (Channels & Fanpages)**:
   - Theo dõi Fanpage Facebook (Brand, Performance), TikTok, YouTube, Shopee.
   - Hiển thị người phụ trách (Vương, Phước, Tùng,...).
   - Bảo mật tài khoản, mật khẩu (ẩn/hiện thông minh), mã 2FA, tên Via.
   - Nút copy thông tin 1 chạm và mở trực tiếp kênh.

3. **Tài Khoản Công Cụ AI & Thiết Kế (Shared Tools)**:
   - ChatGPT, Gemini + Veo3, LadiPage, Capcut, Grok.
   - Quản lý tài khoản, mật khẩu, mã xác thực 2FA Authenticator Secret.
   - Nút mở web công cụ trực tiếp.

4. **Nghiên Cứu Đối Thủ Cạnh Tranh (Competitor Intel)**:
   - Phân tích Rootbio, Kagreen, Bio36, Dasshu, Zozo.
   - Key USP, thông điệp truyền thông, chương trình khuyến mãi/ưu đãi.
   - Nguồn kiểm chứng (VTV, Báo Dân Việt, Nông Nghiệp...).
   - Link xem trực tiếp Video Reels / Fanpage đối thủ.

5. **Đồng Bộ & Tiện Ích Cao Cấp**:
   - **Đồng bộ trực tiếp từ Google Sheet**: Nhấn nút `Đồng bộ Sheet` để tự động kéo dữ liệu mới nhất từ file Google Sheet gốc.
   - **Thêm / Sửa / Xóa (CRUD)** linh hoạt.
   - **Tìm kiếm toàn năng (`⌘K` hoặc `Ctrl+K`)**.
   - **Giao diện Dark Mode / Light Mode**.
   - **Sao lưu dữ liệu (Export JSON)**.

---

## 🛠️ Hướng Dẫn Khởi Chạy

### 1. Cài đặt dependencies (đã cài đặt sẵn)
```bash
npm install
```

### 2. Chạy ứng dụng

- **Chạy Web Server (Đã build sẵn Frontend & Backend trên port 3001)**:
```bash
npm run server
```
Truy cập: `http://localhost:3001`

- **Hoặc chạy chế độ phát triển Frontend Vite (Hot Reload trên port 5173)**:
```bash
npm run dev
```

---

## 📂 Cấu Trúc Dự Án

```
haru-resource-hub/
├── data/
│   └── resources.json          # Cơ sở dữ liệu JSON lưu trữ toàn bộ tài nguyên
├── server.js                   # Node.js Express Backend API (Sync Google Sheet, CRUD, Static serve)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Header, đồng bộ Google Sheet, theme toggle
│   │   ├── OverviewStats.jsx   # Thống kê, Banner Master Drive, Quick access pin
│   │   ├── MediaSection.jsx    # Phân loại 38 thư mục Ảnh/Video, tag filters, grid/table view
│   │   ├── ChannelSection.jsx  # Quản lý kênh Social, via, tài khoản, 2FA
│   │   ├── ToolSection.jsx     # Quản lý tài khoản ChatGPT, Gemini, Ladipage...
│   │   ├── CompetitorSection.jsx # Thẻ phân tích đối thủ & video reels ads
│   │   ├── ResourceModal.jsx   # Modal Thêm mới / Chỉnh sửa tài nguyên
│   │   └── Toast.jsx           # Thông báo sao chép & đồng bộ nổi
│   ├── services/
│   │   └── api.js              # Gọi API backend
│   ├── App.jsx                 # Main layout & router tabs
│   └── index.css               # Tailwind CSS v4 styling
└── vite.config.js
```

