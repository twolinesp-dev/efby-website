export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  display_order: number;
  is_hidden: boolean;
  is_featured: boolean;
  article_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ArticleColour {
  id?: string;
  article_id?: string;
  name: string;
  hex_code: string; // Primary colour hex
  secondary_hex?: string | null; // Secondary / accent colour hex
  display_order?: number;
  is_available?: boolean;
  image_url?: string | null;
}

export interface ArticleImage {
  id?: string;
  article_id?: string;
  image_url: string;
  caption?: string | null;
  display_order?: number;
  colour_name?: string | null;
  is_primary?: boolean;
}

export interface Article {
  id: string;
  article_number: string; // Business identifier, e.g. "EF-HB-001"
  model_name: string | null;
  slug: string;
  primary_collection_id: string | null;
  collection_name?: string | null;
  collection_slug?: string | null;
  short_description: string | null;
  full_description: string | null;
  main_image: string;
  publication_status: 'draft' | 'published' | 'archived';
  trending: boolean;
  new_arrival: boolean;
  launch_date: string | null;
  featured: boolean;
  display_price: boolean;
  price: number | null;
  sale_price: number | null;
  availability: string; // 'In Stock', 'Available on Order', 'Limited Batch', 'Out of Stock'
  materials: string | null;
  dimensions: string | null;
  capacity: string | null;
  weight: string | null;
  compartments: string | null;
  features: string | null;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  images?: ArticleImage[];
  colours?: ArticleColour[];
  collections?: { id: string; name: string; slug: string }[];
}

export interface Enquiry {
  id: string;
  article_id: string | null;
  article_number: string;
  model_name: string | null;
  customer_name: string;
  phone: string;
  email: string | null;
  selected_colour: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'in_discussion' | 'resolved' | 'archived';
  admin_notes: string | null;
  created_at: string;
}

export interface SiteSettings {
  whatsapp_number: string;
  contact_phone: string;
  contact_email: string;
  address: string;
  footer_bio: string;
  global_price_display: boolean;
  hero_title: string;
  hero_subtitle: string;
}
