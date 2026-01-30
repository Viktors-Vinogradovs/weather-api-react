/**
 * Format a Unix timestamp to HH:MM in the city's local time
 * @param {number} timestamp - Unix timestamp (seconds)
 * @param {number} timezoneOffsetSec - Timezone offset from UTC in seconds
 * @returns {string} Formatted time string like "06:45 (UTC+5)"
 */
export function formatCityTime(timestamp, timezoneOffsetSec) {
  if (timestamp === null || timestamp === undefined) {
    return '—';
  }

  // Convert timestamp to milliseconds and apply timezone offset
  // timestamp is in UTC, we need to display it in city's local time
  const utcDate = new Date(timestamp * 1000);
  
  // Get UTC hours and minutes
  const utcHours = utcDate.getUTCHours();
  const utcMinutes = utcDate.getUTCMinutes();
  
  // Calculate city's local time by adding the offset
  const offsetHours = timezoneOffsetSec / 3600;
  const totalMinutes = utcHours * 60 + utcMinutes + (timezoneOffsetSec / 60);
  
  // Handle day overflow/underflow
  let localMinutes = totalMinutes % (24 * 60);
  if (localMinutes < 0) localMinutes += 24 * 60;
  
  const localHours = Math.floor(localMinutes / 60);
  const localMins = Math.round(localMinutes % 60);
  
  // Format time as HH:MM
  const timeStr = `${String(localHours).padStart(2, '0')}:${String(localMins).padStart(2, '0')}`;
  
  // Format UTC offset
  const offsetSign = offsetHours >= 0 ? '+' : '';
  const offsetStr = Number.isInteger(offsetHours) 
    ? `UTC${offsetSign}${offsetHours}` 
    : `UTC${offsetSign}${offsetHours.toFixed(1)}`;
  
  return `${timeStr} (${offsetStr})`;
}

/**
 * Format visibility in kilometers or meters
 * @param {number} visibility - Visibility in meters
 * @returns {string} Formatted visibility string
 */
export function formatVisibility(visibility) {
  if (visibility === null || visibility === undefined) {
    return '—';
  }
  
  if (visibility >= 1000) {
    return `${(visibility / 1000).toFixed(1)} km`;
  }
  return `${visibility} m`;
}

/**
 * Format wind direction from degrees to cardinal direction
 * @param {number} deg - Wind direction in degrees
 * @returns {string} Cardinal direction (N, NE, E, etc.)
 */
export function formatWindDirection(deg) {
  if (deg === null || deg === undefined) {
    return '—';
  }
  
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}
