# Weather Dashboard

A weather dashboard application that displays current weather for cities worldwide. Users can add and remove cities via search (OpenWeather Geocoding API). Weather data is stored in PostgreSQL and fetched by coordinates.

## Features

- **City List View**: Display weather cards for cities from the database
- **Add City**: Search by name and add cities to your list
- **Remove City**: Delete cities from your list
- **City Detail View**: Detailed weather statistics (temp, humidity, wind, pressure, visibility, sunrise/sunset)
- **Unit Switcher**: Metric (°C), Imperial (°F), Standard (K)
- **Caching**: 5-minute in-memory cache with force refresh
- **Responsive Design**: Tailwind CSS

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (Docker)
- **API**: OpenWeatherMap (Weather + Geocoding)

## Prerequisites

- Docker & Docker Compose
- OpenWeatherMap API key ([get one free](https://openweathermap.org/api))

## Getting Started

```bash
# 1. Copy env file and add your API key
cp .env.example .env
# Edit .env and set OPENWEATHER_API_KEY=your_actual_key

# 2. Start everything with Docker
docker-compose up --build
```

Open **http://localhost:5173**. Postgres is initialized automatically with 10 cities.

### Commands

| Command | Description |
|---------|-------------|
| `docker-compose up --build` | Start all services |
| `docker-compose up -d` | Start in background |
| `docker-compose down` | Stop services |
| `docker-compose down -v` | Stop and remove database (fresh start) |

## API Endpoints

### Weather
- `GET /api/weather?units=metric&force=true` — List weather for all cities
- `GET /api/weather/:id?units=metric&force=true` — Weather for one city (id = DB id)

### Cities
- `GET /api/cities` — List all cities in DB
- `GET /api/cities/search?q=London` — Search cities (Geocoding API)
- `POST /api/cities` — Add city `{ name, country, state?, lat, lon }`
- `DELETE /api/cities/:id` — Remove city

## Project Structure

```
weather-api-react/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── db/
│   │   ├── repositories/
│   │   ├── routes/
│   │   │   ├── weather.js
│   │   │   └── cities.js
│   │   ├── services/
│   │   │   ├── weatherService.js
│   │   │   ├── citiesService.js
│   │   │   └── geocodingService.js
│   │   └── utils/
│   │       └── cache.js
│   ├── scripts/
│   │   ├── init.sql      # Runs on first Postgres start
│   │   └── seed.sql      # Seeds 10 initial cities
│   └── Dockerfile
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       │   ├── AddCityModal.jsx
│       │   ├── CityCard.jsx
│       │   └── ...
│       └── ...
├── docker-compose.yml
└── .env.example
```

## License

MIT
