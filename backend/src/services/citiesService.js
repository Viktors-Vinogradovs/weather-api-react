import * as citiesRepo from '../repositories/citiesRepository.js';
import * as geocoding from './geocodingService.js';
import * as cache from '../utils/cache.js';

export async function list() {
  const rows = await citiesRepo.findAll();
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    country: r.country,
    state: r.state,
    lat: parseFloat(r.lat),
    lon: parseFloat(r.lon),
  }));
}

export async function add({ name, country, state, lat, lon }) {
  const exists = await citiesRepo.existsByLatLon(lat, lon);
  if (exists) {
    throw { code: 'DUPLICATE_CITY', message: 'This city is already in your list', status: 409 };
  }
  const city = await citiesRepo.create({ name, country, state, lat, lon });
  cache.invalidateList();
  return {
    id: city.id,
    name: city.name,
    country: city.country,
    state: city.state,
    lat: parseFloat(city.lat),
    lon: parseFloat(city.lon),
  };
}

export async function remove(id) {
  const existed = await citiesRepo.remove(id);
  if (!existed) {
    throw { code: 'CITY_NOT_FOUND', message: 'City not found', status: 404 };
  }
  cache.invalidateList();
  cache.invalidateCity(id);
}

export async function search(query) {
  const q = (query || '').trim();
  if (!q) {
    return [];
  }
  return geocoding.searchCities(q);
}
