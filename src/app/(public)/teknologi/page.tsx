'use client';

import { useState, useEffect } from 'react';

interface Technology {
  id: number;
  title: string;
  slug: string;
  description: string;
  details: string;
  icon: string | null;
  image: string | null;
}

export default function TeknologiPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/technologies').then(r => r.json()).then(d => {
      setTechnologies(Array.isArray(d) ? d : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Teknologi Pertanian</h1>
          <p className="text-primary-100 text-lg">Solusi modern untuk pertanian masa depan Indonesia.</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-20 text-gray-500">Memuat data teknologi...</div>
          ) : technologies.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔬</div>
              <p className="text-gray-600">Belum ada teknologi tersedia.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {technologies.map(t => (
                <div key={t.id} className="card hover:shadow-lg transition-all duration-300">
                  <div className="aspect-video bg-primary-50 flex items-center justify-center overflow-hidden">
                    {t.image ? (
                      <img src={t.image} alt={t.title} className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.svg'; }} />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-primary-600">
                        <span className="text-5xl">{t.icon || '🔬'}</span>
                        <span className="text-sm font-bold mt-2">AbdiTani</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {t.icon && <span className="text-xl">{t.icon}</span>}
                      <h3 className="font-bold text-gray-900">{t.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{t.description}</p>
                    {t.details && expanded === t.id && (
                      <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {t.details}
                      </div>
                    )}
                    {t.details && (
                      <button
                        onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                        className="mt-3 text-sm text-primary-600 font-semibold hover:text-primary-700"
                      >
                        {expanded === t.id ? 'Tutup ▲' : 'Selengkapnya ▼'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
