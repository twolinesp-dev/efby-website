/**
 * EFBY SQLite → Supabase Migration Script
 * Reads all local SQLite data and upserts into Supabase
 */

import Database from 'better-sqlite3';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'data', 'efby.db');

const SUPABASE_URL = 'https://ibfrpjwzsrdinnspjgrr.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZnJwand6c3JkaW5uc3BqZ3JyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzE3MDcxMiwiZXhwIjoyMTA4NzQ2NzEyfQ.LThSRC7v3wz4wt7UbPwoxxxkyEqqVerPOGz5kj9RNoI';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const sqlite = new Database(dbPath, { readonly: true });

let totalSuccess = 0;
let totalFailed = 0;

async function migrate(label, rows, table, transform, onConflict = 'id') {
  if (!rows.length) {
    console.log(`⏭️  ${label}: no rows, skipping`);
    return;
  }
  console.log(`\n🔄 Migrating ${rows.length} ${label}...`);

  const transformed = rows.map(transform);

  // Upsert in batches of 50
  const BATCH = 50;
  for (let i = 0; i < transformed.length; i += BATCH) {
    const batch = transformed.slice(i, i + BATCH);
    const { error } = await supabase.from(table).upsert(batch, { onConflict });
    if (error) {
      console.log(`  ❌ Batch ${Math.floor(i / BATCH) + 1} failed: ${error.message}`);
      totalFailed += batch.length;
    } else {
      console.log(`  ✅ Batch ${Math.floor(i / BATCH) + 1}: ${batch.length} rows inserted`);
      totalSuccess += batch.length;
    }
  }
}

// Helper: convert SQLite 0/1 integers to booleans
const bool = (v) => v === 1 || v === true;

// Helper: parse date safely
const toIso = (v) => {
  if (!v) return new Date().toISOString();
  const d = new Date(v);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
};

// ── 1. Collections ────────────────────────────────────────────────────────────
const collections = sqlite.prepare('SELECT * FROM collections').all();
await migrate('Collections', collections, 'collections', (r) => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  description: r.description ?? null,
  cover_image: r.cover_image ?? null,
  display_order: r.display_order ?? 0,
  is_hidden: bool(r.is_hidden),
  is_featured: bool(r.is_featured),
  created_at: toIso(r.created_at),
  updated_at: toIso(r.updated_at),
}));

// ── 2. Articles ───────────────────────────────────────────────────────────────
const articles = sqlite.prepare('SELECT * FROM articles').all();
await migrate('Articles', articles, 'articles', (r) => ({
  id: r.id,
  article_number: r.article_number,
  model_name: r.model_name ?? null,
  slug: r.slug,
  primary_collection_id: r.primary_collection_id ?? null,
  short_description: r.short_description ?? null,
  full_description: r.full_description ?? null,
  main_image: r.main_image,
  publication_status: r.publication_status ?? 'published',
  trending: bool(r.trending),
  new_arrival: bool(r.new_arrival),
  launch_date: r.launch_date ? r.launch_date.split(' ')[0] : null,
  featured: bool(r.featured),
  display_price: bool(r.display_price),
  price: r.price ?? null,
  sale_price: r.sale_price ?? null,
  availability: r.availability ?? 'In Stock',
  materials: r.materials ?? null,
  dimensions: r.dimensions ?? null,
  capacity: r.capacity ?? null,
  weight: r.weight ?? null,
  compartments: r.compartments ?? null,
  features: r.features ?? null,
  display_order: r.display_order ?? 0,
  seo_title: r.seo_title ?? null,
  seo_description: r.seo_description ?? null,
  created_at: toIso(r.created_at),
  updated_at: toIso(r.updated_at),
}));

// ── 3. Article Collection Memberships ─────────────────────────────────────────
const memberships = sqlite.prepare('SELECT * FROM article_collection_memberships').all();
await migrate('Collection Memberships', memberships, 'article_collection_memberships', (r) => ({
  id: r.id,
  article_id: r.article_id,
  collection_id: r.collection_id,
  is_primary: bool(r.is_primary),
  display_order: r.display_order ?? 0,
  created_at: toIso(r.created_at),
}));

// ── 4. Article Images ─────────────────────────────────────────────────────────
const images = sqlite.prepare('SELECT * FROM article_images').all();
await migrate('Article Images', images, 'article_images', (r) => ({
  id: r.id,
  article_id: r.article_id,
  image_url: r.image_url,
  caption: r.caption ?? null,
  display_order: r.display_order ?? 0,
  colour_name: r.colour_name ?? null,
  is_primary: bool(r.is_primary),
  created_at: toIso(r.created_at),
}));

// ── 5. Article Colours ────────────────────────────────────────────────────────
const colours = sqlite.prepare('SELECT * FROM article_colours').all();
await migrate('Article Colours', colours, 'article_colours', (r) => ({
  id: r.id,
  article_id: r.article_id,
  name: r.name,
  hex_code: r.hex_code,
  secondary_hex: r.secondary_hex ?? null,
  image_url: r.image_url ?? null,
  display_order: r.display_order ?? 0,
  is_available: bool(r.is_available ?? 1),
  created_at: new Date().toISOString(),
}));

// ── 6. Enquiries ──────────────────────────────────────────────────────────────
const enquiries = sqlite.prepare('SELECT * FROM enquiries').all();
await migrate('Enquiries', enquiries, 'enquiries', (r) => ({
  id: r.id,
  article_id: r.article_id ?? null,
  article_number: r.article_number,
  model_name: r.model_name ?? null,
  customer_name: r.customer_name,
  phone: r.phone,
  email: r.email ?? null,
  selected_colour: r.selected_colour ?? null,
  message: r.message ?? null,
  status: r.status ?? 'new',
  admin_notes: r.admin_notes ?? null,
  created_at: toIso(r.created_at),
}));

// ── 7. Site Settings ──────────────────────────────────────────────────────────
const settings = sqlite.prepare('SELECT * FROM site_settings').all();
await migrate('Site Settings', settings, 'site_settings', (r) => ({
  key: r.key,
  value: r.value ?? null,
  description: r.description ?? null,
  updated_at: toIso(r.updated_at),
}), 'key');

// ── Summary ───────────────────────────────────────────────────────────────────
sqlite.close();
console.log(`\n${'─'.repeat(50)}`);
console.log(`✅ Migration complete!`);
console.log(`   Total success : ${totalSuccess} rows`);
console.log(`   Total failed  : ${totalFailed} rows`);
if (totalFailed === 0) {
  console.log(`\n🎉 All data is now in Supabase!`);
} else {
  console.log(`\n⚠️  Some rows failed — check errors above.`);
}
