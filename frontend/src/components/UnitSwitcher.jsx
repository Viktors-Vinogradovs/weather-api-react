import { useUnits } from '../context/UnitsContext';

const UNIT_OPTIONS = [
  { value: 'metric', label: '°C', fullLabel: 'Metric (°C)' },
  { value: 'imperial', label: '°F', fullLabel: 'Imperial (°F)' },
  { value: 'standard', label: 'K', fullLabel: 'Standard (K)' },
];

export default function UnitSwitcher() {
  const { units, setUnits } = useUnits();

  return (
    <div className="flex items-center gap-1 bg-white/50 rounded-lg p-1">
      {UNIT_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => setUnits(option.value)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            units === option.value
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-white/70'
          }`}
          title={option.fullLabel}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
