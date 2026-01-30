import { useUnits } from '../context/UnitsContext';
import { formatCityTime, formatVisibility, formatWindDirection } from '../utils/formatTime';

function StatCard({ icon, label, value, subValue }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-2 text-gray-500 mb-1">
        <span>{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-xl font-semibold text-gray-800">{value}</div>
      {subValue && <div className="text-sm text-gray-500">{subValue}</div>}
    </div>
  );
}

export default function WeatherDetail({ city }) {
  const { getUnitLabels } = useUnits();
  const labels = getUnitLabels();
  const { name, country, coord, timezoneOffsetSec, weather } = city;
  
  const iconUrl = weather.icon 
    ? `https://openweathermap.org/img/wn/${weather.icon}@4x.png` 
    : null;

  return (
    <div>
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{name}</h1>
            <p className="text-blue-100">{country}</p>
            {coord.lat && coord.lon && (
              <p className="text-sm text-blue-200 mt-1">
                {coord.lat.toFixed(2)}°, {coord.lon.toFixed(2)}°
              </p>
            )}
          </div>
          {iconUrl && (
            <img 
              src={iconUrl} 
              alt={weather.description || 'Weather'} 
              className="w-24 h-24 -mt-2 -mr-2"
            />
          )}
        </div>
        
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-bold">
              {weather.temp !== null ? Math.round(weather.temp) : '—'}
            </span>
            <span className="text-2xl text-blue-100">{labels.temp}</span>
          </div>
          <p className="text-lg capitalize mt-1">{weather.description || 'No data'}</p>
          {weather.feelsLike !== null && (
            <p className="text-blue-200 mt-1">
              Feels like {Math.round(weather.feelsLike)}{labels.temp}
            </p>
          )}
        </div>

        {/* Min/Max Temp */}
        {(weather.tempMin !== null || weather.tempMax !== null) && (
          <div className="flex gap-4 mt-4 text-blue-100">
            {weather.tempMax !== null && (
              <span>↑ {Math.round(weather.tempMax)}{labels.temp}</span>
            )}
            {weather.tempMin !== null && (
              <span>↓ {Math.round(weather.tempMin)}{labels.temp}</span>
            )}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard 
          icon="💧" 
          label="Humidity" 
          value={weather.humidity !== null ? `${weather.humidity}%` : '—'} 
        />
        
        <StatCard 
          icon="🌡️" 
          label="Pressure" 
          value={weather.pressure !== null ? `${weather.pressure} ${labels.pressure}` : '—'} 
        />
        
        <StatCard 
          icon="💨" 
          label="Wind" 
          value={weather.windSpeed !== null ? `${weather.windSpeed} ${labels.speed}` : '—'}
          subValue={weather.windDeg !== null ? formatWindDirection(weather.windDeg) : null}
        />
        
        {weather.windGust !== null && (
          <StatCard 
            icon="🌬️" 
            label="Wind Gust" 
            value={`${weather.windGust} ${labels.speed}`} 
          />
        )}
        
        <StatCard 
          icon="☁️" 
          label="Cloudiness" 
          value={weather.clouds !== null ? `${weather.clouds}%` : '—'} 
        />
        
        <StatCard 
          icon="👁️" 
          label="Visibility" 
          value={formatVisibility(weather.visibility)} 
        />
        
        {/* Rain - only show if present */}
        {(weather.rain1h !== null || weather.rain3h !== null) && (
          <StatCard 
            icon="🌧️" 
            label="Rain" 
            value={weather.rain1h !== null ? `${weather.rain1h} mm/h` : `${weather.rain3h} mm/3h`} 
          />
        )}
        
        {/* Snow - only show if present */}
        {(weather.snow1h !== null || weather.snow3h !== null) && (
          <StatCard 
            icon="❄️" 
            label="Snow" 
            value={weather.snow1h !== null ? `${weather.snow1h} mm/h` : `${weather.snow3h} mm/3h`} 
          />
        )}
        
        <StatCard 
          icon="🌅" 
          label="Sunrise" 
          value={formatCityTime(weather.sunrise, timezoneOffsetSec)} 
        />
        
        <StatCard 
          icon="🌇" 
          label="Sunset" 
          value={formatCityTime(weather.sunset, timezoneOffsetSec)} 
        />
      </div>
    </div>
  );
}
