import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useUnits } from '../context/UnitsContext';
import WeatherDetail from '../components/WeatherDetail';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function CityDetailPage() {
  const { id } = useParams();
  const { units } = useUnits();
  const [searchParams] = useSearchParams();
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Preserve units in back link
  const backLink = searchParams.get('units')
    ? `/?units=${searchParams.get('units')}`
    : '/';

  const fetchCityWeather = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/weather/${id}?units=${units}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch city weather');
      }
      
      setCity(data.city);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCityWeather();
  }, [id, units]);

  return (
    <div>
      <Link 
        to={backLink}
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to all cities
      </Link>

      {loading && <LoadingState message="Loading city weather..." />}
      
      {error && <ErrorState message={error} onRetry={fetchCityWeather} />}
      
      {!loading && !error && city && <WeatherDetail city={city} />}
    </div>
  );
}
