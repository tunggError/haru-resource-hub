/**
 * Haru5C Dynamic Date Utilities
 * Ensures dates, weekdays, and weekly schedules automatically advance each day.
 */

const DAYS_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const DAYS_FULL = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

export function formatDateToDDMM(d = new Date()) {
  const dateObj = typeof d === 'string' ? new Date(d) : d;
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}

export function getTodayDateStr() {
  return formatDateToDDMM(new Date());
}

export function getTomorrowDateStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return formatDateToDDMM(d);
}

export function getDayOfWeekShort(d = new Date()) {
  const dateObj = typeof d === 'string' ? new Date(d) : d;
  return DAYS_SHORT[dateObj.getDay()];
}

export function getDayOfWeekFull(d = new Date()) {
  const dateObj = typeof d === 'string' ? new Date(d) : d;
  return DAYS_FULL[dateObj.getDay()];
}

/**
 * Returns an array of 'DD/MM' strings for the current week (Monday to Sunday)
 */
export function getCurrentWeekDates(targetDate = new Date()) {
  const d = new Date(targetDate);
  const day = d.getDay();
  // Monday as 1st day of week: Sunday (0) -> -6 days, Monday (1) -> 0 days, etc.
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const cur = new Date(monday);
    cur.setDate(monday.getDate() + i);
    weekDates.push(formatDateToDDMM(cur));
  }
  return weekDates;
}

export function getCurrentWeekRangeText(targetDate = new Date()) {
  const dates = getCurrentWeekDates(targetDate);
  return `Tuần ${dates[0]} - ${dates[dates.length - 1]}`;
}

/**
 * Find today duty item or graceful fallback
 */
export function findTodayDuty(dutySchedule = [], todayStr = getTodayDateStr()) {
  const found = dutySchedule.find(d => d.date === todayStr);
  if (found) return found;

  // Fallback: look for item matching today's day of week or return placeholder
  return {
    date: todayStr,
    dayOfWeek: getDayOfWeekShort(),
    assignees: 'Chưa phân công'
  };
}

/**
 * Find tomorrow duty item or graceful fallback
 */
export function findTomorrowDuty(dutySchedule = [], tomorrowStr = getTomorrowDateStr()) {
  const found = dutySchedule.find(d => d.date === tomorrowStr);
  if (found) return found;

  const d = new Date();
  d.setDate(d.getDate() + 1);
  return {
    date: tomorrowStr,
    dayOfWeek: getDayOfWeekShort(d),
    assignees: 'Chưa phân công'
  };
}

/**
 * Calculate total tasks for a given date from dailyReports
 */
export function calculateTasksForDate(dailyReports = {}, dateStr = getTodayDateStr()) {
  const dayMembers = dailyReports[dateStr];
  if (!dayMembers || !Array.isArray(dayMembers)) return 0;
  return dayMembers.reduce((acc, m) => acc + (m.tasks?.length || 0), 0);
}
