import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [products, categories, commodities, articles, news, messages, recentProducts, recentArticles, recentMessages] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM products'),
      pool.query('SELECT COUNT(*) FROM categories'),
      pool.query('SELECT COUNT(*) FROM commodities'),
      pool.query('SELECT COUNT(*) FROM articles'),
      pool.query('SELECT COUNT(*) FROM news'),
      pool.query('SELECT COUNT(*) FROM contact_messages'),
      pool.query('SELECT id, name, price, status, created_at FROM products ORDER BY created_at DESC LIMIT 5'),
      pool.query('SELECT id, title, category, status, created_at FROM articles ORDER BY created_at DESC LIMIT 5'),
      pool.query('SELECT id, name, subject, status, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 5'),
    ]);
    return NextResponse.json({
      stats: {
        products: parseInt(products.rows[0].count),
        categories: parseInt(categories.rows[0].count),
        commodities: parseInt(commodities.rows[0].count),
        articles: parseInt(articles.rows[0].count),
        news: parseInt(news.rows[0].count),
        messages: parseInt(messages.rows[0].count),
      },
      recentProducts: recentProducts.rows,
      recentArticles: recentArticles.rows,
      recentMessages: recentMessages.rows,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Gagal mengambil data dashboard' }, { status: 500 });
  }
}
