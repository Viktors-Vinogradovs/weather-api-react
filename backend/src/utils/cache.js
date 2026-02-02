/**
 * Simple in-memory cache with TTL
 * TTL = 5 minutes
 * Cache key format: "list:{units}" or "city:{cityId}:{units}"
 */

const TTL_MS = 5 * 60 * 1000; // 5 minutes

const cache = new Map();

function getKey(type, identifier, units) {
  if (type === 'list') {
    return `list:${units}`;
  }
  return `city:${identifier}:${units}`;
}

function isExpired(entry) {
  return Date.now() - entry.timestamp > TTL_MS;
}

export function get(type, identifier, units) {
  const key = getKey(type, identifier, units);
  const entry = cache.get(key);
  if (!entry || isExpired(entry)) {
    return null;
  }
  return entry.data;
}

export function set(type, identifier, units, data) {
  const key = getKey(type, identifier, units);
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function has(type, identifier, units) {
  const entry = get(type, identifier, units);
  return entry !== null;
}

export function invalidateList() {
  for (const key of cache.keys()) {
    if (key.startsWith('list:')) {
      cache.delete(key);
    }
  }
}

export function invalidateCity(dbId) {
  for (const key of cache.keys()) {
    if (key.startsWith(`city:${dbId}:`)) {
      cache.delete(key);
    }
  }
}
