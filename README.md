<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# BMC Panelin Intelligence v6.0

AI-powered thermal panel consultation and quotation system for BMC Uruguay.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg)](https://vitejs.dev/)
[![Gemini AI](https://img.shields.io/badge/Gemini-3.0-orange.svg)](https://ai.google.dev/)

View your app in AI Studio: https://ai.studio/apps/drive/157Mh2NThGXvMMkxcIt3BXx0Cyl6Th42S

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/matiasportugau-ui/aistudioPAnelin.git
   cd aistudioPAnelin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

---

## 📚 Documentation

Comprehensive documentation is available to understand the system and guide enhancements:

### Strategic Planning
- **[ANALYSIS_SUMMARY.md](ANALYSIS_SUMMARY.md)** - Executive summary and key findings
- **[MERGE_STRATEGY.md](MERGE_STRATEGY.md)** - Complete strategic plan with 4-phase roadmap (8 weeks)
- **[IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)** - Detailed task list with estimates and acceptance criteria

### Technical Documentation  
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Complete system architecture and design patterns
- **API Documentation** - (Coming soon) Detailed API reference for all services

### User Documentation
- **User Guide** - (Coming soon) How to use the application effectively

---

## 🎯 Key Features

### Current Capabilities (v6.0)

- **🤖 AI-Powered Consultation:** Conversational interface using Google Gemini 3 Pro
- **📊 Quote Calculator:** Precise cost estimates with Bill of Materials (BOM)
- **🏗️ Structural Validation:** Automatic autoportancia (span) safety checks
- **⚡ Energy Efficiency Analysis:** Compare thermal resistance and savings
- **📦 Product Catalog:** 6+ thermal panel types (ISODEC, ISOROOF, ISOPANEL, ISOFRIG)
- **💰 Multi-Tier Pricing:** Online and factory pricing options
- **📎 Multimodal Input:** Text, images, PDFs, and audio support
- **🔍 Google Search Integration:** Grounded responses with citations
- **🎙️ Audio Features:** Transcription, TTS, and Live conversation mode

### Coming Soon (Roadmap)

- **💾 Data Persistence:** Save conversations and quotes
- **📄 PDF Export:** Professional quote documents
- **📈 Analytics Dashboard:** Usage insights and trends
- **🌍 Multi-language:** Spanish, English, Portuguese
- **👥 User Authentication:** Multi-user support
- **📱 Mobile Optimization:** Enhanced mobile experience
- **🔐 Enhanced Security:** Audited and hardened

---

## 🏗️ Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + TypeScript | UI framework with type safety |
| **Build Tool** | Vite 6 | Fast development and bundling |
| **AI Engine** | Google Gemini 3 Pro | Advanced AI processing |
| **Styling** | Tailwind CSS | Utility-first styling |
| **Deployment** | AI Studio | Cloud hosting |

### System Overview

```
┌─────────────────────────────────────────┐
│         React Frontend (TypeScript)      │
│  ┌────────────┐    ┌─────────────────┐ │
│  │    UI      │    │  State Mgmt     │ │
│  └────────────┘    └─────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │      Service Layer (gemini)        │ │
│  └────────────────────────────────────┘ │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│       Google Gemini API + Search        │
└─────────────────────────────────────────┘
```

For detailed architecture information, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 📋 Project Structure

```
aistudioPAnelin/
├── App.tsx                 # Main React component
├── index.tsx              # Application entry point
├── constants.ts           # Product catalog & system prompts
├── types.ts               # TypeScript type definitions
├── services/
│   └── geminiService.ts   # AI integration & business logic
├── vite.config.ts         # Build configuration
├── package.json           # Dependencies
└── docs/
    ├── ANALYSIS_SUMMARY.md
    ├── MERGE_STRATEGY.md
    ├── IMPLEMENTATION_ROADMAP.md
    └── ARCHITECTURE.md
```

---

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (coming soon)
npm run lint

# Format code (coming soon)
npm run format

# Run tests (coming soon)
npm test
```

### Code Quality (Planned)

The project will implement:
- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks
- Vitest for unit testing
- GitHub Actions for CI/CD

See [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) for details.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Review the [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system
2. Check [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) for planned features
3. Fork the repository
4. Create a feature branch (`git checkout -b feature/amazing-feature`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📞 Support & Contact

**BMC Uruguay**
- **Phone:** 092 663 245
- **Email:** info@bmcuruguay.com.uy
- **Website:** www.bmcuruguay.com.uy
- **Location:** Montevideo, Uruguay

---

## 📄 License

This project is proprietary software owned by BMC Uruguay.

---

## 🙏 Acknowledgments

- **Google Gemini AI** - Advanced AI capabilities
- **BMC Uruguay Team** - Product expertise and domain knowledge
- **React Community** - Excellent framework and ecosystem

---

## 📊 Project Status

**Current Version:** v6.0 (Panelin Intelligence)  
**Status:** Production - Active Development  
**Last Updated:** February 11, 2026

### Roadmap Status

- ✅ **Phase 0:** Initial implementation (Complete)
- 📋 **Phase 1:** Foundation & Documentation (Planned - 2 weeks)
- 📋 **Phase 2:** Feature Enhancements (Planned - 2 weeks)
- 📋 **Phase 3:** Advanced Features (Planned - 2 weeks)
- 📋 **Phase 4:** Production Readiness (Planned - 2 weeks)

See [MERGE_STRATEGY.md](MERGE_STRATEGY.md) for complete roadmap.

---

**Made with ❤️ by BMC Uruguay**
