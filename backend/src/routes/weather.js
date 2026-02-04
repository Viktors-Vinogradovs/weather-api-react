import { Router } from 'express';
import { fetchAllCitiesWeather, fetchCityWeather } from '../services/weatherService.js';
import { findById } from '../repositories/citiesRepository.js';

const router = Router();
const VALID_UNITS = ['metric', 'imperial', 'standard'];

router.get('/', async (req, res) => {
  try {
    const units = req.query.units || 'metric';
    const force = req.query.force === 'true' || req.headers['x-force-refresh'] === 'true';

    if (!VALID_UNITS.includes(units)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_UNITS',
          message: `Invalid units parameter. Must be one of: ${VALID_UNITS.join(', ')}`,
        },
      });
    }

    const data = await fetchAllCitiesWeather(units, force);
    res.json(data);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: { code: error.code || 'UNKNOWN_ERROR', message: error.message },
    });
  }
});

router.get('/:cityId', async (req, res) => {
  try {
    const cityId = parseInt(req.params.cityId, 10);
    const units = req.query.units || 'metric';
    const force = req.query.force === 'true' || req.headers['x-force-refresh'] === 'true';

    if (isNaN(cityId)) {
      return res.status(400).json({
        error: { code: 'INVALID_CITY_ID', message: 'City ID must be a number' },
      });
    }

    const dbCity = await findById(cityId);
    if (!dbCity) {
      return res.status(404).json({
        error: { code: 'CITY_NOT_FOUND', message: 'City not found' },
      });
    }

    if (!VALID_UNITS.includes(units)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_UNITS',
          message: `Invalid units parameter. Must be one of: ${VALID_UNITS.join(', ')}`,
        },
      });
    }

    const data = await fetchCityWeather(cityId, units, force);
    res.json(data);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: { code: error.code || 'UNKNOWN_ERROR', message: error.message },
    });
  }
});

export default router;
