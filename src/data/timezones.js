// Full list of IANA timezones, using the browser's Intl support when available.
const FALLBACK_ZONES = [
  'Pacific/Midway','Pacific/Honolulu','America/Anchorage','America/Los_Angeles','America/Tijuana',
  'America/Denver','America/Phoenix','America/Chicago','America/Mexico_City','America/New_York',
  'America/Toronto','America/Bogota','America/Lima','America/Caracas','America/Halifax',
  'America/Sao_Paulo','America/Argentina/Buenos_Aires','Atlantic/Azores','UTC','Europe/London',
  'Europe/Dublin','Europe/Lisbon','Europe/Madrid','Europe/Paris','Europe/Berlin','Europe/Amsterdam',
  'Europe/Rome','Europe/Zurich','Europe/Stockholm','Europe/Vienna','Europe/Warsaw','Europe/Athens',
  'Europe/Helsinki','Europe/Bucharest','Europe/Istanbul','Europe/Moscow','Africa/Casablanca',
  'Africa/Lagos','Africa/Cairo','Africa/Johannesburg','Africa/Nairobi','Asia/Jerusalem','Asia/Beirut',
  'Asia/Baghdad','Asia/Riyadh','Asia/Kuwait','Asia/Qatar','Asia/Dubai','Asia/Tehran','Asia/Kabul',
  'Asia/Karachi','Asia/Kolkata','Asia/Colombo','Asia/Kathmandu','Asia/Dhaka','Asia/Yangon',
  'Asia/Bangkok','Asia/Jakarta','Asia/Ho_Chi_Minh','Asia/Shanghai','Asia/Hong_Kong','Asia/Singapore',
  'Asia/Kuala_Lumpur','Asia/Manila','Asia/Taipei','Asia/Seoul','Asia/Tokyo','Australia/Perth',
  'Australia/Adelaide','Australia/Darwin','Australia/Brisbane','Australia/Sydney','Australia/Melbourne',
  'Pacific/Guam','Pacific/Auckland','Pacific/Fiji','Atlantic/Reykjavik','Atlantic/Cape_Verde',
];

export function getAllTimezones() {
  try {
    if (typeof Intl.supportedValuesOf === 'function') {
      const zones = Intl.supportedValuesOf('timeZone');
      if (zones && zones.length) return zones;
    }
  } catch (e) {
    // fall through to fallback list
  }
  return FALLBACK_ZONES;
}

export function getTimezoneOffsetLabel(zone) {
  try {
    const now = new Date();
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });
    const parts = dtf.formatToParts(now);
    const h = parts.find(p => p.type === 'hour')?.value ?? '00';
    const m = parts.find(p => p.type === 'minute')?.value ?? '00';
    return `${h}:${m}`;
  } catch (e) {
    return '';
  }
}

export function getDefaultTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch (e) {
    return 'UTC';
  }
}
