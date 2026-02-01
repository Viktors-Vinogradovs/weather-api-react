import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useUnits } from '../context/UnitsContext';
import WeatherDetail from '../components/WeatherDetail';
import CityDetailSkeleton from '../components/CityDetailSkeleton';
import ErrorState from '../components/ErrorState';
import RefreshButton from '../components/RefreshButton';
import { formatRelativeTime } from '../utils/formatTime';

export default function CityDetailPage() {
  const { id } = useParams();
  const { units } = useUnits();
  const [searchParams] = useSearchParams();
  const [city, setCity] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const backLink = searchParams.get('units')
    ? `/?units=${searchParams.get('units')}`
    : '/';

  const fetchCityWeather = async (force = false) => {
    const isRefresh = !loading && force;
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const url = `/api/weather/${id}?units=${units}${force ? '&force=true' : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch city weather');
      }

      setCity(data.city);
      setLastUpdated(data.lastUpdated || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCityWeather(false);
  }, [id, units]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Link
          to={backLink}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all cities
        </Link>
        <div className="flex items-center gap-4">
          {lastUpdated && !loading && (
            <span className="text-sm text-gray-500">
              {formatRelativeTime(lastUpdated)}
            </span>
          )}
          {!loading && !error && (
            <RefreshButton
              onClick={() => fetchCityWeather(true)}
              loading={refreshing}
              title="Refresh"
            />
          )}
        </div>
      </div>

      {loading && <CityDetailSkeleton />}

      {error && <ErrorState message={error} onRetry={() => fetchCityWeather(true)} />}

      {!loading && !error && city && <WeatherDetail city={city} />}
    </div>
  );
}
