// All "now" calculations respect the user's chosen timezone setting.

export function nowInZone(timezone) {
  try {
    // Build a Date whose local fields match the target timezone's wall-clock time.
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    }).formatToParts(now).reduce((acc, p) => {
      acc[p.type] = p.value;
      return acc;
    }, {});
    const hour = parts.hour === '24' ? '00' : parts.hour;
    return new Date(
      `${parts.year}-${parts.month}-${parts.day}T${hour}:${parts.minute}:${parts.second}`
    );
  } catch (e) {
    return new Date();
  }
}

export function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function monthKeyFromParts(year, month) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

export function monthLabel(year, month) {
  return new Date(year, month, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function formatTimestamp(ts, timezone) {
  const d = new Date(ts);
  try {
    return d.toLocaleString(undefined, {
      timeZone: timezone,
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    });
  } catch (e) {
    return d.toLocaleString();
  }
}

export function formatTimeOnly(ts, timezone) {
  const d = new Date(ts);
  try {
    return d.toLocaleString(undefined, { timeZone: timezone, hour: 'numeric', minute: '2-digit' });
  } catch (e) {
    return d.toLocaleTimeString();
  }
}

export function relativeDay(ts, timezone) {
  const txDate = nowInZoneFromTs(ts, timezone);
  const today = nowInZone(timezone);
  const txDay = new Date(txDate.getFullYear(), txDate.getMonth(), txDate.getDate());
  const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.round((todayDay - txDay) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return formatTimestamp(ts, timezone).split(',')[0];
}

function nowInZoneFromTs(ts, timezone) {
  try {
    const d = new Date(ts);
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    }).formatToParts(d).reduce((acc, p) => { acc[p.type] = p.value; return acc; }, {});
    const hour = parts.hour === '24' ? '00' : parts.hour;
    return new Date(`${parts.year}-${parts.month}-${parts.day}T${hour}:${parts.minute}:${parts.second}`);
  } catch (e) {
    return new Date(ts);
  }
}
