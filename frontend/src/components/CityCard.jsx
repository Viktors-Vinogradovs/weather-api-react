import { Link, useSearchParams } from 'react-router-dom';
import { useUnits } from '../context/UnitsContext';

export default function CityCard({ city }) {
  const { getUnitLabels } = useUnits();
  const [searchParams] = useSearchParams();
  const labels = getUnitLabels();
  const unavailable = city.unavailable === true;

  const { id, name, country, weather = {} } = city;
  const iconUrl = weather.icon
    ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
    : null;

  // Preserve units in detail link
  const detailLink = searchParams.get('units')
    ? `/city/${id}?units=${searchParams.get('units')}`
    : `/city/${id}`;

  if (unavailable) {
    return (
      <div className="block bg-white rounded-xl shadow-md p-5 border-2 border-dashed border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-600">{name}</h2>
            <p className="text-sm text-gray-400">{country}</p>
          </div>
        </div>
        <div className="mt-6 py-4 text-center">
          <p className="text-gray-500 text-sm font-medium">Data unavailable</p>
          <p className="text-gray-400 text-xs mt-1">Could not load weather</p>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={detailLink}
      className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 group"
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
            {name}
          </h2>
          <p className="text-sm text-gray-500">{country}</p>
        </div>
        {iconUrl && (
          <img
            src={iconUrl}
            alt={weather.description || 'Weather'}
            className="w-14 h-14 -mt-2 -mr-2"
          />
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900">
            {weather.temp !== null ? Math.round(weather.temp) : '—'}
          </span>
          <span className="text-lg text-gray-500">{labels.temp}</span>
        </div>
        <p className="text-sm text-gray-600 capitalize mt-1">
          {weather.description || 'No data'}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-sm text-gray-500">
        <span>💧 {weather.humidity !== null ? `${weather.humidity}%` : '—'}</span>
        <span>💨 {weather.windSpeed !== null ? `${weather.windSpeed} ${labels.speed}` : '—'}</span>
      </div>
    </Link>
  );
}
