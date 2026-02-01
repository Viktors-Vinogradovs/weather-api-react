import { useState, useEffect } from 'react';
import { useUnits } from '../context/UnitsContext';
import CityCard from '../components/CityCard';
import CityCardSkeleton from '../components/CityCardSkeleton';
import ErrorState from '../components/ErrorState';
import RefreshButton from '../components/RefreshButton';
import { formatRelativeTime } from '../utils/formatTime';

const SKELETON_COUNT = 10;

export default function CityListPage() {
  const { units } = useUnits();
  const [cities, setCities] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (force = false) => {
    const isRefresh = !loading && force;
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const url = `/api/weather?units=${units}${force ? '&force=true' : ''}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch weather data');
      }

      setCities(data.cities || []);
      setLastUpdated(data.lastUpdated || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather(false);
  }, [units]);

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Weather Around the World
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(SKELETON_COUNT)].map((_, i) => (
            <CityCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => fetchWeather(true)} />;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Weather Around the World
        </h2>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              {formatRelativeTime(lastUpdated)}
            </span>
          )}
          <RefreshButton
            onClick={() => fetchWeather(true)}
            loading={refreshing}
            title="Refresh"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cities.map((city) => (
          <CityCard key={city.id} city={city} />
        ))}
      </div>
      {cities.length === 0 && !loading && (
        <p className="text-center text-gray-500 py-8">No cities to display</p>
      )}
    </div>
  );
}
