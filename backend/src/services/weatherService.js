import * as citiesRepo from '../repositories/citiesRepository.js';
import * as cache from '../utils/cache.js';

const API_BASE = 'https://api.openweathermap.org/data/2.5';

function normalizeWeatherData(apiData, dbCity) {
  return {
    id: dbCity.id,
    name: apiData.name || dbCity.name,
    country: apiData.sys?.country || dbCity.country,
    coord: {
      lat: apiData.coord?.lat ?? dbCity.lat,
      lon: apiData.coord?.lon ?? dbCity.lon,
    },
    timezoneOffsetSec: apiData.timezone || 0,
    weather: {
      condition: apiData.weather?.[0]?.main || null,
      description: apiData.weather?.[0]?.description || null,
      icon: apiData.weather?.[0]?.icon || null,
      temp: apiData.main?.temp ?? null,
      feelsLike: apiData.main?.feels_like ?? null,
      tempMin: apiData.main?.temp_min ?? null,
      tempMax: apiData.main?.temp_max ?? null,
      humidity: apiData.main?.humidity ?? null,
      pressure: apiData.main?.pressure ?? null,
      windSpeed: apiData.wind?.speed ?? null,
      windDeg: apiData.wind?.deg ?? null,
      windGust: apiData.wind?.gust ?? null,
      clouds: apiData.clouds?.all ?? null,
      visibility: apiData.visibility ?? null,
      rain1h: apiData.rain?.['1h'] ?? null,
      rain3h: apiData.rain?.['3h'] ?? null,
      snow1h: apiData.snow?.['1h'] ?? null,
      snow3h: apiData.snow?.['3h'] ?? null,
      sunrise: apiData.sys?.sunrise ?? null,
      sunset: apiData.sys?.sunset ?? null,
    },
  };
}

async function fetchWeatherByCoords(lat, lon, units, apiKey) {
  const url = `${API_BASE}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error(`Weather fetch failed for ${lat},${lon}:`, err.message);
    return null;
  }
  return response.json();
}

async function fetchAllCitiesWeatherInternal(units, apiKey) {
  const dbCities = await citiesRepo.findAll();
  if (dbCities.length === 0) {
    return { units, cities: [], lastUpdated: Date.now() };
  }

  const promises = dbCities.map((c) =>
    fetchWeatherByCoords(parseFloat(c.lat), parseFloat(c.lon), units, apiKey)
  );
  const results = await Promise.allSettled(promises);

  const cities = results.map((result, i) => {
    const dbCity = dbCities[i];
    const dbId = dbCity.id;
    const meta = { name: dbCity.name, country: dbCity.country };

    if (result.status === 'fulfilled' && result.value) {
      return normalizeWeatherData(result.value, { id: dbId, ...meta, lat: dbCity.lat, lon: dbCity.lon });
    }
    return {
      id: dbId,
      name: meta.name,
      country: meta.country,
      unavailable: true,
    };
  });

  return { units, cities, lastUpdated: Date.now() };
}

export async function fetchAllCitiesWeather(units = 'metric', force = false) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw { code: 'CONFIG_ERROR', message: 'API key not configured', status: 500 };
  }

  if (!force) {
    const cached = cache.get('list', null, units);
    if (cached) return cached;
  }

  try {
    const data = await fetchAllCitiesWeatherInternal(units, apiKey);

    if (data.cities.length > 0 && data.cities.every((c) => c.unavailable)) {
      throw {
        code: 'OPENWEATHER_ERROR',
        message: 'Failed to fetch weather data. Please check your API key.',
        status: 502,
      };
    }

    cache.set('list', null, units, data);
    return data;
  } catch (err) {
    if (err.code) throw err;
    const isDbError = err.code === 'ECONNREFUSED' || err.message?.includes('connect') || err.message?.includes('ENOTFOUND');
    throw {
      code: isDbError ? 'DATABASE_ERROR' : 'NETWORK_ERROR',
      message: isDbError
        ? 'Database connection failed. Is PostgreSQL running? Check DATABASE_URL in .env'
        : 'Failed to connect to weather service',
      status: isDbError ? 503 : 502,
    };
  }
}

async function fetchCityWeatherInternal(dbId, units, apiKey) {
  const dbCity = await citiesRepo.findById(dbId);
  if (!dbCity) {
    throw { code: 'CITY_NOT_FOUND', message: 'City not found', status: 404 };
  }

  const lat = parseFloat(dbCity.lat);
  const lon = parseFloat(dbCity.lon);
  const apiData = await fetchWeatherByCoords(lat, lon, units, apiKey);

  if (!apiData) {
    throw {
      code: 'OPENWEATHER_ERROR',
      message: 'Failed to fetch weather for this city',
      status: 502,
    };
  }

  const city = normalizeWeatherData(apiData, {
    id: dbCity.id,
    name: dbCity.name,
    country: dbCity.country,
    lat,
    lon,
  });
  return { units, city, lastUpdated: Date.now() };
}

export async function fetchCityWeather(dbId, units = 'metric', force = false) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw { code: 'CONFIG_ERROR', message: 'API key not configured', status: 500 };
  }

  if (!force) {
    const cached = cache.get('city', dbId, units);
    if (cached) return cached;
  }

  try {
    const data = await fetchCityWeatherInternal(dbId, units, apiKey);
    cache.set('city', dbId, units, data);
    return data;
  } catch (err) {
    if (err.code) throw err;
    const isDbError = err.code === 'ECONNREFUSED' || err.message?.includes('connect') || err.message?.includes('ENOTFOUND');
    throw {
      code: isDbError ? 'DATABASE_ERROR' : 'NETWORK_ERROR',
      message: isDbError
        ? 'Database connection failed. Is PostgreSQL running? Check DATABASE_URL in .env'
        : 'Failed to connect to weather service',
      status: isDbError ? 503 : 502,
    };
  }
}
