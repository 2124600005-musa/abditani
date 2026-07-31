'use client';
import { useState, useEffect } from 'react';

export default function Teknologi() {
  const [techs, setTechs] = useState<Array<{id:number;title:string;description:string;details:string|null;icon:string;image:string|null}>>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch('/api/technologies').then(r => r.json()).then(d => setTechs(Array.isArray(d) ? d : [])).catch(() => setTechs([])).finally(() => setLoading(false)); }, []);

  return (
    <div className="pt-24 pb-16">
      <section className="py-16 bg-gradient-to-br from-primary-800 to-primary-950 text-white">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Teknologi Pertanian</h1>
          <p className="text-lg text-primary-100/80 max-w-2xl mx-auto">Pertanian Lebih Cerdas dengan Teknologi</p>
        </div>
      </section>
      <section className="py-20">
        <div className="container-custom">
          {loading ? <div className="text-center py-20 text-gray-500">Memuat...</div> : techs.length === 0 ? <div className="text-center py-20"><p className="text-gray-500">Belum ada data teknologi</p></div> : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">{techs.map(t => (
              <div key={t.id} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
                <span className="text-4xl mb-4 block">{t.icon}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{t.description}</p>
                {t.details && <div className="text-sm text-gray-500 whitespace-pre-line">{t.details}</div>}
              </div>
            ))}</div>
          )}
        </div>
      </section>
    </div>
  );
}
