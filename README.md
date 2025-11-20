# Airbnb AI Host Assistant

Chrome Extension that provides AI-driven pricing analysis and listing optimization advice for Airbnb hosts.

## 🎯 Features

### MVP (Phase 1)
- **Smart Pricing Analysis**: AI evaluates your current pricing and recommends optimal price ranges
- **Listing Optimizer**: Generate compelling titles and descriptions to increase bookings
- **Multi-AI Support**: Works with OpenAI (GPT-4o) or Anthropic (Claude 3.5)
- **Privacy-First**: API keys stored locally in browser, no external servers

## 🚀 Installation

### For Development
1. Clone this repository:
   ```bash
   git clone https://github.com/takurot/airb-consulting-ext.git
   cd airb-consulting-ext
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## 📖 Usage

1. **Setup**: Click the extension icon and go to Settings to add your OpenAI or Claude API key
2. **Navigate**: Go to any Airbnb listing page (e.g., `airbnb.com/rooms/12345`)
3. **Analyze**: Open the side panel and click "分析を開始する" for pricing insights
4. **Optimize**: Switch to the "Optimizer" tab for title and description suggestions

See [VERIFICATION.md](./VERIFICATION.md) for detailed testing instructions.

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript 5
- **Styling**: Tailwind CSS (Airbnb-inspired design system)
- **Build**: Vite + CRXJS
- **Testing**: Vitest + React Testing Library
- **AI**: OpenAI API / Anthropic Claude API

## 📁 Project Structure

```
src/
├── background/          # Service worker
├── content/            # Content scripts & DOM parser
│   └── parsers/        # Airbnb data extraction logic
├── sidepanel/          # React app for side panel UI
├── components/         # React components
├── services/           # AI service integration
├── utils/              # Prompt templates
└── types/              # TypeScript definitions
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build
```

## 📋 Roadmap

- [x] Phase 1: MVP (Pricing + Optimizer)
- [ ] Phase 2: Market Data Dashboard
- [ ] Phase 3: Competitor Analysis
- [ ] Phase 4: Multi-property Management

See [prompt/PLAN.md](./prompt/PLAN.md) for detailed implementation plan.

## 🔒 Privacy & Security

- API keys are stored in `chrome.storage.local` (never sent to external servers)
- All AI requests go directly from your browser to OpenAI/Anthropic
- No user data is collected or transmitted to third parties

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
