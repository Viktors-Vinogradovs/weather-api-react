import { Router } from 'express';
import * as citiesService from '../services/citiesService.js';

const router = Router();

/**
 * GET /api/cities
 * List all cities from DB
 */
router.get('/', async (req, res) => {
  try {
    const cities = await citiesService.list();
    res.json({ cities });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: { code: error.code || 'UNKNOWN_ERROR', message: error.message },
    });
  }
});

/**
 * GET /api/cities/search?q=...
 * Search cities via OpenWeather Geocoding API
 */
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const results = await citiesService.search(q);
    res.json({ results });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: { code: error.code || 'UNKNOWN_ERROR', message: error.message },
    });
  }
});

/**
 * POST /api/cities
 * Add a city { name, country, state?, lat, lon }
 */
router.post('/', async (req, res) => {
  try {
    const { name, country, state, lat, lon } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Name is required' },
      });
    }
    if (!country || typeof country !== 'string' || country.length !== 2) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Country must be a 2-letter code' },
      });
    }
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    if (isNaN(latNum) || isNaN(lonNum) || latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Valid lat/lon required' },
      });
    }

    const city = await citiesService.add({
      name: name.trim(),
      country: country.toUpperCase().trim(),
      state: state ? String(state).trim() : null,
      lat: latNum,
      lon: lonNum,
    });
    res.status(201).json({ city });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: { code: error.code || 'UNKNOWN_ERROR', message: error.message },
    });
  }
});

/**
 * DELETE /api/cities/:id
 * Remove a city by DB id
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        error: { code: 'INVALID_ID', message: 'City ID must be a number' },
      });
    }
    await citiesService.remove(id);
    res.status(204).send();
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: { code: error.code || 'UNKNOWN_ERROR', message: error.message },
    });
  }
});

export default router;
