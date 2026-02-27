import React, { useState, useEffect, useMemo } from 'react';
import {
    Plus,
    X,
    Search,
    Globe,
    Sun,
    Moon,
    Clock,
    Trash2,
    MapPin
} from 'lucide-react';

// --- Data: Major Cities & Timezones ---
const PRESET_CITIES = [
    { city: 'New York', zone: 'America/New_York', country: 'USA' },
    { city: 'London', zone: 'Europe/London', country: 'UK' },
    { city: 'Tokyo', zone: 'Asia/Tokyo', country: 'Japan' },
    { city: 'Sydney', zone: 'Australia/Sydney', country: 'Australia' },
    { city: 'Paris', zone: 'Europe/Paris', country: 'France' },
    { city: 'Dubai', zone: 'Asia/Dubai', country: 'UAE' },
    { city: 'Singapore', zone: 'Asia/Singapore', country: 'Singapore' },
    { city: 'Los Angeles', zone: 'America/Los_Angeles', country: 'USA' },
    { city: 'Hong Kong', zone: 'Asia/Hong_Kong', country: 'China' },
    { city: 'Berlin', zone: 'Europe/Berlin', country: 'Germany' },
    { city: 'Mumbai', zone: 'Asia/Kolkata', country: 'India' },
    { city: 'Shanghai', zone: 'Asia/Shanghai', country: 'China' },
    { city: 'Toronto', zone: 'America/Toronto', country: 'Canada' },
    { city: 'Moscow', zone: 'Europe/Moscow', country: 'Russia' },
    { city: 'São Paulo', zone: 'America/Sao_Paulo', country: 'Brazil' },
    { city: 'Seoul', zone: 'Asia/Seoul', country: 'South Korea' },
    { city: 'Istanbul', zone: 'Europe/Istanbul', country: 'Turkey' },
    { city: 'Mexico City', zone: 'America/Mexico_City', country: 'Mexico' },
    { city: 'Bangkok', zone: 'Asia/Bangkok', country: 'Thailand' },
    { city: 'Cairo', zone: 'Africa/Cairo', country: 'Egypt' },
    { city: 'Johannesburg', zone: 'Africa/Johannesburg', country: 'South Africa' },
    { city: 'Zurich', zone: 'Europe/Zurich', country: 'Switzerland' },
    { city: 'Auckland', zone: 'Pacific/Auckland', country: 'New Zealand' },
    { city: 'Hawaii', zone: 'Pacific/Honolulu', country: 'USA' },
    { city: 'Chicago', zone: 'America/Chicago', country: 'USA' },
    { city: 'Rome', zone: 'Europe/Rome', country: 'Italy' },
    { city: 'Madrid', zone: 'Europe/Madrid', country: 'Spain' },
    { city: 'Vancouver', zone: 'America/Vancouver', country: 'Canada' },
    { city: 'Denver', zone: 'America/Denver', country: 'USA' },
    { city: 'Buenos Aires', zone: 'America/Argentina/Buenos_Aires', country: 'Argentina' },
];

// --- Analog Clock Component ---
const AnalogClock = ({ date, size = 200, className = "" }) => {
    const seconds = date.getSeconds();
    const minutes = date.getMinutes();
    const hours = date.getHours();

    const secDeg = (seconds / 60) * 360;
    const minDeg = ((minutes + seconds / 60) / 60) * 360;
    const hourDeg = ((hours % 12 + minutes / 60) / 12) * 360;

    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            {/* Clock Face */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-200 bg-white shadow-inner">
                {/* Hour Markers */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-3 bg-slate-300 left-1/2 top-0 origin-bottom"
                        style={{
                            transform: `translateX(-50%) rotate(${i * 30}deg) translateY(6px)`,
                            transformOrigin: '50% 100px' // Half of size roughly
                        }}
                    />
                ))}
            </div>

            {/* Hands */}
            {/* Hour */}
            <div
                className="absolute w-1.5 bg-slate-800 rounded-full origin-bottom"
                style={{
                    height: '25%',
                    bottom: '50%',
                    left: 'calc(50% - 3px)',
                    transform: `rotate(${hourDeg}deg)`
                }}
            />
            {/* Minute */}
            <div
                className="absolute w-1 bg-slate-600 rounded-full origin-bottom"
                style={{
                    height: '35%',
                    bottom: '50%',
                    left: 'calc(50% - 2px)',
                    transform: `rotate(${minDeg}deg)`
                }}
            />
            {/* Second */}
            <div
                className="absolute w-0.5 bg-rose-500 rounded-full origin-bottom shadow-sm"
                style={{
                    height: '40%',
                    bottom: '50%',
                    left: 'calc(50% - 1px)',
                    transform: `rotate(${secDeg}deg)`
                }}
            />
            {/* Center Dot */}
            <div className="absolute w-3 h-3 bg-white border-2 border-rose-500 rounded-full z-10" />
        </div>
    );
};

// --- Main App Component ---
export default function WorldClock() {
    const [now, setNow] = useState(new Date());
    const [myCities, setMyCities] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Initial Load (simulate localStorage)
    useEffect(() => {
        const saved = localStorage.getItem('world_clock_cities');
        if (saved) {
            setMyCities(JSON.parse(saved));
        } else {
            // Default cities if none saved
            setMyCities([
                { city: 'London', zone: 'Europe/London', country: 'UK' },
                { city: 'New York', zone: 'America/New_York', country: 'USA' },
                { city: 'Tokyo', zone: 'Asia/Tokyo', country: 'Japan' },
            ]);
        }
    }, []);

    // Save on change
    useEffect(() => {
        localStorage.setItem('world_clock_cities', JSON.stringify(myCities));
    }, [myCities]);

    // Timer Tick
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Helper: Format Time for a Zone
    const formatTime = (date, zone) => {
        try {
            return new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                // second: 'numeric', // Keep it clean without seconds for cards
                hour12: true,
                timeZone: zone
            }).format(date);
        } catch (e) {
            return '--:--';
        }
    };

    // Helper: Get Day/Date info
    const getDateInfo = (date, zone) => {
        try {
            const parts = new Intl.DateTimeFormat('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                hour12: false,
                timeZone: zone
            }).formatToParts(date);

            const hour = parseInt(parts.find(p => p.type === 'hour').value, 10);
            const isNight = hour < 6 || hour >= 18;

            return {
                text: parts.map(p => {
                    if (p.type === 'literal') return p.value.trim() === ',' ? ', ' : ' ';
                    if (p.type === 'hour') return ''; // exclude hour from date string
                    return p.value;
                }).join('').trim(),
                isNight
            };
        } catch (e) {
            return { text: '---', isNight: false };
        }
    };

    // Helper: Calculate Time Difference
    const getTimeDifference = (zone) => {
        try {
            const localOffset = now.getTimezoneOffset() * -1; // in minutes
            const targetDateStr = now.toLocaleString('en-US', { timeZone: zone });
            const targetDate = new Date(targetDateStr);

            // Accurate method:
            const format = (z) => new Intl.DateTimeFormat('en-US', {
                timeZone: z, hour: 'numeric', hour12: false, day: 'numeric'
            });

            const localParts = format(Intl.DateTimeFormat().resolvedOptions().timeZone).formatToParts(now);
            const targetParts = format(zone).formatToParts(now);

            let localH = parseInt(localParts.find(p => p.type === 'hour').value);
            let targetH = parseInt(targetParts.find(p => p.type === 'hour').value);
            let localD = parseInt(localParts.find(p => p.type === 'day').value);
            let targetD = parseInt(targetParts.find(p => p.type === 'day').value);

            let diff = targetH - localH;
            if (targetD > localD) diff += 24;
            if (targetD < localD) diff -= 24;
            // Handle month boundaries roughly (rare edge case for simple diffs, usually handled by date obj)

            if (diff === 0) return 'Same time';
            const sign = diff > 0 ? '+' : '';
            return `${sign}${diff} hrs`;
        } catch (e) {
            return '';
        }
    };

    const addCity = (cityObj) => {
        if (!myCities.find(c => c.zone === cityObj.zone)) {
            setMyCities([...myCities, cityObj]);
        }
        setIsModalOpen(false);
        setSearchTerm('');
    };

    const removeCity = (zone) => {
        setMyCities(myCities.filter(c => c.zone !== zone));
    };

    const filteredCities = PRESET_CITIES.filter(c =>
        c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-100 selection:text-rose-900 pb-20">
            {/* Header / Hero */}
            <div className="bg-white pb-12 pt-8 px-6 shadow-sm border-b border-slate-100">
                <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-2 justify-center md:justify-start text-rose-500 font-bold tracking-wider uppercase text-sm mb-2">
                            <Globe size={16} />
                            <span>Local Time</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
                            {formatTime(now, Intl.DateTimeFormat().resolvedOptions().timeZone)}
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">
                            {new Intl.DateTimeFormat('en-US', {
                                weekday: 'long', month: 'long', day: 'numeric'
                            }).format(now)}
                        </p>
                    </div>

                    {/* Analog Clock for Local Time */}
                    <div className="scale-75 md:scale-100 transform transition-transform">
                        <AnalogClock date={now} />
                    </div>

                </div>
            </div>

            {/* World List */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6">
                <div className="flex justify-between items-end mb-4 px-2">
                    <h2 className="text-xl font-bold text-slate-800">World Clock</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 text-sm font-semibold text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-full transition-all"
                    >
                        <Plus size={18} />
                        Add City
                    </button>
                </div>

                <div className="grid gap-3">
                    {myCities.length === 0 && (
                        <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                            <Clock size={48} className="mx-auto mb-3 opacity-20" />
                            <p>No cities added yet.</p>
                        </div>
                    )}

                    {myCities.map((city) => {
                        const dateInfo = getDateInfo(now, city.zone);
                        const timeDiff = getTimeDifference(city.zone);

                        return (
                            <div
                                key={city.zone}
                                className="group relative bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all duration-300 overflow-hidden"
                            >
                                {/* Night/Day Gradient Indicator on Left */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${dateInfo.isNight ? 'bg-indigo-900' : 'bg-amber-400'}`} />

                                <div className="flex items-center gap-4 pl-3">
                                    <div className={`p-2 rounded-full ${dateInfo.isNight ? 'bg-indigo-50 text-indigo-900' : 'bg-amber-50 text-amber-500'}`}>
                                        {dateInfo.isNight ? <Moon size={20} /> : <Sun size={20} />}
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="text-lg font-bold text-slate-900">{city.city}</h3>
                                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{timeDiff}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <span>{city.country}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                            <span>{dateInfo.text}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <span className="text-3xl font-mono font-bold text-slate-800 tracking-tighter">
                                            {formatTime(now, city.zone)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => removeCity(city.zone)}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all"
                                        title="Remove city"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Add City Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                            <Search size={20} className="text-slate-400" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search city or country..."
                                className="flex-1 text-lg outline-none placeholder:text-slate-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-2">
                            {filteredCities.length > 0 ? (
                                filteredCities.map((city) => (
                                    <button
                                        key={city.zone}
                                        onClick={() => addCity(city)}
                                        className="w-full text-left p-3 hover:bg-slate-50 rounded-xl flex items-center justify-between group transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-100 text-slate-500 rounded-full group-hover:bg-white group-hover:shadow-sm transition-all">
                                                <MapPin size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{city.city}</p>
                                                <p className="text-sm text-slate-500">{city.country}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono text-slate-300 group-hover:text-rose-500">
                                            {city.zone.split('/')[1].replace('_', ' ')}
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-400">
                                    <Globe size={32} className="mx-auto mb-2 opacity-50" />
                                    <p>No cities found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
