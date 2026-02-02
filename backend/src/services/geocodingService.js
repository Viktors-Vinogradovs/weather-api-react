const GEOCODING_BASE = 'https://api.openweathermap.org/geo/1.0';

export async function searchCities(query, limit = 8) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw { code: 'CONFIG_ERROR', message: 'API key not configured', status: 500 };
  }

  const q = encodeURIComponent(query.trim());
  const url = `${GEOCODING_BASE}/direct?q=${q}&limit=${limit}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw {
        code: 'GEOCODING_ERROR',
        message: err.message || `Geocoding API error: ${response.status}`,
        status: 502,
      };
    }
    const data = await response.json();
    return (data || []).map((item) => ({
      name: item.name,
      country: item.country,
      state: item.state || null,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    if (error.code) throw error;
    throw {
      code: 'NETWORK_ERROR',
      message: 'Failed to connect to geocoding service',
      status: 502,
    };
  }
}
