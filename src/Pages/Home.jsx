import React, { useState } from 'react';
import { verifyApi } from '../services/api';

export default function Home() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('auto');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    setResult(null);
    setError('');
    try {
      const { data } = await verifyApi.search(query.trim(), searchType);
      if (data.found) {
        setResult({
          status: 'pwned',
          title: 'Oh no — Pwned!',
          message: data.remarks || `Record found for "${data.query || query}"`,
          breaches: [
            {
              name: data.idNumber ? `ID: ${data.idNumber}` : 'Record match',
              date: data.verifiedAt || data.createdAt || '',
              count: data.status || '',
              compromised: [
                ...(data.phone ? ['Phone'] : []),
                ...(data.fullName ? ['Full Name'] : []),
                ...(data.email ? ['Email'] : []),
              ],
            },
          ],
        });
      } else {
        setResult({
          status: 'safe',
          title: 'Good news — No pwnage found!',
          message: `No breached data records found for "${query}". Your security posture looks solid.`,
          breaches: [],
        });
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans antialiased">
      <div className="flex flex-col h-2.5 w-full">
        <div className="flex-1 bg-black"></div>
        <div className="flex-1 bg-red-700"></div>
        <div className="flex-1 bg-emerald-700"></div>
      </div>
      <main className="max-w-4xl mx-auto px-5 py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
            Have I Been <span className="text-red-600">Pwned</span>{' '}
            <span className="bg-emerald-700 text-white text-xs uppercase px-2 py-1 rounded align-super">
              KE
            </span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">
            Check if your email, phone number (+254), National ID, or domain has been exposed in a data breach.
          </p>
        </div>
        <form onSubmit={handleSearch} className="mb-10">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {['auto', 'email', 'phone', 'national_id', 'domain'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSearchType(type)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase transition-colors border ${
                  searchType === type
                    ? 'bg-emerald-700 text-white border-emerald-500'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="flex shadow-2xl rounded-lg overflow-hidden border-2 border-neutral-800 focus-within:border-red-700 transition-colors">
            <input
              type="text"
              placeholder={
                searchType === 'phone'
                  ? 'e.g. +254712345678...'
                  : searchType === 'national_id'
                  ? 'e.g. 33445566...'
                  : searchType === 'domain'
                  ? 'e.g. company.co.ke...'
                  : 'Enter Email, Phone (+254...), or ID...'
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-neutral-900 px-5 py-4 text-lg text-white placeholder-neutral-500 outline-none"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="bg-red-700 hover:bg-red-800 text-white font-bold text-lg px-8 py-4 transition-colors disabled:opacity-50"
            >
              {isSearching ? 'Scanning...' : 'pwned?'}
            </button>
          </div>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>
        {result && (
          <div
            className={`border-2 rounded-lg p-6 mb-10 transition-all ${
              result.status === 'pwned'
                ? 'border-red-700 bg-red-950/20'
                : 'border-emerald-700 bg-emerald-950/20'
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-2 ${
                result.status === 'pwned' ? 'text-red-500' : 'text-emerald-400'
              }`}
            >
              {result.title}
            </h2>
            <p className="text-neutral-300 text-base mb-6">{result.message}</p>
            {result.breaches.length > 0 && (
              <div className="border-t border-neutral-800 pt-4">
                <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                  Compromised In:
                </h3>
                <div className="space-y-3">
                  {result.breaches.map((b, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between bg-neutral-900/80 p-3.5 rounded-md border border-neutral-800 gap-2"
                    >
                      <div>
                        <span className="font-bold text-white">{b.name}</span>{' '}
                        <span className="text-xs text-neutral-500">({b.date})</span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {b.compromised.map((item, i) => (
                            <span
                              key={i}
                              className="bg-neutral-800 text-neutral-400 text-[10px] px-2 py-0.5 rounded"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-neutral-400 self-start sm:self-auto">{b.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <h3 className="text-emerald-400 font-bold text-lg mb-2">⚡ Live Threat Level: KE</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Current regional cyber hazard index: <strong className="text-white">MODERATE</strong>. Increased phishing spoofing local bank USSD codes reported.
            </p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <h3 className="text-red-500 font-bold text-lg mb-2">🛡️ Domain Watchdog</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Monitor entire <code className="text-neutral-200 bg-neutral-800 px-1 rounded">.co.ke</code> or <code className="text-neutral-200 bg-neutral-800 px-1 rounded">.or.ke</code> corporate domains to protect employee data exposures.
            </p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <h3 className="text-white font-bold text-lg mb-2">📊 Breach Counter</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              <strong className="text-white">18.4M</strong> total regional records indexed from public dumps and darknet pastebins.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
