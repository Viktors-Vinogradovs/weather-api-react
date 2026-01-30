import { Routes, Route } from 'react-router-dom';
import { UnitsProvider } from './context/UnitsContext';
import Header from './components/Header';
import CityListPage from './pages/CityListPage';
import CityDetailPage from './pages/CityDetailPage';

function App() {
  return (
    <UnitsProvider>
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<CityListPage />} />
            <Route path="/city/:id" element={<CityDetailPage />} />
          </Routes>
        </main>
      </div>
    </UnitsProvider>
  );
}

export default App;
