// Hardcoded city list with OpenWeatherMap city IDs
// These IDs are stable and avoid city name ambiguity

export const CITIES = [
  { id: 2643743, name: 'London', country: 'GB' },
  { id: 5128581, name: 'New York', country: 'US' },
  { id: 1850147, name: 'Tokyo', country: 'JP' },
  { id: 2147714, name: 'Sydney', country: 'AU' },
  { id: 2988507, name: 'Paris', country: 'FR' },
  { id: 292223, name: 'Dubai', country: 'AE' },
  { id: 3448439, name: 'São Paulo', country: 'BR' },
  { id: 1275339, name: 'Mumbai', country: 'IN' },
  { id: 6167865, name: 'Toronto', country: 'CA' },
  { id: 3369157, name: 'Cape Town', country: 'ZA' },
];

// Check if a city ID is in our list
export const isValidCityId = (id) => CITIES.some(c => c.id === Number(id));
