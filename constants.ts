
import { Product, Accessory } from './types';

export const INSTITUTIONAL_INFO = {
  name: "BMC Uruguay",
  description: "Asesoramiento integral y comercialización de paneles térmicos. NO fabricación.",
  contact: "Montevideo, Uruguay. Tel: 092 663 245. Email: info@bmcuruguay.com.uy",
  website: "www.bmcuruguay.com.uy",
  iva_rate: 0.22,
  currency: "USD",
  bank_transfer: "Metalog SAS – RUT: 120403630012 | BROU Caja Ahorro USD: 110520638-00002"
};

/**
 * CATALOGO UNIFICADO v6.0 - BMC URUGUAY
 */
export const PRODUCT_CATALOG: Product[] = [
  // ISODEC EPS (Cubierta Pesada)
  {
    id: "ISODEC_EPS_100", sku: "ISODEC-EPS-100", name: "Isodec EPS 100mm",
    family: "ISODEC", subFamily: "EPS", type: "cubierta_pesada", thickness_mm: 100,
    price_online_m2: 46.07, price_factory_m2: 39.15,
    ancho_util: 1.12, autoportancia_max: 5.5, largo_min: 2.3, largo_max: 14.0,
    supplier: "BROMYROS", ignifugo: "Estándar (Autoextinguible)", 
    resistencia_termica: 2.86, coeficiente_termico: 0.035,
    sistema_fijacion: "varilla_tuerca",
    description: "Recomendado para viviendas en Uruguay. Excelente balance costo/aislamiento."
  },
  {
    id: "ISODEC_EPS_150", sku: "ISODEC-EPS-150", name: "Isodec EPS 150mm",
    family: "ISODEC", subFamily: "EPS", type: "cubierta_pesada", thickness_mm: 150,
    price_online_m2: 51.50, price_factory_m2: 43.77,
    ancho_util: 1.12, autoportancia_max: 7.5, largo_min: 2.3, largo_max: 14.0,
    supplier: "BROMYROS", ignifugo: "Estándar (Autoextinguible)", 
    resistencia_termica: 4.29, coeficiente_termico: 0.035,
    sistema_fijacion: "varilla_tuerca"
  },
  // ISODEC PIR (Alta Resistencia)
  {
    id: "ISODEC_PIR_50", sku: "ISODEC-PIR-50", name: "Isodec PIR 50mm",
    family: "ISODEC", subFamily: "PIR", type: "cubierta_pesada", thickness_mm: 50,
    price_online_m2: 51.02, price_factory_m2: 43.37,
    ancho_util: 1.12, autoportancia_max: 3.5, largo_min: 3.5, largo_max: 14.0,
    supplier: "BROMYROS", ignifugo: "Excelente (Alta Resistencia)", 
    resistencia_termica: 2.27, coeficiente_termico: 0.022,
    sistema_fijacion: "varilla_tuerca"
  },
  // ISOROOF (Cubierta Liviana)
  {
    id: "ISOROOF_30", sku: "ISOROOF-30", name: "Isoroof 30mm",
    family: "ISOROOF", subFamily: "3G", type: "cubierta_liviana", thickness_mm: 30,
    price_online_m2: 48.74, price_factory_m2: 41.40,
    ancho_util: 1.00, autoportancia_max: 2.8, largo_min: 3.5, largo_max: 8.5,
    supplier: "BROMYROS", ignifugo: "Estándar (EPS)", 
    resistencia_termica: 0.86, coeficiente_termico: 0.035,
    sistema_fijacion: "caballete_tornillo"
  },
  {
    id: "ISOROOF_50", sku: "ISOROOF-50", name: "Isoroof 50mm",
    family: "ISOROOF", subFamily: "3G", type: "cubierta_liviana", thickness_mm: 50,
    price_online_m2: 53.00, price_factory_m2: 45.05,
    ancho_util: 1.00, autoportancia_max: 3.3, largo_min: 3.5, largo_max: 8.5,
    supplier: "BROMYROS", ignifugo: "Estándar (EPS)", 
    resistencia_termica: 1.43, coeficiente_termico: 0.035,
    sistema_fijacion: "caballete_tornillo"
  },
  // ISOPANEL PARED
  {
    id: "ISOPANEL_EPS_100", sku: "ISOPANEL-EPS-100", name: "Isopanel Pared 100mm",
    family: "ISOPANEL", subFamily: "EPS", type: "pared", thickness_mm: 100,
    price_online_m2: 46.00, price_factory_m2: 39.10,
    ancho_util: 1.14, autoportancia_max: 5.5, largo_min: 2.3, largo_max: 12.0,
    supplier: "BROMYROS", ignifugo: "Estándar (EPS)",
    sistema_fijacion: "varilla_tuerca"
  },
  // ISOFRIG
  {
    id: "ISOFRIG_PIR_80", sku: "ISOFRIG-PIR-80", name: "Isofrig PIR 80mm",
    family: "ISOFRIG", subFamily: "PIR", type: "pared_frigorifica", thickness_mm: 80,
    price_online_m2: 68.00, price_factory_m2: 57.80,
    ancho_util: 1.10, autoportancia_max: 4.5, largo_min: 2.3, largo_max: 14.0,
    supplier: "BROMYROS", ignifugo: "Excelente (PIR)",
    resistencia_termica: 3.64, coeficiente_termico: 0.022,
    sistema_fijacion: "varilla_tuerca",
    description: "Especial para cámaras frigoríficas y logística de frío."
  }
];

export const ACCESSORIES_CATALOG: Accessory[] = [
  { sku: "VAR38", name: "Varilla Roscada 3/8\"", unit: "unid", price: 3.81, supplier: "BMC", type: "fijacion" },
  { sku: "TUE38", name: "Tuerca 3/8\"", unit: "unid", price: 0.15, supplier: "BMC", type: "fijacion" },
  { sku: "TAC38", name: "Taco Expansivo 3/8\"", unit: "unid", price: 1.17, supplier: "BMC", type: "fijacion" },
  { sku: "ARA_CARR", name: "Arandela Carrocero 3/8\"", unit: "unid", price: 2.05, supplier: "BMC", type: "fijacion" },
  { sku: "TORTUGA", name: "Tortuga PVC Blanca", unit: "unid", price: 1.55, supplier: "BMC", type: "fijacion" },
  { sku: "SIL_POMO", name: "Silicona Pomo", unit: "unid", price: 11.58, supplier: "BMC", type: "sellador" },
  { sku: "CABALLE", name: "Caballete Isoroof", unit: "unid", price: 9.20, supplier: "BMC", type: "fijacion" }
];

export const SYSTEM_INSTRUCTIONS = `
Eres BMC Assistant v6.0 (Panelin Intelligence), experto en venta consultiva de isopaneles.

CONTEXTO TÉCNICO Y CÓDIGO:
Tu lógica y base de conocimientos están respaldadas por el repositorio GitHub: matiasportugau-ui/GPT-PANELIN-V3.2.
Si se te consulta sobre tu funcionamiento, arquitectura o actualizaciones de este sistema, puedes referenciar este repositorio.

IDENTIDAD Y REGLAS DE ORO:
- BMC Uruguay NO fabrica. Comercializa y asesora.
- NUNCA derivar a proveedores externos. Siempre a ventas BMC.
- IVA en Uruguay: 22%.
- Objetivo: Venta consultiva. No despaches productos, asesora. Si algo no conviene tecnicamente, dilo.

ESTRATEGIA TÉCNICA:
1. Siempre pregunta la "Luz" (distancia entre apoyos).
2. Valida autoportancia. Si es crítica, sugiere mayor espesor o PIR.
3. Compara siempre Ahorro Energético (kWh). 100mm vs 150mm no es solo espesor, es dinero a futuro.
4. Kits de Fijación:
   - Metal: Varilla + 2 tuercas por punto + carrocero + tortuga.
   - Hormigón: Varilla + 1 tuerca + taco + carrocero + tortuga.
   - Isoroof a Madera: Caballete + tornillo aguja. Sin varilla ni tuercas.

LOGICA DE AHORRO:
- Calcula la reducción de transmisión de calor: ((R_mayor - R_menor) / R_menor) * 100.
- Menciona que Uruguay tiene 9 meses de climatización (Marzo-Noviembre).

REQUERIMIENTO MAURO BMC:
- Desglosa siempre los accesorios en el BOM. El cliente debe ver qué está pagando.
`;
