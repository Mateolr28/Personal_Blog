import React, { useEffect, useState } from 'react';
import { Search, Plane, Filter, Calendar, MapPin, Building2, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { aviationService } from '../services/aviationService';
import { Aviation } from '../types';
import { AircraftCard } from '../components/AircraftCard';
import { SEO } from '../components/SEO';

export const AviationPage: React.FC = () => {
  const [aviationList, setAviationList] = useState<Aviation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [manufacturerFilter, setManufacturerFilter] = useState('all');
  const [airlineFilter, setAirlineFilter] = useState('all');
  const [airportFilter, setAirportFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await aviationService.getAll(true);
        setAviationList(data);
      } catch (e) {
        console.error('Error loading aviation records:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filter options
  const manufacturers = ['all', ...Array.from(new Set(aviationList.map((a) => a.manufacturer).filter(Boolean)))];
  const airlines = ['all', ...Array.from(new Set(aviationList.map((a) => a.airline).filter(Boolean)))];
  const airports = ['all', ...Array.from(new Set(aviationList.map((a) => a.airport_code).filter(Boolean)))];
  const types = ['all', ...Array.from(new Set(aviationList.map((a) => a.aircraft_type).filter(Boolean)))];

  const filteredAviation = aviationList.filter((a) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      a.registration.toLowerCase().includes(query) ||
      a.model.toLowerCase().includes(query) ||
      a.airline.toLowerCase().includes(query) ||
      a.airport_name.toLowerCase().includes(query) ||
      a.airport_code.toLowerCase().includes(query) ||
      a.city.toLowerCase().includes(query);

    const matchesManufacturer = manufacturerFilter === 'all' || a.manufacturer === manufacturerFilter;
    const matchesAirline = airlineFilter === 'all' || a.airline === airlineFilter;
    const matchesAirport = airportFilter === 'all' || a.airport_code === airportFilter;
    const matchesType = typeFilter === 'all' || a.aircraft_type === typeFilter;

    return matchesSearch && matchesManufacturer && matchesAirline && matchesAirport && matchesType;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setManufacturerFilter('all');
    setAirlineFilter('all');
    setAirportFilter('all');
    setTypeFilter('all');
  };

  const hasActiveFilters =
    searchQuery ||
    manufacturerFilter !== 'all' ||
    airlineFilter !== 'all' ||
    airportFilter !== 'all' ||
    typeFilter !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-24">
      <SEO
        title="Archivo de Aviación & Plane Spotting | Mateo Largo"
        description="Registro fotográfico digital de aeronaves comerciales, matrículas, modelos, aerolíneas y aeropuertos internacionales."
      />

      {/* Header Banner */}
      <div className="p-8 sm:p-12 rounded-2xl bg-white/[0.02] text-white border border-white/10 shadow-2xl relative overflow-hidden archive-card">
        <Plane className="absolute right-[-20px] top-[-20px] w-80 h-80 text-white/[0.03] pointer-events-none -rotate-45" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-950/60 text-blue-400 text-[10px] font-mono uppercase tracking-widest border border-blue-500/30">
            <Plane className="w-3.5 h-3.5 -rotate-45" />
            <span>Digital Aviation Spotting Archive</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl serif font-normal tracking-tight">
            Archivo Fotográfico de Aviación
          </h1>

          <p className="text-sm sm:text-base text-white/50 leading-relaxed max-w-2xl font-sans">
            Catálogo fotográfico personal de aeronaves comerciales fotografiadas en diferentes aeropuertos del mundo, con matrículas, modelos y especificaciones técnicas.
          </p>
        </div>
      </div>

      {/* Search & Multi-Filter Control */}
      <div className="space-y-4">
        <div className="p-4 rounded-xl archive-card shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Quick Search */}
          <div className="relative w-full sm:max-w-lg">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por matrícula (HK-5335), modelo (A320, B787), aerolínea..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-mono bg-white/[0.04] text-white rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none transition-colors placeholder:text-white/30"
            />
          </div>

          {/* Filter Toggle & Clear */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer</span>
              </button>
            )}

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg border transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white/[0.04] text-white/70 border-white/10 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtros avanzados {hasActiveFilters && '(Activos)'}</span>
            </button>
          </div>
        </div>

        {/* Expandable Filter Grid */}
        {showFilters && (
          <div className="p-6 rounded-xl archive-card grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Manufacturer */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-white/50">
                Fabricante
              </label>
              <select
                value={manufacturerFilter}
                onChange={(e) => setManufacturerFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-[#0d0d0d] text-white border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {manufacturers.map((m) => (
                  <option key={m} value={m}>
                    {m === 'all' ? 'Todos los fabricantes' : m}
                  </option>
                ))}
              </select>
            </div>

            {/* Airline */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-white/50">
                Aerolínea
              </label>
              <select
                value={airlineFilter}
                onChange={(e) => setAirlineFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-[#0d0d0d] text-white border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {airlines.map((a) => (
                  <option key={a} value={a}>
                    {a === 'all' ? 'Todas las aerolíneas' : a}
                  </option>
                ))}
              </select>
            </div>

            {/* Airport */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-white/50">
                Aeropuerto
              </label>
              <select
                value={airportFilter}
                onChange={(e) => setAirportFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-[#0d0d0d] text-white border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {airports.map((ap) => (
                  <option key={ap} value={ap}>
                    {ap === 'all' ? 'Todos los aeropuertos' : ap}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-white/50">
                Tipo de Aeronave
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-[#0d0d0d] text-white border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t === 'all' ? 'Todos los tipos' : t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-72 rounded-xl bg-white/[0.03] border border-white/10 animate-pulse" />
          ))}
        </div>
      ) : filteredAviation.length === 0 ? (
        <div className="p-14 text-center archive-card rounded-xl border border-dashed border-white/10 space-y-3">
          <Plane className="w-10 h-10 text-white/30 mx-auto -rotate-45" />
          <h3 className="text-base font-semibold text-white/80 serif">
            {aviationList.length === 0 ? 'No hay aeronaves registradas aún' : 'No se encontraron aeronaves'}
          </h3>
          <p className="text-xs text-white/40 font-mono max-w-md mx-auto">
            {aviationList.length === 0
              ? 'Puedes registrar aeronaves con matrículas, aerolíneas, lugares de avistamiento y especificaciones desde el panel de administración.'
              : 'Prueba ajustando los filtros o buscando otra matrícula/aerolínea.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAviation.map((aircraft) => (
            <AircraftCard key={aircraft.id} aircraft={aircraft} />
          ))}
        </div>
      )}
    </div>
  );
};
