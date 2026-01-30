import { CITIES } from '../config/cities.js';

const API_BASE = 'https://api.openweathermap.org/data/2.5';

/**
 * Normalize a single city weather response from OpenWeatherMap
 * Ensures all fields are present (null when missing)
 */
function normalizeWeatherData(data) {
  return {
    id: data.id,
    name: data.name,
    country: data.sys?.country || null,
    coord: {
      lat: data.coord?.lat || null,
      lon: data.coord?.lon || null,
    },
    timezoneOffsetSec: data.timezone || 0,
    weather: {
      condition: data.weather?.[0]?.main || null,
      description: data.weather?.[0]?.description || null,
      icon: data.weather?.[0]?.icon || null,
      temp: data.main?.temp ?? null,
      feelsLike: data.main?.feels_like ?? null,
      tempMin: data.main?.temp_min ?? null,
      tempMax: data.main?.temp_max ?? null,
      humidity: data.main?.humidity ?? null,
      pressure: data.main?.pressure ?? null,
      windSpeed: data.wind?.speed ?? null,
      windDeg: data.wind?.deg ?? null,
      windGust: data.wind?.gust ?? null,
      clouds: data.clouds?.all ?? null,
      visibility: data.visibility ?? null,
      rain1h: data.rain?.['1h'] ?? null,
      rain3h: data.rain?.['3h'] ?? null,
      snow1h: data.snow?.['1h'] ?? null,
      snow3h: data.snow?.['3h'] ?? null,
      sunrise: data.sys?.sunrise ?? null,
      sunset: data.sys?.sunset ?? null,
    },
  };
}

/**
 * Fetch weather for a single city by ID (internal helper)
 */
async function fetchSingleCity(cityId, units, apiKey) {
  const url = `${API_BASE}/weather?id=${cityId}&units=${units}&appid=${apiKey}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error(`Failed to fetch city ${cityId}:`, errorData.message);
    return null; // Return null for failed cities, don't break the whole request
  }
  
  return response.json();
}

/**
 * Fetch weather for all configured cities using individual calls
 * (Free tier compatible - no group endpoint needed)
 */
export async function fetchAllCitiesWeather(units = 'metric') {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    throw { code: 'CONFIG_ERROR', message: 'API key not configured', status: 500 };
  }

  try {
    // Fetch all cities in parallel using individual /weather calls
    const cityIds = CITIES.map(c => c.id);
    const promises = cityIds.map(id => fetchSingleCity(id, units, apiKey));
    const results = await Promise.all(promises);
    
    // Filter out failed requests and normalize successful ones
    const cities = results
      .filter(data => data !== null)
      .map(normalizeWeatherData);
    
    if (cities.length === 0) {
      throw {
        code: 'OPENWEATHER_ERROR',
        message: 'Failed to fetch weather data. Please check your API key.',
        status: 502,
      };
    }
    
    return {
      units,
      cities,
    };
  } catch (error) {
    if (error.code) throw error;
    throw {
      code: 'NETWORK_ERROR',
      message: 'Failed to connect to weather service',
      status: 502,
    };
  }
}

/**
 * Fetch weather for a single city by ID
 */
export async function fetchCityWeather(cityId, units = 'metric') {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  
  if (!apiKey) {
    throw { code: 'CONFIG_ERROR', message: 'API key not configured', status: 500 };
  }

  const url = `${API_BASE}/weather?id=${cityId}&units=${units}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 404) {
        throw {
          code: 'CITY_NOT_FOUND',
          message: `City with ID ${cityId} not found`,
          status: 404,
        };
      }
      
      throw {
        code: 'OPENWEATHER_ERROR',
        message: errorData.message || `OpenWeatherMap API error: ${response.status}`,
        status: response.status === 401 ? 401 : 502,
      };
    }

    const data = await response.json();
    
    return {
      units,
      city: normalizeWeatherData(data),
    };
  } catch (error) {
    if (error.code) throw error;
    throw {
      code: 'NETWORK_ERROR',
      message: 'Failed to connect to weather service',
      status: 502,
    };
  }
}
