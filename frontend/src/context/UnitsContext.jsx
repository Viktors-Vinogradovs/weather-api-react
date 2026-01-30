import { createContext, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const UnitsContext = createContext();

const VALID_UNITS = ['metric', 'imperial', 'standard'];
const STORAGE_KEY = 'weather-units';

export function UnitsProvider({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get units from URL, fall back to localStorage, then default to 'metric'
  const getUnits = () => {
    const urlUnits = searchParams.get('units');
    if (urlUnits && VALID_UNITS.includes(urlUnits)) {
      return urlUnits;
    }
    
    const storedUnits = localStorage.getItem(STORAGE_KEY);
    if (storedUnits && VALID_UNITS.includes(storedUnits)) {
      return storedUnits;
    }
    
    return 'metric';
  };

  const units = getUnits();

  // Sync localStorage when units change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, units);
  }, [units]);

  // Set units in URL (source of truth)
  const setUnits = (newUnits) => {
    if (!VALID_UNITS.includes(newUnits)) return;
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set('units', newUnits);
    setSearchParams(newParams, { replace: true });
  };

  // Get unit labels for display
  const getUnitLabels = () => {
    switch (units) {
      case 'imperial':
        return { temp: '°F', speed: 'mph', pressure: 'hPa' };
      case 'standard':
        return { temp: 'K', speed: 'm/s', pressure: 'hPa' };
      case 'metric':
      default:
        return { temp: '°C', speed: 'm/s', pressure: 'hPa' };
    }
  };

  return (
    <UnitsContext.Provider value={{ units, setUnits, getUnitLabels }}>
      {children}
    </UnitsContext.Provider>
  );
}

export function useUnits() {
  const context = useContext(UnitsContext);
  if (!context) {
    throw new Error('useUnits must be used within a UnitsProvider');
  }
  return context;
}
