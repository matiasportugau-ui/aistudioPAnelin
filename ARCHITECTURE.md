# aistudioPAnelin Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Component Structure](#component-structure)
4. [Data Flow](#data-flow)
5. [AI Integration](#ai-integration)
6. [State Management](#state-management)
7. [Type System](#type-system)
8. [Service Layer](#service-layer)

---

## 1. Overview

aistudioPAnelin is a sophisticated AI-powered assistant built for BMC Uruguay, specializing in thermal panel consultation, quotation, and technical validation. The application leverages Google's Gemini AI to provide intelligent, context-aware responses while maintaining precise calculation capabilities.

### Key Characteristics

- **Single-Page Application (SPA):** Built with React 19 and TypeScript
- **AI-First Design:** Conversational interface powered by Gemini 3 Pro
- **Domain-Specific:** Focused on BMC's thermal panel products
- **Calculation Engine:** Precise quote and structural validation
- **Multimodal:** Supports text, images, and audio

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌────────────────────────────────────────────────────────┐
│                    Client Layer                         │
│                  (Browser/React)                        │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   App.tsx    │  │ Components   │  │   Styles    │ │
│  │  (Main UI)   │  │  (Modular)   │  │  (Tailwind) │ │
│  └──────┬───────┘  └──────────────┘  └─────────────┘ │
│         │                                              │
│         ▼                                              │
│  ┌──────────────────────────────────────────────────┐ │
│  │            Service Layer                          │ │
│  ├──────────────────────────────────────────────────┤ │
│  │  geminiService.ts  │  Future: storage, quotes   │ │
│  └──────────────┬───────────────────────────────────┘ │
│                 │                                      │
└─────────────────┼──────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│              External Services                          │
├─────────────────────────────────────────────────────────┤
│  • Google Gemini API (AI Processing)                   │
│  • Google Search (Grounding)                            │
│  • Browser APIs (LocalStorage, Audio, File)            │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | React | 19.2.4 | UI rendering and state |
| **Language** | TypeScript | 5.8.2 | Type safety |
| **Build Tool** | Vite | 6.2.0 | Development and bundling |
| **AI SDK** | @google/genai | 1.40.0 | Gemini AI integration |
| **Styling** | Tailwind CSS | - | Utility-first CSS |
| **Runtime** | Browser ES2020+ | - | Modern JavaScript |

---

## 3. Component Structure

### 3.1 Current Component Hierarchy

```
App (Root Component)
│
├── Sidebar (Left Panel)
│   ├── GitHub Integration Badge
│   └── Integration Status
│
├── Main Content Area
│   ├── Header
│   │   └── Logo & Title
│   │
│   ├── Product Grid (Initial View)
│   │   └── ProductCard (×6)
│   │       ├── Product Image
│   │       ├── Specifications
│   │       ├── Pricing Tiers
│   │       └── CTA Button
│   │
│   └── Chat Interface (After Selection)
│       ├── Message List
│       │   ├── User Messages
│       │   │   └── Attachment (optional)
│       │   │
│       │   └── AI Messages
│       │       ├── Text Response
│       │       ├── TechnicalDataCard (optional)
│       │       │   ├── Quote Details
│       │       │   ├── Structural Validation
│       │       │   ├── BOM Table
│       │       │   └── Safety Indicator
│       │       │
│       │       └── Grounding URLs (optional)
│       │
│       └── Input Area
│           ├── Text Input
│           ├── File Upload Button
│           └── Send Button
```

### 3.2 Component Descriptions

#### **App.tsx** (Main Container)
- **Responsibility:** Root component managing global state and routing
- **State Management:** 
  - `messages`: Conversation history
  - `selectedProduct`: Currently active product
  - `attachment`: Uploaded file data
  - `isTyping`: AI processing indicator
  - `isGitHubLinked`: Integration status
- **Key Features:**
  - Product selection flow
  - Chat message handling
  - File upload management
  - AI response streaming

#### **ProductCard** (Inline Component)
- **Responsibility:** Display product information and initiate consultation
- **Props:** `product`, `onAsk`
- **Features:**
  - Tiered pricing display (Online/Factory)
  - Technical specifications
  - R-Value badges for thermal products
  - Interactive CTA

#### **TechnicalDataCard** (Inline Component)
- **Responsibility:** Visualize quote and validation results
- **Props:** `data` (TechnicalData)
- **Features:**
  - Visual progress bars for safety margins
  - BOM table rendering
  - Energy savings comparison
  - Status indicators (Safe/Critical)
  - Collapsible sections

---

## 4. Data Flow

### 4.1 User Interaction Flow

```
┌──────────────┐
│ User Action  │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│ Product Selection or Query   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ App State Update             │
│ - Add user message           │
│ - Set isTyping = true        │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ geminiService.sendMessage()  │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Gemini API Processing        │
│ - Analyze intent             │
│ - Function calling (if calc) │
│ - Generate response          │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Function Execution (Local)   │
│ - executeCalculateQuote()    │
│ - executeCheckAutoportancia()│
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Response Formatting          │
│ - Extract technical data     │
│ - Format grounding URLs      │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ UI Update                    │
│ - Add AI message             │
│ - Render technical card      │
│ - Set isTyping = false       │
└──────────────────────────────┘
```

### 4.2 Quote Calculation Flow

```
User Request
    ↓
"Cotizar [producto] 10m x 8m"
    ↓
Gemini Analysis
    ↓
Function Call: calculateQuote
    ↓
Parameters Extracted:
- product_id: "ISODEC_EPS_100"
- length_m: 10
- width_m: 8
- quantity: 1
- price_tier: "online"
    ↓
Local Execution:
1. Find product in catalog
2. Calculate panels needed
3. Validate autoportancia
4. Generate BOM (accessories)
5. Calculate totals with IVA
    ↓
Return Result to Gemini
    ↓
Gemini Formats Response
    ↓
Display to User:
- Conversational summary
- TechnicalDataCard with visuals
```

---

## 5. AI Integration

### 5.1 Gemini Configuration

**Model:** `gemini-3-pro-preview`

**Capabilities Used:**
1. **Function Calling:** Execute local calculations
2. **Google Search:** Ground responses with citations
3. **Multimodal Input:** Text, images, PDFs
4. **Audio Processing:** Transcription and TTS
5. **Live Mode:** Real-time audio conversation

### 5.2 System Instructions

Located in `constants.ts`, the system prompt defines:
- **Identity:** BMC Assistant v6.0 (Panelin Intelligence)
- **Expertise:** Consultative sales of isopaneles
- **Constraints:** 
  - BMC doesn't manufacture (only sells)
  - Never refer to external competitors
  - Always validate structural safety
- **Context:** References GPT-PANELIN-V3.2 knowledge base

### 5.3 Function Declarations

#### **calculateQuote**
```typescript
{
  name: 'calculateQuote',
  parameters: {
    product_id: string,      // Required
    length_m: number,        // Required
    width_m: number,         // Required
    quantity?: number,       // Default: 1
    discount_pct?: number,   // Default: 0
    luz_m?: number,          // For validation
    include_bom?: boolean,   // Default: true
    price_tier?: 'online' | 'factory',
    structure_type?: 'metal' | 'hormigon' | 'madera'
  }
}
```

**Execution Logic:**
1. Lookup product in `PRODUCT_CATALOG`
2. Calculate area: `length_m × (ancho_util × panels_needed)`
3. Calculate price: `area × price_m2 × quantity`
4. Validate span: `luz_m <= autoportancia_max`
5. Generate BOM based on `sistema_fijacion` and `structure_type`
6. Apply discounts and add IVA

#### **checkAutoportancia**
```typescript
{
  name: 'checkAutoportancia',
  parameters: {
    product_id: string,
    luz_m: number
  }
}
```

**Execution Logic:**
1. Lookup product
2. Compare `luz_m` vs `autoportancia_max`
3. Find alternative products with higher span capacity
4. Calculate energy efficiency improvements
5. Return recommendation

### 5.4 Conversation History Management

```typescript
private history: any[] = [];

// On user message:
this.history.push({ role: 'user', parts: [{ text }] });

// On function call:
this.history.push(modelContent); // Contains function call
this.history.push({ role: 'user', parts: functionResponses });

// On final response:
this.history.push({ role: 'model', parts: [{ text: finalText }] });
```

**Benefit:** Maintains context across conversation for follow-up questions.

---

## 6. State Management

### 6.1 Current Approach: React Hooks

**State Variables (in App.tsx):**

```typescript
// Message history
const [messages, setMessages] = useState<Message[]>([...]);

// User input
const [inputText, setInputText] = useState('');

// AI processing indicator
const [isTyping, setIsTyping] = useState(false);

// Product context
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

// File upload
const [attachment, setAttachment] = useState<Attachment | null>(null);

// GitHub integration status
const [isGitHubLinked, setIsGitHubLinked] = useState(true);
```

**Refs:**
```typescript
// Auto-scroll to latest message
const messagesEndRef = useRef<HTMLDivElement>(null);

// File input control
const fileInputRef = useRef<HTMLInputElement>(null);
```

**Memoized Values:**
```typescript
// Singleton bot instance
const bot = useMemo(() => new BMCBot(), []);
```

### 6.2 Future State Management Options

As complexity grows, consider:

**Option A: React Context API**
```typescript
// contexts/AppContext.tsx
export const AppContext = createContext<AppContextValue>({...});
export const useAppContext = () => useContext(AppContext);

// Benefits: Native, lightweight, good for global state
```

**Option B: Zustand**
```typescript
// stores/appStore.ts
export const useAppStore = create<AppStore>((set) => ({
  messages: [],
  addMessage: (msg) => set(state => ({ 
    messages: [...state.messages, msg] 
  })),
}));

// Benefits: Simple API, good performance, dev tools
```

**Option C: Redux Toolkit**
```typescript
// store/slices/appSlice.ts
export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {...},
});

// Benefits: Predictable, time-travel debugging, large ecosystem
```

**Recommendation:** Zustand for balance of simplicity and scalability.

---

## 7. Type System

### 7.1 Core Types (types.ts)

#### **Product**
Represents a thermal panel product in the catalog.

```typescript
interface Product {
  // Identification
  id: string;                  // Unique identifier
  sku: string;                 // Stock keeping unit
  name: string;                // Display name
  
  // Classification
  family: string;              // Product line (ISODEC, ISOROOF)
  subFamily: string;           // Material type (EPS, PIR)
  type: ProductType;           // Application category
  
  // Technical specs
  thickness_mm: number;        // Panel thickness
  ancho_util: number;          // Effective width (m)
  autoportancia_max: number;   // Max span (m)
  largo_min: number;           // Min length (m)
  largo_max: number;           // Max length (m)
  
  // Thermal properties
  resistencia_termica?: number;    // R-value
  coeficiente_termico?: number;    // U-value
  ignifugo: string;                // Fire rating
  
  // Pricing
  price_online_m2: number;     // Online price per m²
  price_factory_m2: number;    // Factory price per m²
  
  // Installation
  sistema_fijacion?: string;   // Mounting system
  
  // Metadata
  supplier: string;
  description?: string;
  imageUrl?: string;
  productUrl?: string;
}
```

#### **Message**
Represents a conversation message with optional rich content.

```typescript
interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  
  // Optional enrichments
  attachment?: Attachment;
  technicalData?: TechnicalData;
  groundingUrls?: GroundingUrl[];
}
```

#### **TechnicalData**
Structured data for quotes and validations.

```typescript
interface TechnicalData {
  type: 'validation' | 'quote';
  
  // Product info
  product: string;
  sku: string;
  
  // Structural data
  luz_m: number;
  max_m: number;
  is_safe: boolean;
  status: string;
  
  // Quote-specific
  total_usd?: string;
  panels?: number;
  bom?: BOMItem[];
  price_tier?: 'online' | 'factory';
  
  // Validation-specific
  recomendacion?: string;
  energy_savings?: EnergyComparison;
}
```

### 7.2 Type Safety Benefits

1. **Compile-Time Errors:** Catch mistakes before runtime
2. **IntelliSense:** Auto-completion in IDEs
3. **Refactoring Safety:** Rename/restructure with confidence
4. **Documentation:** Types serve as living documentation
5. **Runtime Validation:** Can be paired with zod/yup for runtime checks

---

## 8. Service Layer

### 8.1 geminiService.ts

#### **BMCBot Class**

**Purpose:** Encapsulate all AI interactions and calculations.

**Architecture:**
```typescript
class BMCBot {
  private history: any[];         // Conversation context
  private ai: GoogleGenAI;        // Gemini client
  
  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  
  // Main methods
  async sendMessage(text, attachment?, options?): Promise<Response>
  async transcribeAudio(audioBase64): Promise<string>
  async generateSpeech(text): Promise<string>
  connectLive(callbacks): LiveSession
  
  // Private calculation methods
  private executeCalculateQuote(args): QuoteResult
  private executeCheckAutoportancia(args): ValidationResult
}
```

**Key Design Decisions:**

1. **Singleton Pattern:** One bot instance per user session (via useMemo)
2. **Stateful History:** Maintains conversation context automatically
3. **Function Execution:** Local calculations for speed and reliability
4. **Error Handling:** Graceful degradation with fallback responses

#### **Function Execution Loop**

```typescript
// Initial AI call
let response = await this.ai.models.generateContent({...});

// Handle function calls iteratively
while (response.candidates?.[0]?.content?.parts?.some(p => p.functionCall)) {
  const functionCalls = extractFunctionCalls(response);
  
  // Execute each function locally
  const results = functionCalls.map(fc => {
    if (fc.name === 'calculateQuote') return this.executeCalculateQuote(fc.args);
    if (fc.name === 'checkAutoportancia') return this.executeCheckAutoportancia(fc.args);
  });
  
  // Send results back to AI
  this.history.push({ role: 'user', parts: results });
  
  // Get final natural language response
  response = await this.ai.models.generateContent({...});
}
```

**Why This Approach:**
- AI determines WHEN to calculate (intent detection)
- Local execution ensures ACCURACY (no AI hallucination in math)
- AI formats the RESPONSE (natural, context-aware)

### 8.2 Future Services

#### **storageService.ts**
```typescript
class StorageService {
  static saveConversation(messages: Message[]): void
  static loadConversation(): Message[]
  static clearConversation(): void
  static exportConversation(format: 'json' | 'txt'): Blob
}
```

#### **quoteService.ts**
```typescript
class QuoteService {
  static saveQuote(quote: TechnicalData): void
  static loadQuotes(): TechnicalData[]
  static deleteQuote(id: string): void
  static exportQuotePDF(quote: TechnicalData): Promise<Blob>
  static emailQuote(quote: TechnicalData, email: string): Promise<void>
}
```

#### **analyticsService.ts**
```typescript
class AnalyticsService {
  static trackEvent(event: string, data?: any): void
  static trackPageView(page: string): void
  static identifyUser(userId: string, traits?: any): void
}
```

---

## 9. Design Patterns

### 9.1 Patterns Used

| Pattern | Location | Purpose |
|---------|----------|---------|
| **Singleton** | BMCBot instance | One AI session per user |
| **Service Layer** | geminiService.ts | Separate business logic from UI |
| **Component Composition** | App.tsx | Build complex UI from simple parts |
| **Hooks Pattern** | React hooks | Reusable stateful logic |
| **Strategy Pattern** | BOM generation | Different logic per fixation system |
| **Factory Pattern** | Message creation | Consistent message objects |

### 9.2 Best Practices Applied

1. **Separation of Concerns:** UI, business logic, and data separated
2. **Single Responsibility:** Each function does one thing well
3. **DRY (Don't Repeat Yourself):** Shared types, reusable components
4. **Type Safety:** Comprehensive TypeScript coverage
5. **Error Boundaries:** Graceful error handling throughout
6. **Responsive Design:** Mobile-first with Tailwind utilities

---

## 10. Performance Considerations

### 10.1 Current Optimizations

1. **useMemo for Bot Instance:** Prevent recreation on re-renders
2. **Controlled Re-renders:** Minimal state updates
3. **Ref for DOM Access:** Avoid unnecessary renders for scroll
4. **Lazy Loading:** Vite code-splitting by default
5. **Efficient Calculations:** O(n) algorithms for BOM generation

### 10.2 Future Optimizations

1. **Virtual Scrolling:** For long message histories (react-window)
2. **Code Splitting:** Separate product catalog into chunks
3. **Memoized Components:** React.memo for heavy components
4. **Web Workers:** Offload calculations to background thread
5. **Service Worker:** Cache API responses and assets
6. **Image Optimization:** WebP format, lazy loading, CDN

---

## 11. Security Architecture

### 11.1 Current Security Measures

1. **Environment Variables:** API keys not in code
2. **No Eval/Injection:** Static function execution
3. **Input Validation:** Type checking on function parameters
4. **HTTPS Only:** Enforced by deployment platform
5. **No Sensitive Data Storage:** No user PII collected

### 11.2 Recommended Enhancements

1. **Content Security Policy (CSP):** Restrict resource loading
2. **Rate Limiting:** Prevent API abuse
3. **Input Sanitization:** DOMPurify for user content
4. **Authentication:** OAuth2/JWT when multi-user
5. **Audit Logging:** Track sensitive operations
6. **Dependency Scanning:** Regular npm audit runs

---

## 12. Scalability Roadmap

### Phase 1: Current (Single User)
- Client-side only
- No backend
- LocalStorage for simple persistence

### Phase 2: Multi-User (Backend)
```
Frontend ──► Backend API ──► Database
                  │
                  ├─► Gemini API
                  ├─► Email Service
                  └─► PDF Generator
```

### Phase 3: Distributed (Microservices)
```
Frontend ──► API Gateway
               │
               ├─► Auth Service
               ├─► Quote Service
               ├─► Product Service
               ├─► AI Service (Gemini)
               └─► Analytics Service
```

### Phase 4: Enterprise (Cloud-Native)
```
CDN ──► Load Balancer ──► Multiple Frontend Instances
                            │
                            ├─► Kubernetes Cluster
                            │     ├─► Microservices
                            │     ├─► Message Queue
                            │     └─► Cache Layer
                            │
                            └─► Database Cluster
                                  ├─► Primary
                                  └─► Replicas
```

---

## 13. Deployment Architecture

### Current: AI Studio Deployment

```
Developer ──► Git Push ──► AI Studio ──► Production
                              │
                              ├─► Build (Vite)
                              ├─► Deploy (Edge)
                              └─► Monitor
```

### Future: CI/CD Pipeline

```
Developer ──► Git Push ──► GitHub Actions
                              │
                              ├─► Lint & Test
                              ├─► Build
                              ├─► Security Scan
                              │
                              ├─► Deploy to Staging
                              │     └─► Integration Tests
                              │
                              └─► Deploy to Production
                                    ├─► Blue-Green Deployment
                                    └─► Health Check
```

---

## 14. Monitoring and Observability

### Future Implementation

**Metrics to Track:**
- Response times (AI, calculations)
- Error rates by category
- User engagement (messages/session)
- Quote completion rate
- Popular products
- API quota usage

**Tools:**
- Sentry for error tracking
- Google Analytics for user behavior
- Gemini API dashboard for usage
- Custom Grafana dashboards for business metrics

---

## 15. Conclusion

The aistudioPAnelin architecture is well-designed for its current scope, with clear separation of concerns and excellent type safety. The modular structure allows for incremental enhancement while maintaining stability. Key strengths include:

✅ **Modern Stack:** React 19, TypeScript 5.8, Vite 6  
✅ **AI-First:** Sophisticated Gemini integration  
✅ **Type Safety:** Comprehensive TypeScript coverage  
✅ **Clean Code:** Readable, maintainable, well-organized  
✅ **Scalable Foundation:** Ready for growth  

The architecture supports the proposed enhancements in MERGE_STRATEGY.md without requiring fundamental restructuring.

---

**Document Version:** 1.0  
**Last Updated:** February 11, 2026  
**Author:** BMC Uruguay Development Team
