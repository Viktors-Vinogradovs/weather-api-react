import { Link, useSearchParams } from 'react-router-dom';
import UnitSwitcher from './UnitSwitcher';

export default function Header() {
  const [searchParams] = useSearchParams();
  
  // Preserve units in home link
  const homeLink = searchParams.get('units') 
    ? `/?units=${searchParams.get('units')}` 
    : '/';

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to={homeLink} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <svg 
              className="w-8 h-8" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" 
              />
            </svg>
            <h1 className="text-xl font-bold">Weather Dashboard</h1>
          </Link>
          <UnitSwitcher />
        </div>
      </div>
    </header>
  );
}
