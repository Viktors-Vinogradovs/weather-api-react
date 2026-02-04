-- Seed initial 10 cities (lat/lon for OpenWeather API)
INSERT INTO cities (name, country, lat, lon) VALUES
  ('London', 'GB', 51.5074, -0.1278),
  ('New York', 'US', 40.7128, -74.0060),
  ('Tokyo', 'JP', 35.6762, 139.6503),
  ('Sydney', 'AU', -33.8688, 151.2093),
  ('Paris', 'FR', 48.8566, 2.3522),
  ('Dubai', 'AE', 25.2048, 55.2708),
  ('São Paulo', 'BR', -23.5505, -46.6333),
  ('Mumbai', 'IN', 19.0760, 72.8777),
  ('Toronto', 'CA', 43.6532, -79.3832),
  ('Cape Town', 'ZA', -33.9249, 18.4241)
ON CONFLICT (lat, lon) DO NOTHING;
