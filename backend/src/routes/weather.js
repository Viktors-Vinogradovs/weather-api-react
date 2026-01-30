import { Router } from 'express';
import { fetchAllCitiesWeather, fetchCityWeather } from '../services/weatherService.js';
import { isValidCityId } from '../config/cities.js';

const router = Router();

// Valid units values
const VALID_UNITS = ['metric', 'imperial', 'standard'];

/**
 * GET /api/weather
 * Returns weather for all configured cities
 * Query params: units (metric|imperial|standard)
 */
router.get('/', async (req, res) => {
  try {
    const units = req.query.units || 'metric';
    
    if (!VALID_UNITS.includes(units)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_UNITS',
          message: `Invalid units parameter. Must be one of: ${VALID_UNITS.join(', ')}`,
        },
      });
    }

    const data = await fetchAllCitiesWeather(units);
    res.json(data);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'An error occurred',
      },
    });
  }
});

/**
 * GET /api/weather/:cityId
 * Returns weather for a single city
 * Query params: units (metric|imperial|standard)
 */
router.get('/:cityId', async (req, res) => {
  try {
    const { cityId } = req.params;
    const units = req.query.units || 'metric';

    // Validate cityId is a number
    if (!/^\d+$/.test(cityId)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_CITY_ID',
          message: 'City ID must be a numeric value',
        },
      });
    }

    // Check if city is in our configured list
    if (!isValidCityId(cityId)) {
      return res.status(404).json({
        error: {
          code: 'CITY_NOT_CONFIGURED',
          message: `City ID ${cityId} is not in the configured city list`,
        },
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

    const data = await fetchCityWeather(cityId, units);
    res.json(data);
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      error: {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'An error occurred',
      },
    });
  }
});

export default router;
