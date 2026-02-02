-- Cities table: stores user's city list with lat/lon for weather API
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country CHAR(2) NOT NULL,
  state VARCHAR(100),
  lat DECIMAL(9, 6) NOT NULL,
  lon DECIMAL(9, 6) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(lat, lon)
);

CREATE INDEX IF NOT EXISTS idx_cities_created_at ON cities(created_at);
