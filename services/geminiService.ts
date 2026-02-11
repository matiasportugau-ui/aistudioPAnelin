
import { GoogleGenAI, Type, FunctionDeclaration, Modality, LiveServerMessage, Blob } from "@google/genai";
import { PRODUCT_CATALOG, ACCESSORIES_CATALOG, SYSTEM_INSTRUCTIONS } from "../constants";
import { QuoteParams, Attachment, TechnicalData, BOMItem, EnergyComparison } from "../types";

const calculateQuoteDeclaration: FunctionDeclaration = {
  name: 'calculateQuote',
  parameters: {
    type: Type.OBJECT,
    description: 'Calcula una cotización técnica unificada (v6.0) incluyendo validación estructural, despiece desglosado y eficiencia térmica.',
    properties: {
      product_id: { type: Type.STRING, description: 'ID del producto' },
      length_m: { type: Type.NUMBER, description: 'Largo del panel' },
      width_m: { type: Type.NUMBER, description: 'Ancho total a cubrir' },
      quantity: { type: Type.NUMBER, description: 'Cantidad de áreas' },
      discount_pct: { type: Type.NUMBER, description: 'Descuento adicional %' },
      luz_m: { type: Type.NUMBER, description: 'Luz entre apoyos' },
      include_bom: { type: Type.BOOLEAN, description: 'Incluir desglose de accesorios' },
      price_tier: { type: Type.STRING, enum: ['online', 'factory'] },
      structure_type: { type: Type.STRING, enum: ['metal', 'hormigon', 'madera'] }
    },
    required: ['product_id', 'length_m', 'width_m'],
  },
};

const checkAutoportanciaDeclaration: FunctionDeclaration = {
  name: 'checkAutoportancia',
  parameters: {
    type: Type.OBJECT,
    description: 'Valida autoportancia y sugiere mejoras de eficiencia energética.',
    properties: {
      product_id: { type: Type.STRING, description: 'ID del producto' },
      luz_m: { type: Type.NUMBER, description: 'Luz a validar' }
    },
    required: ['product_id', 'luz_m'],
  },
};

const tools = [
  { 
    functionDeclarations: [
      calculateQuoteDeclaration, 
      checkAutoportanciaDeclaration
    ] 
  },
  { googleSearch: {} }
];

export class BMCBot {
  private history: any[] = [];
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async sendMessage(text: string, attachment?: Attachment, options: { fast?: boolean; think?: boolean; isGitHubLinked?: boolean } = {}): Promise<{ text: string; technicalData?: TechnicalData; groundingUrls?: { title: string; uri: string }[] }> {
    const parts: any[] = [{ text }];
    let lastTechnicalResult: TechnicalData | undefined;
    
    if (attachment) {
      parts.push({
        inlineData: { mimeType: attachment.mimeType, data: attachment.data }
      });
    }

    const githubContext = options.isGitHubLinked 
      ? "\n[SISTEMA: El repositorio matiasportugau-ui/GPT-PANELIN-V3.2 está vinculado. Puedes acceder a su documentación técnica, código fuente y configuraciones mediante búsqueda o conocimiento interno para responder consultas sobre este proyecto.]" 
      : "";

    this.history.push({ role: 'user', parts });
    const modelName = 'gemini-3-pro-preview'; 
    const config: any = {
      systemInstruction: SYSTEM_INSTRUCTIONS + githubContext,
      tools: tools,
    };

    if (options.think) config.thinkingConfig = { thinkingBudget: 32768 };

    let response = await this.ai.models.generateContent({
      model: modelName,
      contents: this.history,
      config
    });

    while (response.candidates?.[0]?.content?.parts?.some(p => p.functionCall)) {
      const modelContent = response.candidates[0].content;
      this.history.push(modelContent);

      const functionResponses = [];
      for (const part of modelContent.parts) {
        if (part.functionCall) {
          const fc = part.functionCall;
          let result;
          
          if (fc.name === 'calculateQuote') {
            const rawResult = this.executeCalculateQuote(fc.args as any);
            result = rawResult;
            lastTechnicalResult = {
              type: 'quote',
              product: rawResult.product,
              sku: rawResult.sku,
              luz_m: rawResult.luz_validada,
              max_m: rawResult.autoportancia_max_admitida,
              is_safe: rawResult.is_safe,
              status: rawResult.span_status,
              total_usd: rawResult.total_usd,
              panels: rawResult.panels_needed,
              bom: rawResult.bom,
              price_tier: (fc.args as any).price_tier as any
            };
          } else if (fc.name === 'checkAutoportancia') {
            const rawResult = this.executeCheckAutoportancia(fc.args as any);
            result = rawResult;
            lastTechnicalResult = {
              type: 'validation',
              product: rawResult.product,
              sku: rawResult.sku,
              luz_m: rawResult.luz_solicitada,
              max_m: rawResult.autoportancia_max,
              is_safe: rawResult.es_seguro,
              status: rawResult.status,
              recomendacion: rawResult.recomendacion,
              energy_savings: rawResult.energy_savings
            };
          }

          functionResponses.push({
            functionResponse: {
              name: fc.name,
              id: fc.id,
              response: { result: result || { error: "Error de cálculo." } }
            }
          });
        }
      }

      if (functionResponses.length > 0) {
        this.history.push({ role: 'user', parts: functionResponses });
        response = await this.ai.models.generateContent({
          model: modelName,
          contents: this.history,
          config
        });
      } else {
        break;
      }
    }

    const finalModelText = response.text || "";
    this.history.push({ role: 'model', parts: [{ text: finalModelText }] });
    
    const groundingUrls = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Fuente',
      uri: chunk.web?.uri || '#'
    }));

    return { text: finalModelText, technicalData: lastTechnicalResult, groundingUrls };
  }

  async transcribeAudio(audioBase64: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [
          { inlineData: { data: audioBase64, mimeType: 'audio/wav' } },
          { text: "Transcripción para BMC Uruguay." }
        ]
      }]
    });
    return response.text || "";
  }

  async generateSpeech(text: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Ingeniero BMC: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
  }

  connectLive(callbacks: any) {
    return this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: SYSTEM_INSTRUCTIONS + "\nModo Live v6.0 activo.",
        outputAudioTranscription: {},
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } }
      }
    });
  }

  private executeCalculateQuote(args: QuoteParams & { luz_m?: number; include_bom?: boolean }) {
    const product = PRODUCT_CATALOG.find(p => p.id === args.product_id);
    if (!product) return { error: "Producto no encontrado." };

    const price_m2 = args.price_tier === 'factory' ? product.price_factory_m2 : product.price_online_m2;
    const panels = Math.ceil(args.width_m / product.ancho_util);
    const area = args.length_m * (product.ancho_util * panels);
    const subtotalPanels = area * price_m2 * (args.quantity || 1);
    
    const luz_to_validate = args.luz_m || args.length_m; 
    const is_safe = luz_to_validate <= product.autoportancia_max;
    const supports = Math.ceil((args.length_m / (product.autoportancia_max || 1)) + 1);

    const bom: BOMItem[] = [];
    let totalAccUsd = 0;

    if (args.include_bom !== false) {
      const points = Math.ceil(((panels * supports) * 2) + (args.length_m * 2 / 2.5));
      
      if (product.sistema_fijacion === 'varilla_tuerca') {
        const rodsQty = Math.ceil(points / 4);
        const rodsPrice = ACCESSORIES_CATALOG.find(a => a.sku === 'VAR38')?.price || 3.81;
        bom.push({ name: "Varilla Roscada 3/8\"", quantity: rodsQty, unit: "unid", unitPrice: rodsPrice, total: rodsQty * rodsPrice });
        totalAccUsd += rodsQty * rodsPrice;

        const nutsPerPoint = args.structure_type === 'hormigon' ? 1 : 2;
        const nutsQty = points * nutsPerPoint;
        const nutsPrice = ACCESSORIES_CATALOG.find(a => a.sku === 'TUE38')?.price || 0.15;
        bom.push({ name: "Tuerca 3/8\"", quantity: nutsQty, unit: "unid", unitPrice: nutsPrice, total: nutsQty * nutsPrice });
        totalAccUsd += nutsQty * nutsPrice;

        if (args.structure_type === 'hormigon') {
          const tacosQty = points;
          const tacosPrice = ACCESSORIES_CATALOG.find(a => a.sku === 'TAC38')?.price || 1.17;
          bom.push({ name: "Taco Expansivo 3/8\"", quantity: tacosQty, unit: "unid", unitPrice: tacosPrice, total: tacosQty * tacosPrice });
          totalAccUsd += tacosQty * tacosPrice;
        }

        const carroceroQty = points;
        const carroceroPrice = ACCESSORIES_CATALOG.find(a => a.sku === 'ARA_CARR')?.price || 2.05;
        bom.push({ name: "Arandela Carrocero 3/8\"", quantity: carroceroQty, unit: "unid", unitPrice: carroceroPrice, total: carroceroQty * carroceroPrice });
        totalAccUsd += carroceroQty * carroceroPrice;

        const tortugaQty = points;
        const tortugaPrice = ACCESSORIES_CATALOG.find(a => a.sku === 'TORTUGA')?.price || 1.55;
        bom.push({ name: "Tortuga PVC", quantity: tortugaQty, unit: "unid", unitPrice: tortugaPrice, total: tortugaQty * tortugaPrice });
        totalAccUsd += tortugaQty * tortugaPrice;
      } else if (product.sistema_fijacion === 'caballete_tornillo') {
        const caballeteQty = points;
        const caballetePrice = ACCESSORIES_CATALOG.find(a => a.sku === 'CABALLE')?.price || 9.20;
        bom.push({ name: "Caballete Isoroof", quantity: caballeteQty, unit: "unid", unitPrice: caballetePrice, total: caballeteQty * caballetePrice });
        totalAccUsd += caballeteQty * caballetePrice;
      }

      const siliconeQty = Math.ceil((args.length_m * 2 + args.width_m * 2) / 8);
      const siliconePrice = ACCESSORIES_CATALOG.find(a => a.sku === 'SIL_POMO')?.price || 11.58;
      bom.push({ name: "Silicona Pomo", quantity: siliconeQty, unit: "unid", unitPrice: siliconePrice, total: siliconeQty * siliconePrice });
      totalAccUsd += siliconeQty * siliconePrice;
    }

    const discount = (subtotalPanels + totalAccUsd) * ((args.discount_pct || 0) / 100);
    const finalTotal = (subtotalPanels + totalAccUsd) - discount;

    return {
      product: product.name,
      sku: product.sku,
      panels_needed: panels,
      total_area_m2: area.toFixed(2),
      total_usd: finalTotal.toFixed(2),
      autoportancia_max_admitida: product.autoportancia_max,
      luz_validada: luz_to_validate,
      is_safe,
      span_status: is_safe ? "VÁLIDO" : "CRÍTICO",
      bom,
      iva_included: true
    };
  }

  private executeCheckAutoportancia(args: { product_id: string, luz_m: number }) {
    const product = PRODUCT_CATALOG.find(p => p.id === args.product_id);
    if (!product) return { error: "Producto no encontrado." };

    const is_safe = args.luz_m <= product.autoportancia_max;
    
    let energy_savings: EnergyComparison | undefined;
    const betterOption = PRODUCT_CATALOG.find(p => p.family === product.family && p.thickness_mm > product.thickness_mm);
    if (betterOption && product.resistencia_termica && betterOption.resistencia_termica) {
      const pct = ((betterOption.resistencia_termica - product.resistencia_termica) / product.resistencia_termica) * 100;
      energy_savings = {
        thickness_a: product.thickness_mm,
        thickness_b: betterOption.thickness_mm,
        savings_pct: pct.toFixed(1) + "%",
        resistance_diff: (betterOption.resistencia_termica - product.resistencia_termica).toFixed(2)
      };
    }

    return {
      product: product.name,
      sku: product.sku,
      luz_solicitada: args.luz_m,
      autoportancia_max: product.autoportancia_max,
      es_seguro: is_safe,
      status: is_safe ? "Seguro" : "Rechazado",
      recomendacion: is_safe ? "Luz admisible." : "Reduzca la luz o use un panel de mayor espesor (ej: 150mm).",
      energy_savings
    };
  }
}

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

export function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) int16[i] = data[i] * 32768;
  return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
}
