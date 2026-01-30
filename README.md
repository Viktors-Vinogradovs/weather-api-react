# Weather Dashboard

A weather dashboard application that displays current weather for 10+ cities worldwide using the OpenWeatherMap API.

## Features

- **City List View**: Display weather cards for 10 major cities worldwide
- **City Detail View**: Detailed weather statistics including temperature, humidity, wind, pressure, visibility, sunrise/sunset
- **Unit Switcher**: Toggle between Metric (°C), Imperial (°F), and Standard (K) units
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Graceful error states with retry functionality

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express
- **API**: OpenWeatherMap

## Prerequisites

- Node.js 18+ 
- OpenWeatherMap API key (free tier works)

## Getting Started

### 1. Clone and Setup

```bash
# Clone the repository
cd weather-api-react

# Copy environment file
cp .env.example .env
```

### 2. Add Your API Key

Edit `.env` and add your OpenWeatherMap API key:

```
OPENWEATHER_API_KEY=your_actual_api_key_here
```

Get a free API key at: https://openweathermap.org/api

### 3. Run Locally (Development)

**Backend:**
```bash
cd backend
npm install
cp ../.env .env   # Copy the env file
npm run dev
```

**Frontend (in a new terminal):**
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### 4. Run with Docker Compose

```bash
# Make sure .env file exists with your API key
docker-compose up --build
```

Open http://localhost:5173 in your browser.

## API Endpoints

### GET /api/weather
Returns weather for all configured cities.

**Query Parameters:**
- `units` (optional): `metric` | `imperial` | `standard` (default: `metric`)

**Response:**
```json
{
  "units": "metric",
  "cities": [
    {
      "id": 2643743,
      "name": "London",
      "country": "GB",
      "coord": { "lat": 51.5085, "lon": -0.1257 },
      "timezoneOffsetSec": 0,
      "weather": {
        "condition": "Clouds",
        "description": "overcast clouds",
        "icon": "04d",
        "temp": 12.5,
        "feelsLike": 10.2,
        "humidity": 81,
        "pressure": 1012,
        "windSpeed": 5.4,
        "windDeg": 230,
        "clouds": 90,
        "visibility": 10000,
        "rain1h": null,
        "snow1h": null,
        "sunrise": 1706770123,
        "sunset": 1706802456
      }
    }
  ]
}
```

### GET /api/weather/:cityId
Returns weather for a single city.

**Query Parameters:**
- `units` (optional): `metric` | `imperial` | `standard` (default: `metric`)

## Configured Cities

1. London, GB
2. New York, US
3. Tokyo, JP
4. Sydney, AU
5. Paris, FR
6. Dubai, AE
7. São Paulo, BR
8. Mumbai, IN
9. Toronto, CA
10. Cape Town, ZA

## Project Structure

```
weather-api-react/
├── backend/
│   ├── src/
│   │   ├── index.js           # Express server entry
│   │   ├── routes/
│   │   │   └── weather.js     # Weather API routes
│   │   ├── services/
│   │   │   └── weatherService.js  # OpenWeather API client
│   │   └── config/
│   │       └── cities.js      # City configuration
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── main.jsx           # React entry
│   │   ├── App.jsx            # App with routing
│   │   ├── pages/
│   │   │   ├── CityListPage.jsx
│   │   │   └── CityDetailPage.jsx
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── UnitSwitcher.jsx
│   │   │   ├── CityCard.jsx
│   │   │   ├── WeatherDetail.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   └── ErrorState.jsx
│   │   ├── context/
│   │   │   └── UnitsContext.jsx
│   │   └── utils/
│   │       └── formatTime.js
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## License

MIT
