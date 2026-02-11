
export interface Product {
  id: string;
  sku: string;
  name: string;
  family: string;
  subFamily: string;
  type: 'cubierta_pesada' | 'cubierta_liviana' | 'pared' | 'pared_frigorifica' | 'impermeabilizante' | 'accesorio';
  thickness_mm: number;
  price_online_m2: number;
  price_factory_m2: number;
  ancho_util: number;
  autoportancia_max: number;
  largo_min: number;
  largo_max: number;
  supplier: string;
  ignifugo: string;
  resistencia_termica?: number;
  coeficiente_termico?: number;
  imageUrl?: string;
  productUrl?: string;
  description?: string;
  sistema_fijacion?: string;
}

export interface Accessory {
  sku: string;
  name: string;
  unit: string;
  price: number;
  supplier: string;
  type: string;
}

export interface BOMItem {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface QuoteParams {
  product_id: string;
  length_m: number;
  width_m: number;
  quantity?: number;
  discount_pct?: number;
  price_tier?: 'online' | 'factory';
  structure_type?: 'metal' | 'hormigon' | 'madera';
}

export interface EnergyComparison {
  thickness_a: number;
  thickness_b: number;
  savings_pct: string;
  resistance_diff: string;
}

export interface TechnicalData {
  type: 'validation' | 'quote';
  product: string;
  sku: string;
  luz_m: number;
  max_m: number;
  is_safe: boolean;
  status: string;
  recomendacion?: string;
  total_usd?: string;
  panels?: number;
  bom?: BOMItem[];
  price_tier?: 'online' | 'factory';
  energy_savings?: EnergyComparison;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  attachment?: Attachment;
  technicalData?: TechnicalData;
  groundingUrls?: { title: string; uri: string }[];
}

export interface Attachment {
  name: string;
  mimeType: string;
  data: string; // base64
}
