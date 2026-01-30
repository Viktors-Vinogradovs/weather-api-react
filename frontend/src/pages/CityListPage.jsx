import { useState, useEffect } from 'react';
import { useUnits } from '../context/UnitsContext';
import CityCard from '../components/CityCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function CityListPage() {
  const { units } = useUnits();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/weather?units=${units}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch weather data');
      }
      
      setCities(data.cities || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [units]);

  if (loading) {
    return <LoadingState message="Loading weather for all cities..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchWeather} />;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Weather Around the World
      </h2>
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
