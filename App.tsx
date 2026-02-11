
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BMCBot } from './services/geminiService';
import { Message, Attachment, TechnicalData, Product } from './types';
import { INSTITUTIONAL_INFO, PRODUCT_CATALOG } from './constants';

const TechnicalDataCard: React.FC<{ data: TechnicalData }> = ({ data }) => {
  const percentageUsed = Math.min((data.luz_m / (data.max_m || 1)) * 100, 100);
  const isCritical = data.luz_m > data.max_m;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm my-3 animate-in fade-in zoom-in duration-300 ring-1 ring-slate-100">
      <div className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white ${isCritical ? 'bg-red-600' : 'bg-blue-900'}`}>
        {data.type === 'quote' ? 'Cotización Técnica v6.0' : 'Validación Estructural'}
      </div>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-tight mb-1">Producto / SKU</h4>
            <p className="text-sm font-semibold text-slate-800">{data.product}</p>
            <p className="text-[10px] font-mono text-slate-500">{data.sku}</p>
          </div>
          <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${isCritical ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {data.status}
          </span>
        </div>

        {data.energy_savings && (
          <div className="p-3 bg-green-50 border border-green-100 rounded-xl">
            <h5 className="text-[10px] font-black text-green-700 uppercase mb-1 flex items-center gap-1">
              <span>🌱 Potencial de Ahorro</span>
            </h5>
            <p className="text-[11px] text-green-800">
              Pasar de {data.energy_savings.thickness_a}mm a {data.energy_savings.thickness_b}mm mejora el aislamiento en un <strong>{data.energy_savings.savings_pct}</strong>.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-500">Luz: {data.luz_m}m</span>
            <span className="text-slate-800 font-bold">Límite: {data.max_m}m</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${isCritical ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${percentageUsed}%` }}
            />
          </div>
        </div>

        {data.bom && data.bom.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase">Desglose de Accesorios</h4>
            <div className="bg-slate-50 rounded-lg border border-slate-100 divide-y divide-slate-100">
              {data.bom.map((item, idx) => (
                <div key={idx} className="p-2 flex justify-between items-center text-[11px]">
                  <span className="text-slate-600">{item.quantity} {item.unit} x {item.name}</span>
                  <span className="font-bold text-slate-800">USD {item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.type === 'quote' && (
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Total (IVA inc.)</span>
              <span className="text-xl font-black text-blue-900">USD {data.total_usd}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Paneles</span>
              <span className="text-sm font-bold text-slate-700">{data.panels} un.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductDetailModal: React.FC<{ product: Product; onClose: () => void; onAsk: (id: string) => void }> = ({ product, onClose, onAsk }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">
        <div className="relative h-48 bg-slate-800 overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 font-black uppercase text-2xl opacity-20">BMC URUGUAY</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex items-end p-6">
            <div className="text-white">
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-xs text-slate-300 font-mono uppercase tracking-widest">{product.sku}</p>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded text-[9px] font-black uppercase border ${product.ignifugo.includes('Excelente') ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
              🔥 {product.ignifugo}
            </span>
            {product.resistencia_termica && (
              <span className="px-2 py-1 rounded text-[9px] font-black uppercase border bg-blue-50 border-blue-200 text-blue-700">
                ❄️ R-Value: {product.resistencia_termica}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Descripción</span>
            <p className="text-sm text-slate-600 leading-relaxed">{product.description || "Solución técnica de alta eficiencia para construcción seca."}</p>
          </div>

          <button 
            onClick={() => onAsk(product.id)}
            className="w-full py-4 bg-blue-900 text-white rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
          >
            Cotizar este producto
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: '¡Hola! Soy Panelin v6.0. He vinculado el repositorio matiasportugau-ui/GPT-PANELIN-V3.2 para brindarte soporte técnico avanzado y contexto sobre mi desarrollo. ¿En qué puedo ayudarte?',
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [isGitHubLinked, setIsGitHubLinked] = useState(true);
  
  const bot = useMemo(() => new BMCBot(), []);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() && !attachment) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      attachment: attachment || undefined,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setAttachment(null);
    setIsTyping(true);

    try {
      const response = await bot.sendMessage(userMessage.text, userMessage.attachment, { isGitHubLinked });
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        technicalData: response.technicalData,
        groundingUrls: response.groundingUrls,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'Hubo un error al procesar tu solicitud.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment({
          name: file.name,
          mimeType: file.type || 'image/jpeg',
          data: (reader.result as string).split(',')[1]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar de Integraciones */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col border-r border-slate-800 shadow-xl hidden md:flex">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-black">BMC</div>
          <div>
            <h2 className="font-bold text-sm">Control Panel</h2>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest">Enterprise v6.0</p>
          </div>
        </div>

        <div className="p-6 space-y-8 flex-1">
          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Integraciones</h3>
            <button 
              onClick={() => setIsGitHubLinked(!isGitHubLinked)}
              className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${isGitHubLinked ? 'bg-green-600/20 border border-green-500/50 text-green-400' : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-750'}`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              <div className="text-left">
                <p className="text-xs font-bold leading-none">{isGitHubLinked ? 'Vínculo Activo' : 'Vincular GitHub'}</p>
                <p className="text-[9px] opacity-60 font-mono">{isGitHubLinked ? 'matiasportugau-ui/GPT-PANELIN-V3.2' : 'Sync documentación'}</p>
              </div>
            </button>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Configuración</h3>
            <div className="space-y-2">
               <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl text-[11px]">
                  <span>Modo Pensante</span>
                  <div className="w-8 h-4 bg-blue-600 rounded-full flex items-center justify-end px-1"><div className="w-2.5 h-2.5 bg-white rounded-full"></div></div>
               </div>
               <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl text-[11px]">
                  <span>Voz en Vivo</span>
                  <div className="w-8 h-4 bg-slate-700 rounded-full flex items-center justify-start px-1"><div className="w-2.5 h-2.5 bg-white rounded-full"></div></div>
               </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-950/50">
          <p className="text-[9px] text-slate-500 text-center font-bold">BMC URUGUAY — 2026</p>
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
             <div className="md:hidden w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center text-white text-sm font-black">B</div>
             <h1 className="text-sm font-black text-slate-800">Panelin Intelligence <span className="text-blue-600 font-mono">v6.0</span></h1>
          </div>
          {isGitHubLinked && (
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-bold text-green-700 uppercase">matiasportugau-ui Synced</span>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 max-w-5xl mx-auto w-full custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[90%] md:max-w-[75%] ${msg.role === 'user' ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-white border border-slate-200 shadow-slate-200/50'} rounded-3xl p-6 shadow-xl`}>
                {msg.attachment && (
                  <div className="mb-4 rounded-2xl overflow-hidden border border-white/10 shadow-inner">
                    <img src={`data:${msg.attachment.mimeType};base64,${msg.attachment.data}`} alt="Adjunto" className="max-h-64 w-full object-cover" />
                  </div>
                )}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>
                
                {msg.technicalData && <TechnicalDataCard data={msg.technicalData} />}

                {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Fuentes externas & GitHub</p>
                    <div className="flex flex-wrap gap-2">
                      {msg.groundingUrls.map((url, idx) => (
                        <a key={idx} href={url.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-all flex items-center gap-2">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                          {url.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-full px-6 py-3 shadow-sm flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Procesando...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200 p-6 z-20">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3 items-end">
            <div className="flex-1 relative bg-slate-100 rounded-3xl border border-slate-200 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Pregunta sobre luz, materiales o reportes..."
                rows={1}
                className="w-full bg-transparent border-none focus:ring-0 p-4 px-6 text-sm resize-none min-h-[56px] flex items-center"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <div className="absolute right-3 bottom-3 flex gap-2">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,application/pdf" />
              </div>
            </div>
            <button 
              type="submit"
              disabled={(!inputText.trim() && !attachment) || isTyping}
              className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 disabled:bg-slate-300 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
          </form>
        </footer>
      </div>

      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAsk={() => { handleSendMessage(); setSelectedProduct(null); }} />}
    </div>
  );
};

export default App;
