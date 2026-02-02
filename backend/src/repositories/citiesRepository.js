import { query } from '../db/index.js';

export async function findAll() {
  const result = await query(
    'SELECT id, name, country, state, lat, lon, created_at FROM cities ORDER BY created_at ASC'
  );
  return result.rows;
}

export async function findById(id) {
  const result = await query(
    'SELECT id, name, country, state, lat, lon FROM cities WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

export async function create({ name, country, state, lat, lon }) {
  const result = await query(
    `INSERT INTO cities (name, country, state, lat, lon)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, country, state, lat, lon, created_at`,
    [name, country, state || null, lat, lon]
  );
  return result.rows[0];
}

export async function remove(id) {
  const result = await query('DELETE FROM cities WHERE id = $1 RETURNING id', [id]);
  return result.rowCount > 0;
}

export async function existsByLatLon(lat, lon) {
  const result = await query(
    'SELECT id FROM cities WHERE lat = $1 AND lon = $2',
    [lat, lon]
  );
  return result.rows.length > 0;
}
