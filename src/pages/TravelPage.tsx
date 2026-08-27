import React, { useEffect, useState } from 'react';
import { Search, Compass, MapPin, Calendar, Camera } from 'lucide-react';
import { travelService } from '../services/travelService';
import { Travel } from '../types';
import { TravelCard } from '../components/TravelCard';
import { SEO } from '../components/SEO';

export const TravelPage: React.FC = () => {
  const [travels, setTravels] = useState<Travel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await travelService.getAll(true);
        setTravels(data);
      } catch (e) {
        console.error('Error loading travels:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const countries = ['all', ...Array.from(new Set(travels.map((t) => t.country).filter(Boolean)))];

  const filteredTravels = travels.filter((travel) => {
    const matchesSearch =
      travel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      travel.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      travel.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      travel.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      travel.places_visited?.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCountry = countryFilter === 'all' || travel.country === countryFilter;

    return matchesSearch && matchesCountry;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-24">
      <SEO
        title="Bitácora de Viajes & Fotografía de Expedición | Mateo Largo"
        description="Archivo fotográfico y bitácoras de mis viajes por el mundo, lugares visitados y relatos de expedición."
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400">
          Bitácora Visual
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl serif font-normal text-white">
          Viajes & Experiencias
        </h1>
        <p className="text-sm sm:text-base text-white/50 leading-relaxed font-sans">
          Un archivo personal de viajes, lugares, salidas y experiencias que vale la pena recordar.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl archive-card shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por país, ciudad o lugar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-mono bg-white/[0.04] text-white rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none transition-colors placeholder:text-white/30"
          />
        </div>

        {countries.length > 2 && (
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {countries.map((country) => (
              <button
                key={country}
                onClick={() => setCountryFilter(country)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg whitespace-nowrap transition-colors ${
                  countryFilter === country
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                {country === 'all' ? 'Todos los países' : country}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-xl bg-white/[0.03] border border-white/10 animate-pulse" />
          ))}
        </div>
      ) : filteredTravels.length === 0 ? (
        <div className="p-14 text-center archive-card rounded-xl border border-dashed border-white/10 space-y-3">
          <Compass className="w-10 h-10 text-white/30 mx-auto" />
          <h3 className="text-base font-semibold text-white/80 serif">
            {travels.length === 0 ? 'No hay bitácoras de viaje registradas aún' : 'No se encontraron viajes'}
          </h3>
          <p className="text-xs text-white/40 font-mono max-w-md mx-auto">
            {travels.length === 0
              ? 'Puedes registrar tus viajes, destinos, ciudades y galerías de fotos desde el panel de administración.'
              : 'Intenta con otro destino o término de búsqueda.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTravels.map((travel) => (
            <TravelCard key={travel.id} travel={travel} />
          ))}
        </div>
      )}
    </div>
  );
};
