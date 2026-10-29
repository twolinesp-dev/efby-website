import sqlite from './db';
import { Collection, Article, ArticleColour, ArticleImage, Enquiry, SiteSettings } from './types';
import crypto from 'crypto';

// Ensure seed data exists
export function seedInitialData() {
  const collectionCount = sqlite.prepare('SELECT COUNT(*) as count FROM collections').get() as { count: number };
  if (collectionCount.count > 0) {
    return; // Already seeded
  }

  const collectionsData = [
    {
      id: 'col-handbags',
      slug: 'handbags',
      name: 'Handbags',
      description: 'Sophisticated silhouettes crafted with precision leatherwork and understated luxury hardware.',
      cover_image: '/uploads/efby_aethel_handbag.webp',
      display_order: 1,
      is_hidden: 0,
      is_featured: 1,
    },
    {
      id: 'col-school-bags',
      slug: 'school-bags',
      name: 'School Bags',
      description: 'Ergonomic, featherlight, and exceptionally reinforced school bags built for everyday resilience.',
      cover_image: '/uploads/web_1775897344523-ahgam2.webp',
      display_order: 2,
      is_hidden: 0,
      is_featured: 1,
    },
    {
      id: 'col-office-bags',
      slug: 'office-bags',
      name: 'Office Bags',
      description: 'Executive briefcases and structured business satchels engineered for the modern professional.',
      cover_image: '/uploads/web_1775651557175-k3hgyk.webp',
      display_order: 3,
      is_hidden: 0,
      is_featured: 1,
    },
    {
      id: 'col-travel-bags',
      slug: 'travel-bags',
      name: 'Travel Bags',
      description: 'Expansive weekenders, garment duffles, and cabin-ready luggage tailored for effortless voyaging.',
      cover_image: '/uploads/web_1775886370717-7beo7l.webp',
      display_order: 4,
      is_hidden: 0,
      is_featured: 1,
    },
    {
      id: 'col-laptop-bags',
      slug: 'laptop-bags',
      name: 'Laptop Bags',
      description: 'Shock-absorbing protective sleeves and multi-compartment commuter packs for laptops up to 16".',
      cover_image: '/uploads/web_1775651344003-g5tx79.webp',
      display_order: 5,
      is_hidden: 0,
      is_featured: 1,
    },
    {
      id: 'col-backpacks',
      slug: 'backpacks',
      name: 'Backpacks',
      description: 'Versatile daily carry backpacks blending architectural lines with high-durability fabrics.',
      cover_image: '/uploads/web_1775897350654-4l27fk.webp',
      display_order: 6,
      is_hidden: 0,
      is_featured: 1,
    },
    {
      id: 'col-college-bags',
      slug: 'college-bags',
      name: 'College Bags',
      description: 'Urban everyday carry designed for campus lifestyles, textbooks, tech accessories, and effortless style.',
      cover_image: '/uploads/web_1775897348017-mjqral.webp',
      display_order: 7,
      is_hidden: 0,
      is_featured: 0,
    },
    {
      id: 'col-sling-bags',
      slug: 'sling-bags',
      name: 'Sling Bags',
      description: 'Compact cross-body slings offering quick-draw accessibility and minimalist everyday carry.',
      cover_image: '/uploads/web_1775651360766-oqpz0g.webp',
      display_order: 8,
      is_hidden: 0,
      is_featured: 1,
    },
    {
      id: 'col-tote-bags',
      slug: 'tote-bags',
      name: 'Tote Bags',
      description: 'Spacious, refined totes crafted with durable double-stitched straps and interior organization.',
      cover_image: '/uploads/web_1775651351631-8oj6e3.webp',
      display_order: 9,
      is_hidden: 0,
      is_featured: 0,
    },
  ];

  const insertCollection = sqlite.prepare(`
    INSERT INTO collections (id, slug, name, description, cover_image, display_order, is_hidden, is_featured)
    VALUES (@id, @slug, @name, @description, @cover_image, @display_order, @is_hidden, @is_featured)
  `);

  sqlite.transaction(() => {
    for (const c of collectionsData) {
      insertCollection.run(c);
    }
  })();

  // Seed sample Articles with unique Article Numbers
  const sampleArticles = [
    {
      id: 'art-001',
      article_number: 'EF-HB-001',
      model_name: 'Aethel Luxury Handbag',
      slug: 'ef-hb-001',
      primary_collection_id: 'col-handbags',
      short_description: 'Architectural top-handle handbag crafted from micro-grain vegan leather with champagne gold hardware.',
      full_description: 'The EFBY Aethel Handbag represents our master artisans’ dedication to minimalist structural beauty. Featuring hand-burnished edges, magnetic flap closure with dual interior slip pockets, and a detachable crossbody strap, it transitions seamlessly from boardroom meetings to evening engagements.',
      main_image: '/uploads/efby_aethel_handbag.webp',
      publication_status: 'published',
      trending: 1,
      new_arrival: 1,
      launch_date: '2026-03-15',
      featured: 1,
      display_price: 1,
      price: 4899,
      sale_price: 4299,
      availability: 'In Stock',
      materials: 'Full-Grain Vegan Nappa, Champagne Gold Alloy Accents',
      dimensions: '28cm x 22cm x 11cm',
      capacity: '6.5 Litres',
      weight: '620 grams',
      compartments: 'Dual main compartments, center zip divider, RFID slip pocket',
      features: 'Detachable strap, magnetic self-aligning closure, water-resistant base studs',
      display_order: 1,
      colours: [
        { name: 'Warm Ivory', hex_code: '#FAF7F2' },
        { name: 'Espresso Noir', hex_code: '#1C1512' },
        { name: 'Cognac Amber', hex_code: '#8B4513' },
      ],
      gallery: [
        '/uploads/efby_aethel_handbag.webp',
        '/uploads/web_1775651557175-k3hgyk.webp',
        '/uploads/web_1775651351631-8oj6e3.webp'
      ]
    },
    {
      id: 'art-002',
      article_number: 'EF-SB-014',
      model_name: 'ProGrade Ergonomic School Bag',
      slug: 'ef-sb-014',
      primary_collection_id: 'col-school-bags',
      short_description: 'Anatomic spine-support backpack with triple-reinforced stitching, water-repellent shell, and 12-month factory guarantee.',
      full_description: 'Constructed to withstand rigorous daily school life, the EFBY ProGrade Ergonomic School Bag delivers supreme lumbar comfort through multi-layer ventilated air-mesh cushioning. Includes insulated lunch compartment, reinforced bottle holsters, and a heavy-duty scratch-resistant bottom.',
      main_image: '/uploads/web_1775897344523-ahgam2.webp',
      publication_status: 'published',
      trending: 1,
      new_arrival: 0,
      launch_date: '2026-02-10',
      featured: 1,
      display_price: 1,
      price: 1899,
      sale_price: 1649,
      availability: 'In Stock',
      materials: '900D Ballistic Diamond Poly with Hydro-Repellent Finish',
      dimensions: '45cm x 32cm x 20cm',
      capacity: '28 Litres',
      weight: '780 grams',
      compartments: '3 large zipper compartments, padded tablet sleeve, 2 quick-access side pockets',
      features: 'S-curve ergonomic shoulder pads, reflective night safety trims, 12-Month Factory Warranty',
      display_order: 2,
      colours: [
        { name: 'Royal Sapphire', hex_code: '#1E3A8A' },
        { name: 'Obsidian Black', hex_code: '#18181B' },
        { name: 'Crimson Scarlet', hex_code: '#DC2626' },
      ],
      gallery: [
        '/uploads/web_1775897344523-ahgam2.webp',
        '/uploads/web_1775897348017-mjqral.webp',
        '/uploads/web_1775897350654-4l27fk.webp'
      ]
    },
    {
      id: 'art-003',
      article_number: 'EF-OB-022',
      model_name: 'Vanguard Executive Briefcase',
      slug: 'ef-ob-022',
      primary_collection_id: 'col-office-bags',
      short_description: 'Structured business portfolio with padded 15.6" laptop cradle and trolley-pass sleeve.',
      full_description: 'A benchmark of understated professionalism. Handcrafted with sleek structured walls, gunmetal fittings, and a dedicated cable organizer. Fits standard documents without creasing and slides smoothly over luggage handles.',
      main_image: '/uploads/web_1775651557175-k3hgyk.webp',
      publication_status: 'published',
      trending: 0,
      new_arrival: 1,
      launch_date: '2026-03-20',
      featured: 1,
      display_price: 1,
      price: 3699,
      sale_price: null,
      availability: 'In Stock',
      materials: 'Textured Water-Resistant Composite Leather & Matte Canvas',
      dimensions: '41cm x 30cm x 9cm',
      capacity: '12 Litres',
      weight: '890 grams',
      compartments: 'Dual tech compartments, pen holders, business card sleeves, passport pocket',
      features: 'Rear trolley sleeve, detachable padded shoulder pad, YKK lockable zipper pulls',
      display_order: 3,
      colours: [
        { name: 'Espresso Brown', hex_code: '#2B1B17' },
        { name: 'Charcoal Black', hex_code: '#212121' },
      ],
      gallery: [
        '/uploads/web_1775651557175-k3hgyk.webp',
        '/uploads/web_1775651344003-g5tx79.webp'
      ]
    },
    {
      id: 'art-004',
      article_number: 'EF-TB-035',
      model_name: 'Nomad 48-Hour Weekender',
      slug: 'ef-tb-035',
      primary_collection_id: 'col-travel-bags',
      short_description: 'Duffel bag with separate ventilated shoe compartment, heavy-duty brass clips, and water-sealed zippers.',
      full_description: 'Built for the spontaneous getaway or extended gym routine. The Nomad Weekender combines voluminous storage with dedicated hygiene separation for footwear and wet garments. Reinforced bottom feet protect against damp surfaces.',
      main_image: '/uploads/web_1775886370717-7beo7l.webp',
      publication_status: 'published',
      trending: 1,
      new_arrival: 0,
      launch_date: '2026-01-25',
      featured: 1,
      display_price: 1,
      price: 4499,
      sale_price: 3999,
      availability: 'In Stock',
      materials: 'Heavyweight Waxed Canvas with Saddle Leather Trims',
      dimensions: '52cm x 31cm x 26cm',
      capacity: '42 Litres',
      weight: '1.2 kg',
      compartments: 'Oversized main chamber, ventilated shoe capsule, water-resistant toiletry sleeve',
      features: 'Reinforced twin handles, removable orthopedic shoulder pad, solid metal clasps',
      display_order: 4,
      colours: [
        { name: 'Olive Drab', hex_code: '#556B2F' },
        { name: 'Desert Khaki', hex_code: '#C2B280' },
        { name: 'Deep Navy', hex_code: '#000080' },
      ],
      gallery: [
        '/uploads/web_1775886370717-7beo7l.webp',
        '/uploads/web_1775897357344-262vp7.webp'
      ]
    },
    {
      id: 'art-005',
      article_number: 'EF-BP-108',
      model_name: 'Urban Transit Tech Pack',
      slug: 'ef-bp-108',
      primary_collection_id: 'col-backpacks',
      short_description: 'Sleek aerodynamic commuter backpack with integrated USB pass-through and hidden anti-theft security pocket.',
      full_description: 'Designed specifically for urban commuters. The Transit Tech Pack keeps all devices safe and organized with plush micro-fleece linings, weatherproof exterior zip seals, and hidden passport pocket nestled into the lower lumbar cushion.',
      main_image: '/uploads/web_1775897350654-4l27fk.webp',
      publication_status: 'published',
      trending: 1,
      new_arrival: 1,
      launch_date: '2026-04-01',
      featured: 1,
      display_price: 1,
      price: 2999,
      sale_price: 2699,
      availability: 'In Stock',
      materials: 'Weatherproof Oxford Weave with Matte TPU coating',
      dimensions: '46cm x 31cm x 16cm',
      capacity: '24 Litres',
      weight: '820 grams',
      compartments: '16" Suspended laptop sleeve, tablet pouch, quick-access sunglasses pocket',
      features: 'Integrated USB charging port, anti-theft back pocket, luggage pass-through strap',
      display_order: 5,
      colours: [
        { name: 'Space Gray', hex_code: '#4B5563' },
        { name: 'Pitch Black', hex_code: '#111827' },
      ],
      gallery: [
        '/uploads/web_1775897350654-4l27fk.webp',
        '/uploads/web_1775897353409-yy6clt.webp'
      ]
    },
    {
      id: 'art-006',
      article_number: 'EF-SL-045',
      model_name: 'Apex Compact Crossbody Sling',
      slug: 'ef-sl-045',
      primary_collection_id: 'col-sling-bags',
      short_description: 'Minimalist quick-draw sling pack designed for essentials: phone, wallet, keys, and compact camera.',
      full_description: 'Engineered for rapid daily movement. The Apex Sling hugs the torso naturally, featuring ambidextrous strap positioning, magnetic Fidlock buckle release, and internal key leash with quick-release snap.',
      main_image: '/uploads/web_1775651360766-oqpz0g.webp',
      publication_status: 'published',
      trending: 0,
      new_arrival: 1,
      launch_date: '2026-04-05',
      featured: 1,
      display_price: 1,
      price: 1499,
      sale_price: 1299,
      availability: 'In Stock',
      materials: 'Cordura Ripstop with DWR coating',
      dimensions: '30cm x 16cm x 8cm',
      capacity: '4 Litres',
      weight: '340 grams',
      compartments: 'Front zipper pocket, partitioned center cargo, rear security pocket',
      features: 'Quick-adjust magnetic strap, reflective zip pulls, integrated key fob',
      display_order: 6,
      colours: [
        { name: 'Matte Black', hex_code: '#1F2937' },
        { name: 'Steel Slate', hex_code: '#64748B' },
        { name: 'Crimson Rust', hex_code: '#991B1B' },
      ],
      gallery: [
        '/uploads/web_1775651360766-oqpz0g.webp',
        '/uploads/web_1775651363653-t6hu7n.webp'
      ]
    },
  ];

  const insertArticle = sqlite.prepare(`
    INSERT INTO articles (
      id, article_number, model_name, slug, primary_collection_id,
      short_description, full_description, main_image, publication_status,
      trending, new_arrival, launch_date, featured, display_price,
      price, sale_price, availability, materials, dimensions, capacity,
      weight, compartments, features, display_order
    ) VALUES (
      @id, @article_number, @model_name, @slug, @primary_collection_id,
      @short_description, @full_description, @main_image, @publication_status,
      @trending, @new_arrival, @launch_date, @featured, @display_price,
      @price, @sale_price, @availability, @materials, @dimensions, @capacity,
      @weight, @compartments, @features, @display_order
    )
  `);

  const insertMembership = sqlite.prepare(`
    INSERT INTO article_collection_memberships (id, article_id, collection_id, is_primary)
    VALUES (?, ?, ?, 1)
  `);

  const insertImage = sqlite.prepare(`
    INSERT INTO article_images (id, article_id, image_url, display_order, is_primary)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertColour = sqlite.prepare(`
    INSERT INTO article_colours (id, article_id, name, hex_code, secondary_hex, display_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  sqlite.transaction(() => {
    for (const a of sampleArticles) {
      insertArticle.run(a);
      insertMembership.run(`mem-${a.id}`, a.id, a.primary_collection_id);

      // Gallery
      let order = 1;
      for (const img of a.gallery) {
        insertImage.run(
          `img-${a.id}-${order}`,
          a.id,
          img,
          order,
          order === 1 ? 1 : 0
        );
        order++;
      }

      // Colours
      let cOrder = 1;
      for (const col of a.colours) {
        insertColour.run(
          `col-${a.id}-${cOrder}`,
          a.id,
          col.name,
          col.hex_code,
          (col as any).secondary_hex || null,
          cOrder
        );
        cOrder++;
      }
    }
  })();

  // Seed default site settings
  const settings = [
    { key: 'whatsapp_number', value: '+919847000000', description: 'Business WhatsApp for enquiries' },
    { key: 'contact_phone', value: '+91 9847 000 000', description: 'Customer support hotline' },
    { key: 'contact_email', value: 'enquiry@efby.in', description: 'Enquiry email address' },
    { key: 'address', value: 'EFBY Luxury Bag Works, Kottarakkara, Kerala, India', description: 'Headquarters & Showroom' },
    { key: 'global_price_display', value: '1', description: 'Show prices across public catalogue' },
  ];

  const insertSetting = sqlite.prepare(`
    INSERT OR REPLACE INTO site_settings (key, value, description)
    VALUES (@key, @value, @description)
  `);

  for (const s of settings) {
    insertSetting.run(s);
  }
}

// Auto-seed on load
seedInitialData();

// --- CATALOGUE API FUNCTIONS ---

// 1. Collections
export function getCollections(includeHidden = false): Collection[] {
  let query = `
    SELECT c.*, 
      (SELECT COUNT(*) FROM articles a 
       WHERE a.primary_collection_id = c.id 
       AND a.publication_status = 'published') as article_count
    FROM collections c
  `;
  if (!includeHidden) {
    query += ` WHERE c.is_hidden = 0`;
  }
  query += ` ORDER BY c.display_order ASC, c.name ASC`;
  
  const rows = sqlite.prepare(query).all() as any[];
  return rows.map(r => ({
    ...r,
    is_hidden: Boolean(r.is_hidden),
    is_featured: Boolean(r.is_featured),
    article_count: Number(r.article_count || 0),
  }));
}

export function getCollectionBySlug(slug: string): Collection | null {
  // Support dynamic special collections
  if (slug === 'trending') {
    const count = sqlite.prepare(`
      SELECT COUNT(*) as count FROM articles 
      WHERE trending = 1 AND publication_status = 'published'
    `).get() as { count: number };
    return {
      id: 'dynamic-trending',
      slug: 'trending',
      name: 'Trending',
      description: 'The most popular, sought-after EFBY bag models celebrated for exceptional performance and design.',
      cover_image: '/uploads/web_1775723735904-tpf6ow.webp',
      display_order: 0,
      is_hidden: false,
      is_featured: true,
      article_count: count.count,
    };
  }

  if (slug === 'newly-launched') {
    const count = sqlite.prepare(`
      SELECT COUNT(*) as count FROM articles 
      WHERE new_arrival = 1 AND publication_status = 'published'
    `).get() as { count: number };
    return {
      id: 'dynamic-newly-launched',
      slug: 'newly-launched',
      name: 'Newly Launched',
      description: 'Fresh from our design atelier. Discover the newest EFBY releases, experimental fabrications, and seasonal editions.',
      cover_image: '/uploads/web_1775897350654-4l27fk.webp',
      display_order: 0,
      is_hidden: false,
      is_featured: true,
      article_count: count.count,
    };
  }

  const row = sqlite.prepare(`
    SELECT c.*, 
      (SELECT COUNT(*) FROM articles a 
       WHERE a.primary_collection_id = c.id 
       AND a.publication_status = 'published') as article_count
    FROM collections c
    WHERE c.slug = ?
  `).get(slug) as any;

  if (!row) return null;
  return {
    ...row,
    is_hidden: Boolean(row.is_hidden),
    is_featured: Boolean(row.is_featured),
    article_count: Number(row.article_count || 0),
  };
}

// 2. Articles
interface GetArticlesOptions {
  collectionSlug?: string;
  trendingOnly?: boolean;
  newArrivalOnly?: boolean;
  featuredOnly?: boolean;
  includeUnpublished?: boolean;
  search?: string;
  sort?: 'featured' | 'newest' | 'article_asc' | 'article_desc' | 'price_asc' | 'price_desc';
  colour?: string;
  limit?: number;
}

export function getArticles(options: GetArticlesOptions = {}): Article[] {
  let conditions: string[] = [];
  let params: any[] = [];

  if (!options.includeUnpublished) {
    conditions.push(`a.publication_status = 'published'`);
  }

  if (options.trendingOnly || options.collectionSlug === 'trending') {
    conditions.push(`a.trending = 1`);
  } else if (options.newArrivalOnly || options.collectionSlug === 'newly-launched') {
    conditions.push(`a.new_arrival = 1`);
  } else if (options.collectionSlug) {
    conditions.push(`c.slug = ?`);
    params.push(options.collectionSlug);
  }

  if (options.featuredOnly) {
    conditions.push(`a.featured = 1`);
  }

  if (options.search) {
    const term = `%${options.search.trim()}%`;
    conditions.push(`(
      a.article_number LIKE ? 
      OR a.model_name LIKE ? 
      OR a.short_description LIKE ? 
      OR c.name LIKE ?
    )`);
    params.push(term, term, term, term);
  }

  if (options.colour) {
    conditions.push(`EXISTS (
      SELECT 1 FROM article_colours ac 
      WHERE ac.article_id = a.id AND ac.name = ?
    )`);
    params.push(options.colour);
  }

  let orderBy = 'a.display_order ASC, a.created_at DESC';
  if (options.sort === 'newest') {
    orderBy = 'a.created_at DESC';
  } else if (options.sort === 'article_asc') {
    orderBy = 'a.article_number ASC';
  } else if (options.sort === 'article_desc') {
    orderBy = 'a.article_number DESC';
  } else if (options.sort === 'price_asc') {
    orderBy = 'COALESCE(a.sale_price, a.price) ASC';
  } else if (options.sort === 'price_desc') {
    orderBy = 'COALESCE(a.sale_price, a.price) DESC';
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const limitClause = options.limit ? `LIMIT ${options.limit}` : '';

  const sql = `
    SELECT a.*, c.name as collection_name, c.slug as collection_slug
    FROM articles a
    LEFT JOIN collections c ON a.primary_collection_id = c.id
    ${whereClause}
    ORDER BY ${orderBy}
    ${limitClause}
  `;

  const rows = sqlite.prepare(sql).all(...params) as any[];

  return rows.map(r => formatArticle(r));
}

export function getArticleBySlugOrNumber(slugOrNumber: string, includeUnpublished = false): Article | null {
  const clean = slugOrNumber.trim();
  const lower = clean.toLowerCase();
  
  let condition = `(LOWER(a.slug) = ? OR LOWER(a.article_number) = ?)`;
  if (!includeUnpublished) {
    condition += ` AND a.publication_status = 'published'`;
  }

  const row = sqlite.prepare(`
    SELECT a.*, c.name as collection_name, c.slug as collection_slug
    FROM articles a
    LEFT JOIN collections c ON a.primary_collection_id = c.id
    WHERE ${condition}
  `).get(lower, lower) as any;

  if (!row) return null;
  return formatArticle(row, true);
}

// Format article record and attach related child items
function formatArticle(row: any, includeRelations = true): Article {
  const article: Article = {
    id: row.id,
    article_number: row.article_number,
    model_name: row.model_name,
    slug: row.slug,
    primary_collection_id: row.primary_collection_id,
    collection_name: row.collection_name,
    collection_slug: row.collection_slug,
    short_description: row.short_description,
    full_description: row.full_description,
    main_image: row.main_image,
    publication_status: row.publication_status,
    trending: Boolean(row.trending),
    new_arrival: Boolean(row.new_arrival),
    launch_date: row.launch_date,
    featured: Boolean(row.featured),
    display_price: Boolean(row.display_price),
    price: row.price ? Number(row.price) : null,
    sale_price: row.sale_price ? Number(row.sale_price) : null,
    availability: row.availability || 'In Stock',
    materials: row.materials,
    dimensions: row.dimensions,
    capacity: row.capacity,
    weight: row.weight,
    compartments: row.compartments,
    features: row.features,
    display_order: Number(row.display_order || 0),
    seo_title: row.seo_title,
    seo_description: row.seo_description,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };

  if (includeRelations) {
    // Fetch colours
    const colours = sqlite.prepare(`
      SELECT * FROM article_colours 
      WHERE article_id = ? 
      ORDER BY display_order ASC
    `).all(row.id) as any[];

    article.colours = colours.map(c => ({
      id: c.id,
      article_id: c.article_id,
      name: c.name,
      hex_code: c.hex_code,
      secondary_hex: c.secondary_hex || null,
      display_order: c.display_order,
      is_available: Boolean(c.is_available),
      image_url: c.image_url || null,
    }));

    // Fetch images
    const images = sqlite.prepare(`
      SELECT * FROM article_images 
      WHERE article_id = ? 
      ORDER BY is_primary DESC, display_order ASC
    `).all(row.id) as any[];

    article.images = images.map(img => ({
      id: img.id,
      article_id: img.article_id,
      image_url: img.image_url,
      caption: img.caption,
      display_order: img.display_order,
      colour_name: img.colour_name,
      is_primary: Boolean(img.is_primary),
    }));
  }

  return article;
}

// 3. Article Validation & Mutations
export function checkArticleNumberExists(articleNumber: string, excludeArticleId?: string): boolean {
  const clean = articleNumber.trim();
  let query = `SELECT id FROM articles WHERE LOWER(article_number) = LOWER(?)`;
  const params: any[] = [clean];
  if (excludeArticleId) {
    query += ` AND id != ?`;
    params.push(excludeArticleId);
  }
  const match = sqlite.prepare(query).get(...params);
  return Boolean(match);
}

export function saveArticle(data: any): { success: boolean; article?: Article; error?: string } {
  const articleNumber = (data.article_number || '').trim().toUpperCase();
  if (!articleNumber) {
    return { success: false, error: 'Article Number is strictly required.' };
  }

  const isNew = !data.id;
  const articleId = data.id || `art-${crypto.randomUUID().slice(0, 8)}`;

  // Enforce Uniqueness
  if (checkArticleNumberExists(articleNumber, isNew ? undefined : articleId)) {
    return { 
      success: false, 
      error: `Article Number "${articleNumber}" is already in use. Every Article Number in EFBY must be unique.` 
    };
  }

  const slug = (data.slug || articleNumber.toLowerCase().replace(/[^a-z0-9_-]/g, '-')).toLowerCase();

  const record = {
    id: articleId,
    article_number: articleNumber,
    model_name: data.model_name?.trim() || null,
    slug: slug,
    primary_collection_id: data.primary_collection_id || null,
    short_description: data.short_description?.trim() || null,
    full_description: data.full_description?.trim() || null,
    main_image: data.main_image || '/uploads/web_1775723735904-tpf6ow.webp',
    publication_status: data.publication_status || 'published',
    trending: data.trending ? 1 : 0,
    new_arrival: data.new_arrival ? 1 : 0,
    launch_date: data.launch_date || new Date().toISOString().split('T')[0],
    featured: data.featured ? 1 : 0,
    display_price: data.display_price ? 1 : 0,
    price: data.price ? parseFloat(data.price) : null,
    sale_price: data.sale_price ? parseFloat(data.sale_price) : null,
    availability: data.availability || 'In Stock',
    materials: data.materials?.trim() || null,
    dimensions: data.dimensions?.trim() || null,
    capacity: data.capacity?.trim() || null,
    weight: data.weight?.trim() || null,
    compartments: data.compartments?.trim() || null,
    features: data.features?.trim() || null,
    display_order: parseInt(data.display_order || '0', 10),
    seo_title: data.seo_title?.trim() || null,
    seo_description: data.seo_description?.trim() || null,
    updated_at: new Date().toISOString(),
  };

  try {
    sqlite.transaction(() => {
      if (isNew) {
        sqlite.prepare(`
          INSERT INTO articles (
            id, article_number, model_name, slug, primary_collection_id,
            short_description, full_description, main_image, publication_status,
            trending, new_arrival, launch_date, featured, display_price,
            price, sale_price, availability, materials, dimensions, capacity,
            weight, compartments, features, display_order, seo_title, seo_description
          ) VALUES (
            @id, @article_number, @model_name, @slug, @primary_collection_id,
            @short_description, @full_description, @main_image, @publication_status,
            @trending, @new_arrival, @launch_date, @featured, @display_price,
            @price, @sale_price, @availability, @materials, @dimensions, @capacity,
            @weight, @compartments, @features, @display_order, @seo_title, @seo_description
          )
        `).run(record);
      } else {
        sqlite.prepare(`
          UPDATE articles SET
            article_number = @article_number,
            model_name = @model_name,
            slug = @slug,
            primary_collection_id = @primary_collection_id,
            short_description = @short_description,
            full_description = @full_description,
            main_image = @main_image,
            publication_status = @publication_status,
            trending = @trending,
            new_arrival = @new_arrival,
            launch_date = @launch_date,
            featured = @featured,
            display_price = @display_price,
            price = @price,
            sale_price = @sale_price,
            availability = @availability,
            materials = @materials,
            dimensions = @dimensions,
            capacity = @capacity,
            weight = @weight,
            compartments = @compartments,
            features = @features,
            display_order = @display_order,
            seo_title = @seo_title,
            seo_description = @seo_description,
            updated_at = @updated_at
          WHERE id = @id
        `).run(record);
      }

      // Colours
      if (Array.isArray(data.colours)) {
        sqlite.prepare('DELETE FROM article_colours WHERE article_id = ?').run(articleId);
        const insColour = sqlite.prepare(`
          INSERT INTO article_colours (id, article_id, name, hex_code, secondary_hex, display_order, image_url)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        let idx = 1;
        for (const col of data.colours) {
          if (col.name) {
            insColour.run(
              `col-${articleId}-${idx}`, 
              articleId, 
              col.name.trim(), 
              col.hex_code || '#000000', 
              col.secondary_hex ? col.secondary_hex.trim() : null,
              idx,
              col.image_url ? col.image_url.trim() : null
            );
            idx++;
          }
        }
      }

      // Images
      if (Array.isArray(data.images) || Array.isArray(data.colours)) {
        sqlite.prepare('DELETE FROM article_images WHERE article_id = ?').run(articleId);
        const insImage = sqlite.prepare(`
          INSERT INTO article_images (id, article_id, image_url, display_order, colour_name, is_primary)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        let idx = 1;
        const insertedUrls = new Set<string>();

        // 1. Insert explicit gallery images
        if (Array.isArray(data.images)) {
          for (const img of data.images) {
            if (img.image_url) {
              const url = img.image_url.trim();
              insImage.run(
                `img-${articleId}-${idx}`,
                articleId,
                url,
                idx,
                img.colour_name?.trim() || null,
                idx === 1 ? 1 : 0
              );
              insertedUrls.add(url);
              idx++;
            }
          }
        }

        // 2. Automatically sync any image added against a colour into article_images
        if (Array.isArray(data.colours)) {
          for (const col of data.colours) {
            if (col.image_url && col.name && !insertedUrls.has(col.image_url.trim())) {
              const url = col.image_url.trim();
              insImage.run(
                `img-${articleId}-${idx}`,
                articleId,
                url,
                idx,
                col.name.trim(),
                idx === 1 ? 1 : 0
              );
              insertedUrls.add(url);
              idx++;
            }
          }
        }
      }
    })();

    const saved = getArticleBySlugOrNumber(articleNumber, true);
    return { success: true, article: saved || undefined };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export function deleteArticle(articleId: string): boolean {
  const result = sqlite.prepare('DELETE FROM articles WHERE id = ?').run(articleId);
  return result.changes > 0;
}

// 4. Enquiries
export function createEnquiry(data: {
  article_number: string;
  model_name?: string;
  customer_name: string;
  phone: string;
  email?: string;
  selected_colour?: string;
  message?: string;
  article_id?: string;
}): { success: boolean; enquiryId?: string; error?: string } {
  if (!data.article_number || !data.customer_name || !data.phone) {
    return { success: false, error: 'Article Number, Customer Name, and Phone number are required.' };
  }

  const id = `enq-${crypto.randomUUID().slice(0, 8)}`;
  try {
    sqlite.prepare(`
      INSERT INTO enquiries (id, article_id, article_number, model_name, customer_name, phone, email, selected_colour, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')
    `).run(
      id,
      data.article_id || null,
      data.article_number.trim(),
      data.model_name?.trim() || null,
      data.customer_name.trim(),
      data.phone.trim(),
      data.email?.trim() || null,
      data.selected_colour?.trim() || null,
      data.message?.trim() || null
    );
    return { success: true, enquiryId: id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export function getEnquiries(): Enquiry[] {
  const rows = sqlite.prepare(`
    SELECT * FROM enquiries ORDER BY created_at DESC
  `).all() as any[];
  return rows as Enquiry[];
}

export function updateEnquiryStatus(id: string, status: string, notes?: string): boolean {
  const stmt = sqlite.prepare(`
    UPDATE enquiries SET status = ?, admin_notes = COALESCE(?, admin_notes) WHERE id = ?
  `);
  const res = stmt.run(status, notes || null, id);
  return res.changes > 0;
}

// 5. Site Settings
export function getSiteSettings(): SiteSettings {
  const rows = sqlite.prepare('SELECT key, value FROM site_settings').all() as { key: string; value: string }[];
  const map: Record<string, string> = {};
  for (const r of rows) {
    map[r.key] = r.value;
  }
  return {
    whatsapp_number: map.whatsapp_number || '+919847000000',
    contact_phone: map.contact_phone || '+91 9847 000 000',
    contact_email: map.contact_email || 'enquiry@efby.in',
    address: map.address || 'EFBY Works, Kottarakkara, Kerala, India',
    footer_bio: map.footer_bio || 'Established premium bag maker engineered for enduring elegance and functional mastery. From luxury handcrafted leather goods to heavy-duty ergonomic school carry.',
    global_price_display: map.global_price_display === '1',
    hero_title: map.hero_title || 'Architectural Elegance in Everyday Carry',
    hero_subtitle: map.hero_subtitle || 'Discover premium bag collections tailored with uncompromising craftsmanship and refined luxury aesthetics.',
  };
}

export function updateSiteSettings(settings: Partial<SiteSettings>): boolean {
  const stmt = sqlite.prepare(`
    INSERT INTO site_settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')
  `);
  
  sqlite.transaction(() => {
    if (settings.whatsapp_number !== undefined) stmt.run('whatsapp_number', settings.whatsapp_number);
    if (settings.contact_phone !== undefined) stmt.run('contact_phone', settings.contact_phone);
    if (settings.contact_email !== undefined) stmt.run('contact_email', settings.contact_email);
    if (settings.address !== undefined) stmt.run('address', settings.address);
    if (settings.footer_bio !== undefined) stmt.run('footer_bio', settings.footer_bio);
    if (settings.global_price_display !== undefined) stmt.run('global_price_display', settings.global_price_display ? '1' : '0');
  })();
  return true;
}

// 6. Collections Mutation
export function saveCollection(data: any): { success: boolean; collection?: Collection; error?: string } {
  if (!data.name || !data.slug) {
    return { success: false, error: 'Collection Name and Slug are required.' };
  }

  const isNew = !data.id;
  const id = data.id || `col-${data.slug}`;

  try {
    if (isNew) {
      sqlite.prepare(`
        INSERT INTO collections (id, slug, name, description, cover_image, display_order, is_hidden, is_featured)
        VALUES (@id, @slug, @name, @description, @cover_image, @display_order, @is_hidden, @is_featured)
      `).run({
        id,
        slug: data.slug.toLowerCase().trim(),
        name: data.name.trim(),
        description: data.description?.trim() || null,
        cover_image: data.cover_image || null,
        display_order: parseInt(data.display_order || '0', 10),
        is_hidden: data.is_hidden ? 1 : 0,
        is_featured: data.is_featured ? 1 : 0,
      });
    } else {
      sqlite.prepare(`
        UPDATE collections SET
          name = @name,
          slug = @slug,
          description = @description,
          cover_image = @cover_image,
          display_order = @display_order,
          is_hidden = @is_hidden,
          is_featured = @is_featured,
          updated_at = datetime('now')
        WHERE id = @id
      `).run({
        id,
        slug: data.slug.toLowerCase().trim(),
        name: data.name.trim(),
        description: data.description?.trim() || null,
        cover_image: data.cover_image || null,
        display_order: parseInt(data.display_order || '0', 10),
        is_hidden: data.is_hidden ? 1 : 0,
        is_featured: data.is_featured ? 1 : 0,
      });
    }
    const c = getCollectionBySlug(data.slug);
    return { success: true, collection: c || undefined };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export function deleteCollection(id: string): boolean {
  const res = sqlite.prepare('DELETE FROM collections WHERE id = ?').run(id);
  return res.changes > 0;
}
