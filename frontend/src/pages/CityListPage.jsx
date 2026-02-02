import { useState, useEffect } from 'react';
import { useUnits } from '../context/UnitsContext';
import CityCard from '../components/CityCard';
import CityCardSkeleton from '../components/CityCardSkeleton';
import ErrorState from '../components/ErrorState';
import RefreshButton from '../components/RefreshButton';
import AddCityModal from '../components/AddCityModal';
import { formatRelativeTime } from '../utils/formatTime';

const SKELETON_COUNT = 10;

export default function CityListPage() {
  const { units } = useUnits();
  const [cities, setCities] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleRemoveCity = async (cityId) => {
    if (!confirm('Remove this city from your list?')) return;
    try {
      const res = await fetch(`/api/cities/${cityId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Failed to remove city');
      }
      fetchWeather(true);
    } catch (err) {
      setError(err.message);
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
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add City
          </button>
          <RefreshButton
            onClick={() => fetchWeather(true)}
            loading={refreshing}
            title="Refresh"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cities.map((city) => (
          <CityCard key={city.id} city={city} onRemove={handleRemoveCity} />
        ))}
      </div>
      {cities.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No cities yet. Add your first city to get started.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Add City
          </button>
        </div>
      )}
      <AddCityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdded={() => fetchWeather(true)}
      />
    </div>
  );
}
