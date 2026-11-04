import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'resources.json');

app.use(cors());
app.use(express.json());

// Helper: Read Data
function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return { media: [], channels: [], tools: [], competitors: [], sheetInfo: {} };
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading data:', err);
    return { media: [], channels: [], tools: [], competitors: [], sheetInfo: {} };
  }
}

// Helper: Save Data
function saveData(data) {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving data:', err);
    return false;
  }
}

// Simple RFC-compliant CSV parser
function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let curVal = '';

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        curVal += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push(curVal);
      curVal = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      row.push(curVal);
      lines.push(row);
      row = [];
      curVal = '';
    } else {
      curVal += c;
    }
  }
  if (curVal.length > 0 || row.length > 0) {
    row.push(curVal);
    lines.push(row);
  }
  return lines;
}

// Helper: Sync with Google Sheets
async function syncFromGoogleSheets() {
  const SPREADSHEET_ID = '1rs11DMTVgLmMbZJ0XnQTVqiTM3K5drrFrpGvQeyJ8fQ';
  const sheets = [
    { key: 'raw_materials', gid: '214358388' },
    { key: 'channels', gid: '0' },
    { key: 'tools', gid: '520506975' },
    { key: 'competitors', gid: '1914367773' }
  ];

  const fetched = {};

  for (const s of sheets) {
    const url = `https://docs.google.com/spreadsheets/d/1rs11DMTVgLmMbZJ0XnQTVqiTM3K5drrFrpGvQeyJ8fQ/export?format=csv&gid=${s.gid}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) {
      throw new Error(`Failed to fetch sheet gid ${s.gid}: ${res.statusText}`);
    }
    const csvText = await res.text();
    fetched[s.key] = parseCSV(csvText);
  }

  // Process raw materials (Media)
  const currentData = readData();
  const pinnedIds = new Set(
    (currentData.media || []).filter(m => m.isPinned).map(m => m.title)
  );

  const mediaList = [];
  // Root folder
  mediaList.push({
    id: 'mat-root',
    title: 'Nguyên Liệu Tổng (Master Folder)',
    rawTitle: 'Nguyên Liệu Tổng',
    type: 'folder',
    category: 'root',
    url: 'https://drive.google.com/drive/folders/1uwBsbBsm9uJYGZ2bJWOEAXQgImR-x1wg?usp=sharing',
    description: 'Thư mục mẹ chứa toàn bộ ảnh, video, tài liệu truyền thông của Haru5C trên Google Drive',
    tags: ['Tổng hợp', 'Master Drive', 'Tất cả tài nguyên'],
    isPinned: true
  });

  const rawRows = fetched.raw_materials || [];
  for (let i = 4; i < rawRows.length; i++) {
    const row = rawRows[i];
    // Ảnh: col 0, 1, 2
    if (row.length >= 3 && row[1]?.trim() && row[2]?.trim()) {
      const stt = row[0].trim();
      const name = row[1].trim();
      const link = row[2].trim();
      const tags = ['Ảnh'];
      const nLow = name.toLowerCase();
      if (['sản phẩm', 'bảng giá', 'kho', 'đại lý', 'nhà máy'].some(w => nLow.includes(w))) {
        tags.push('Sản phẩm & Vận hành');
      } else if (['chuyên gia', 'kỹ sư', 'chứng nhận'].some(w => nLow.includes(w))) {
        tags.push('Uy tín & Chuyên môn');
      } else if (['feedback', 'chủ vườn', 'kol', 'koc', 'avarta', 'người dùng'].some(w => nLow.includes(w))) {
        tags.push('Bằng chứng & Review');
      } else {
        tags.push('Thiết kế & Đồ họa');
      }

      const fullTitle = `${stt}. ${name}`;
      mediaList.push({
        id: `img-${stt}-${mediaList.length}`,
        title: fullTitle,
        rawTitle: name,
        type: 'image',
        category: 'ảnh',
        url: link,
        tags,
        description: `Kho ảnh tư liệu ${name} phục vụ thiết kế, content và quảng cáo`,
        isPinned: pinnedIds.has(fullTitle) || ['sản phẩm', 'feeback', 'bảng giá'].includes(nLow)
      });
    }

    // Video: col 4, 5, 6
    if (row.length >= 7 && row[5]?.trim() && row[6]?.trim()) {
      const stt_v = row[4].trim();
      const name_v = row[5].trim();
      const link_v = row[6].trim();
      const tags_v = ['Video'];
      const nvLow = name_v.toLowerCase();
      if (nvLow.includes('đợt 1')) tags_v.push('Chiến dịch Đợt 1');
      if (['chuyên gia', 'kỹ sư', 'chứng nhận'].some(w => nvLow.includes(w))) {
        tags_v.push('Uy tín & Chuyên môn');
      } else if (['feedback', 'review', 'chủ vườn', 'kol', 'koc'].some(w => nvLow.includes(w))) {
        tags_v.push('Bằng chứng & Review');
      } else if (nvLow.includes('livestream')) {
        tags_v.push('Livestream');
      } else if (['cảnh trám', 'hiệu ứng', 'background'].some(w => nvLow.includes(w))) {
        tags_v.push('Footage & Dựng video');
      } else {
        tags_v.push('Sản xuất & Vận hành');
      }

      const fullTitle_v = `${stt_v}. ${name_v}`;
      mediaList.push({
        id: `vid-${stt_v}-${mediaList.length}`,
        title: fullTitle_v,
        rawTitle: name_v,
        type: 'video',
        category: 'video',
        url: link_v,
        tags: tags_v,
        description: `Kho video tư liệu ${name_v} dùng dựng reel, tiktok và quảng cáo`,
        isPinned: pinnedIds.has(fullTitle_v) || nvLow.includes('đợt 1')
      });
    }
  }

  // Process channels
  const channelsList = [];
  const chRows = fetched.channels || [];
  for (let i = 1; i < chRows.length; i++) {
    const r = chRows[i];
    if (!r || !r.some(v => v.trim())) continue;
    const stt = r[0]?.trim() || '';
    const platform_type = r[1]?.trim() || '';
    const name = r[2]?.trim() || '';
    const url = r[3]?.trim() || '';
    const acc = r[4]?.trim() || '';
    const pwd = r[5]?.trim() || '';
    const two_fa = r[6]?.trim() || '';
    const via = r[7]?.trim() || '';
    const manager = r[8]?.trim() || '';

    if (!platform_type && !name && !url) continue;

    let platform = 'Khác';
    const ptLow = platform_type.toLowerCase();
    if (ptLow.includes('tiktok')) platform = 'TikTok';
    else if (ptLow.includes('youtube')) platform = 'YouTube';
    else if (ptLow.includes('facebook') || ptLow.includes('fb')) platform = 'Facebook';
    else if (ptLow.includes('shopee')) platform = 'Shopee';

    channelsList.push({
      id: `chan-${stt}-${channelsList.length}`,
      stt,
      platformType: platform_type,
      platform,
      channelName: name || platform_type,
      url,
      account: acc,
      password: pwd,
      twoFactor: two_fa,
      viaName: via,
      manager,
      status: url ? 'Đang hoạt động' : 'Đang chuẩn bị'
    });
  }

  // Process tools
  const toolsList = [];
  const tRows = fetched.tools || [];
  for (let i = 1; i < tRows.length; i++) {
    const r = tRows[i];
    if (!r || !r.some(v => v.trim())) continue;
    const stt = r[0]?.trim() || '';
    const name = r[1]?.trim() || '';
    const acc = r[2]?.trim() || '';
    const pwd = r[3]?.trim() || '';
    const two_fa = r[4]?.trim() || '';
    const manager = r[5]?.trim() || '';

    if (!name) continue;
    const tLow = name.toLowerCase();
    let tool_url = '';
    if (tLow.includes('chatgpt')) tool_url = 'https://chatgpt.com';
    else if (tLow.includes('gemini')) tool_url = 'https://gemini.google.com';
    else if (tLow.includes('ladipage')) tool_url = 'https://ladipage.vn';
    else if (tLow.includes('capcut')) tool_url = 'https://www.capcut.com';
    else if (tLow.includes('grok')) tool_url = 'https://x.com/i/grok';

    toolsList.push({
      id: `tool-${stt}-${toolsList.length}`,
      stt,
      name,
      account: acc,
      password: pwd,
      authCode: two_fa,
      manager,
      url: tool_url,
      category: 'AI & Design'
    });
  }

  // Process competitors
  const competitorsList = [];
  const compRows = fetched.competitors || [];
  for (let i = 1; i < compRows.length; i++) {
    const r = compRows[i];
    if (!r || !r.some(v => v.trim())) continue;
    const brand = r[0]?.trim() || '';
    const usp = r[1]?.trim() || '';
    const message = r[2]?.trim() || '';
    const promo = r[3]?.trim() || '';
    const sources = r[4]?.trim() || '';
    const fb_url = r[5]?.trim() || '';

    if (!brand) continue;

    competitorsList.push({
      id: `comp-${i}`,
      brand,
      usp,
      message,
      promotion: promo,
      sources,
      fbUrl: fb_url
    });
  }

  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const updatedData = {
    sheetInfo: {
      sheetId: SPREADSHEET_ID,
      sheetUrl: 'https://docs.google.com/spreadsheets/d/1rs11DMTVgLmMbZJ0XnQTVqiTM3K5drrFrpGvQeyJ8fQ/edit?gid=214358388#gid=214358388',
      lastSyncedAt: timestamp
    },
    media: mediaList,
    channels: channelsList,
    tools: toolsList,
    competitors: competitorsList
  };

  saveData(updatedData);
  return updatedData;
}

// API Routes
app.get('/api/data', (req, res) => {
  const data = readData();
  res.json(data);
});

// Toggle Favorite / Pin
app.post('/api/toggle-pin/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();
  let found = false;

  data.media = (data.media || []).map(m => {
    if (m.id === id) {
      found = true;
      return { ...m, isPinned: !m.isPinned };
    }
    return m;
  });

  if (found) {
    saveData(data);
    return res.json({ success: true, media: data.media });
  }
  res.status(404).json({ error: 'Item not found' });
});

// Sync from Google Sheets
app.post('/api/sync', async (req, res) => {
  try {
    const updated = await syncFromGoogleSheets();
    res.json({ success: true, message: 'Đồng bộ Google Sheet thành công!', data: updated });
  } catch (err) {
    console.error('Sync failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// CRUD for any category: media, channels, tools, competitors
app.post('/api/resources/:type', (req, res) => {
  const { type } = req.params;
  const item = req.body;
  const data = readData();

  if (!data[type]) {
    return res.status(400).json({ error: `Loại tài nguyên không hợp lệ: ${type}` });
  }

  const newItem = {
    ...item,
    id: `${type}-${Date.now()}`
  };

  data[type].unshift(newItem);
  saveData(data);
  res.json({ success: true, item: newItem, data });
});

app.put('/api/resources/:type/:id', (req, res) => {
  const { type, id } = req.params;
  const updates = req.body;
  const data = readData();

  if (!data[type]) {
    return res.status(400).json({ error: `Loại tài nguyên không hợp lệ: ${type}` });
  }

  const idx = data[type].findIndex(it => it.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Không tìm thấy tài nguyên' });
  }

  data[type][idx] = { ...data[type][idx], ...updates };
  saveData(data);
  res.json({ success: true, item: data[type][idx], data });
});

app.delete('/api/resources/:type/:id', (req, res) => {
  const { type, id } = req.params;
  const data = readData();

  if (!data[type]) {
    return res.status(400).json({ error: `Loại tài nguyên không hợp lệ: ${type}` });
  }

  data[type] = data[type].filter(it => it.id !== id);
  saveData(data);
  res.json({ success: true, data });
});

// Export Backup
app.get('/api/export', (req, res) => {
  const data = readData();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=haru_resources_backup.json');
  res.send(JSON.stringify(data, null, 2));
});

// Serve static frontend files if built
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    // If request starts with /api, pass to 404 handler
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
