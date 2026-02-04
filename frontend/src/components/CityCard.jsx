import { Link, useSearchParams } from 'react-router-dom';
import { useUnits } from '../context/UnitsContext';

export default function CityCard({ city, onRemove }) {
  const { getUnitLabels } = useUnits();
  const [searchParams] = useSearchParams();
  const labels = getUnitLabels();
  const unavailable = city.unavailable === true;

  const { id, name, country, weather = {} } = city;
  const iconUrl = weather.icon
    ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
    : null;

  const detailLink = searchParams.get('units')
    ? `/city/${id}?units=${searchParams.get('units')}`
    : `/city/${id}`;

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove?.(id);
  };

  if (unavailable) {
    return (
      <div className="relative block bg-gray-50 rounded-xl shadow-sm p-5 border-2 border-dashed border-gray-300 cursor-not-allowed">
        {onRemove && (
          <button
            onClick={handleRemove}
            className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500"
            aria-label="Remove city"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
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
    <div className="relative group">
      <Link
        to={detailLink}
        className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5"
      >
        {onRemove && (
          <button
            onClick={handleRemove}
            className="absolute top-3 right-3 p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove city"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
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
    </div>
  );
}
