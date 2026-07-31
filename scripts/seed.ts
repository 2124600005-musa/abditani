import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Admin
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    const email = process.env.ADMIN_EMAIL || 'admin@abditani.local';
    const existing = await client.query('SELECT id FROM admins WHERE email = $1', [email]);
    if (existing.rows.length === 0) {
      await client.query('INSERT INTO admins (name, email, password, role) VALUES ($1, $2, $3, $4)', ['Super Admin', email, hash, 'admin']);
      console.log('✅ Admin seeded');
    }

    // Categories
    const catCount = await client.query('SELECT COUNT(*) FROM categories');
    if (parseInt(catCount.rows[0].count) === 0) {
      const cats = [
        ['Benih', 'benih', 'Benih tanaman unggul', '🌱', 1],
        ['Pupuk', 'pupuk', 'Pupuk organik dan anorganik', '🧪', 2],
        ['Pestisida', 'pestisida', 'Obat pengendali hama', '🛡️', 3],
        ['Alat Pertanian', 'alat-pertanian', 'Peralatan pertanian', '🔧', 4],
        ['Hidroponik', 'hidroponik', 'Peralatan hidroponik', '💧', 5],
        ['Produk Organik', 'produk-organik', 'Produk organik', '🌿', 6],
        ['Hasil Pertanian', 'hasil-pertanian', 'Hasil panen', '🌾', 7],
        ['Teknologi Pertanian', 'teknologi-pertanian', 'Teknologi modern', '🤖', 8],
      ];
      for (const c of cats) {
        await client.query('INSERT INTO categories (name, slug, description, icon, sort_order) VALUES ($1,$2,$3,$4,$5)', c);
      }
      console.log('✅ Categories seeded');
    }

    // Products
    const prodCount = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(prodCount.rows[0].count) === 0) {
      const prods = [
        ['Benih Padi Unggul IR-64', 'benih-padi-unggul-ir-64', 1, 'Benih padi IR-64 hasil panen tinggi', 85000, 'kg', 500, 'tersedia', null, 'Subang, Jabar', 'PT Benih Nusantara', '081234567890'],
        ['Benih Cabai Merah Keriting', 'benih-cabai-merah-keriting', 1, 'Benih cabai keriting hibrida', 45000, 'pack', 300, 'tersedia', null, 'Malang, Jatim', 'Seed Corp', '081298765432'],
        ['Benih Tomat Hibrida F1', 'benih-tomat-hibrida-f1', 1, 'Benih tomat F1 unggul', 35000, 'pack', 250, 'tersedia', null, 'Lembang, Jabar', 'Agri Seed', '081345678901'],
        ['Pupuk Organik Cair AbdiGrow', 'pupuk-organik-cair-abdigrow', 2, 'Pupuk organik cair ekstrak limbah', 75000, 'liter', 200, 'tersedia', null, 'Gresik, Jatim', 'AbdiTani Farm', '081567890123'],
        ['Pupuk NPK 16-16-16', 'pupuk-npk-16-16-16', 2, 'Pupuk NPK mutu tinggi', 125000, 'kg', 1000, 'tersedia', null, 'Karawang, Jabar', 'Pupuk Indonesia', '081678901234'],
        ['Pupuk Kompos Premium', 'pupuk-kompos-premium', 2, 'Kompos olahan bahan organik', 45000, 'kg', 800, 'tersedia', null, 'Bantul, DIY', 'Kompos Jaya', '081789012345'],
        ['Nutrisi Hidroponik AB Mix', 'nutrisi-hidroponik-ab-mix', 5, 'Nutrisi lengkap hidroponik', 55000, 'set', 150, 'tersedia', null, 'Bandung, Jabar', 'Hydro Fresh', '081890123456'],
        ['Alat Semprot Elektrik 16L', 'alat-semprot-elektrik-16l', 4, 'Alat semprot baterai 16 liter', 450000, 'pcs', 50, 'tersedia', null, 'Surabaya, Jatim', 'Teknik Tani', '081901234567'],
        ['Sensor Kelembapan IoT', 'sensor-kelembapan-tanah-iot', 8, 'Sensor kelembapan tanah IoT', 275000, 'pcs', 100, 'tersedia', null, 'Jaksel', 'Smart Farm Tech', '081012345678'],
        ['Alat Pertanian Multifungsi', 'peralatan-pertanian-multifungsi', 4, 'Set alat 5in1 stainless steel', 185000, 'set', 75, 'tersedia', null, 'Semarang, Jateng', 'Tool Master', '081123456789'],
      ];
      for (const p of prods) {
        await client.query('INSERT INTO products (name,slug,category_id,description,price,unit,stock,status,image,location,supplier,supplier_contact) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)', p);
      }
      console.log('✅ Products seeded');
    }

    // Commodities
    const commCount = await client.query('SELECT COUNT(*) FROM commodities');
    if (parseInt(commCount.rows[0].count) === 0) {
      const comms = [
        ['Padi', 'padi', '🌾', 4800, 4750, 'kg', 'Nasional', 1.05],
        ['Beras', 'beras', '🍚', 12500, 12800, 'kg', 'Nasional', -2.34],
        ['Jagung', 'jagung', '🌽', 5200, 5100, 'kg', 'Nasional', 1.96],
        ['Cabai', 'cabai', '🌶️', 35000, 38000, 'kg', 'Nasional', -7.89],
        ['Bawang Merah', 'bawang-merah', '🧅', 28000, 27000, 'kg', 'Nasional', 3.70],
        ['Bawang Putih', 'bawang-putih', '🧄', 32000, 33500, 'kg', 'Nasional', -4.48],
        ['Tomat', 'tomat', '🍅', 8500, 8000, 'kg', 'Nasional', 6.25],
        ['Kentang', 'kentang', '🥔', 15000, 15200, 'kg', 'Nasional', -1.32],
      ];
      for (const c of comms) {
        await client.query('INSERT INTO commodities (name,slug,icon,price,previous_price,unit,region,change_pct) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', c);
      }
      console.log('✅ Commodities seeded');
    }

    // Articles
    const artCount = await client.query('SELECT COUNT(*) FROM articles');
    if (parseInt(artCount.rows[0].count) === 0) {
      const arts = [
        ['Panduan Budidaya Cabai', 'panduan-budidaya-cabai', 'Budidaya', 'Pelajari budidaya cabai lengkap', '<h2>Persiapan Lahan</h2><p>Gemburkan tanah dan campur pupuk kandang.</p><h2>Penanaman</h2><p>Jarak tanam 60x50cm.</p>', 'Dr. Suharto, M.P.', null, 'published', 1, '10 menit'],
        ['Meningkatkan Produktivitas Padi', 'meningkatkan-produktivitas-padi', 'Budidaya', 'Tips hasil panen padi +30%', '<h2>Varietas</h2><p>Gunakan IR-64 atau Inpari 32.</p><h2>Pemupukan</h2><p>NPK berimbang sesuai fase.</p>', 'Ir. Bambang Sudibyo', null, 'published', 1, '8 menit'],
        ['Hidroponik untuk Pemula', 'panduan-hidroponik-pemula', 'Hidroponik', 'Mulai hidroponik dari nol', '<h2>Sistem Wick</h2><p>Paling sederhana untuk pemula.</p><h2>Nutrisi</h2><p>Gunakan AB Mix.</p>', 'Mira Anggraeni, S.P.', null, 'published', 1, '12 menit'],
        ['Mengenal Smart Farming', 'mengenal-smart-farming', 'Teknologi', 'IoT dan AI untuk pertanian', '<h2>Smart Farming</h2><p>Teknologi IoT, AI, dan drone untuk optimasi pertanian.</p>', 'Prof. Haryanto', null, 'published', 0, '15 menit'],
        ['Mengatasi Hama Ulat', 'mengatasi-hama-ulat-sayur', 'Hama & Penyakit', 'Pengendalian hama ulat organik', '<h2>Pengendalian Hayati</h2><p>Gunakan Bacillus thuringiensis (Bt).</p>', 'Dra. Ratna Dewi', null, 'published', 0, '8 menit'],
      ];
      for (const a of arts) {
        await client.query('INSERT INTO articles (title,slug,category,excerpt,content,author,thumbnail,status,featured,read_time) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', a);
      }
      console.log('✅ Articles seeded');
    }

    // News
    const newsCount = await client.query('SELECT COUNT(*) FROM news');
    if (parseInt(newsCount.rows[0].count) === 0) {
      const news = [
        ['Kementan Luncurkan Digitalisasi 2026', 'kementan-digitalisasi-2026', 'Program digitalisasi 10 juta petani', '<p>Kementerian Pertanian resmi meluncurkan program digitalisasi.</p>', 'Kementan', null, 'published', '2026-07-28'],
        ['Harga Cabai Melonjak 30%', 'harga-cabai-melonjak', 'Kenaikan harga cabai pasar tradisional', '<p>Harga cabai mengalami kenaikan signifikan.</p>', 'Media Pertanian', null, 'published', '2026-07-30'],
        ['Drone Digunakan Petani Milenial', 'drone-petani-milenial', 'Penggunaan drone +150%', '<p>Teknologi drone semakin populer.</p>', 'Tech Agri', null, 'published', '2026-07-29'],
        ['AbdiTani Kerjasama 50 Kelompok Tani', 'abditani-kerjasama', 'MoU 50 kelompok tani Jabar', '<p>Kerjasama strategis AbdiTani.</p>', 'AbdiTani Press', null, 'published', '2026-07-27'],
        ['Pameran Pertanian Internasional 2026', 'pameran-pertanian-2026', 'Jakarta tuan rumah Agri Expo', '<p>Indonesia Agri Expo 2026.</p>', 'Agri Expo', null, 'published', '2026-07-25'],
      ];
      for (const n of news) {
        await client.query('INSERT INTO news (title,slug,excerpt,content,source,image,status,published_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', n);
      }
      console.log('✅ News seeded');
    }

    // Technologies
    const techCount = await client.query('SELECT COUNT(*) FROM technologies');
    if (parseInt(techCount.rows[0].count) === 0) {
      const techs = [
        ['Sensor Tanah IoT', 'sensor-tanah-iot', 'Monitoring pH, kelembapan, suhu real-time', '- pH Tanah\n- Kelembapan ±2%\n- Suhu\n- Nutrisi NPK', '🌍', null, 'published'],
        ['Smart Irrigation', 'smart-irrigation', 'Irigasi otomatis berbasis sensor', '- Auto Watering\n- Schedule Timer\n- Water Saving 40%', '💧', null, 'published'],
        ['Drone Pertanian', 'drone-pertanian', 'Pemetaan dan penyemprotan presisi', '- Aerial Mapping\n- Precision Spray\n- Yield Estimation', '🛩️', null, 'published'],
        ['AI Analytics', 'ai-analytics', 'Prediksi cuaca dan rekomendasi tanam', '- Weather Prediction\n- Crop Recommendation\n- Disease Detection', '🤖', null, 'published'],
        ['Connected Farm', 'connected-farm', 'Jaringan sensor real-time ke cloud', '- Real-time Data\n- Cloud Dashboard\n- Mobile App', '📡', null, 'published'],
      ];
      for (const t of techs) {
        await client.query('INSERT INTO technologies (title,slug,description,details,icon,image,status) VALUES ($1,$2,$3,$4,$5,$6,$7)', t);
      }
      console.log('✅ Technologies seeded');
    }

    await client.query('COMMIT');
    console.log('🎉 Seed complete!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
