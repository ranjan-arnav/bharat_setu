# Bharat Setu — भारत सेतु

**Bridging the Digital Divide with Agentic Governance**

Bharat Setu is a comprehensive, production-grade AI governance ecosystem. It eliminates the "Bureaucratic Wall" that separates citizens from their fundamental rights by transforming the State into an accessible Platform. Through a council of five specialized AI agents, the platform navigates complex government machinery on behalf of the citizen.

Targeting the Next Billion Users, Bharat Setu serves India's tier 2, 3, and 4 demographics where language and digital literacy are significant barriers. It natively supports 22 scheduled Indian languages, "Indlish" dialects, offline interactions, and hyper-precise location tracking via ISRO DIGIPIN.

---

## Features

- **Council of Five AI Agents**: Powered by Microsoft AutoGen 0.4.
  - **Nagarik Mitra (Civic)**: Handles local municipal issues, roads, water complaints, RTI, and property records (verified by DIGIPIN).
  - **Swasthya Sahayak (Health)**: Facilitates Ayushman Bharat enrollment, ABDM health records, U-WIN vaccination schedules, and routes to the nearest hospital via Azure Maps.
  - **Yojana Saathi (Welfare)**: Smart matches citizens across 800+ central/state welfare schemes (PM-KISAN, MGNREGA), generating document checklists and auto-filling applications.
  - **Arthik Salahkar (Finance)**: Manages Jan Dhan accounts, Mudra loans, and provides "Socratic" financial literacy on avoiding UPI/OTP frauds (reporting to MuleHunter.AI).
  - **Vidhi Sahayak (Legal)**: Guides users on Zero FIR, NALSA free legal aid, Nyaya Bandhu matching, and e-Daakhil consumer complaints.

- **Asynchronous SOS Emergency Response (Complete System)**: 
  - **Fail-safe Triggers**: Activate via a 3-second hold button. Includes a configurable Safety Timer for auto-activation.
  - **Smart Dispatch**: Async fan-out alert system contacts 112 (Police), 108 (Ambulance), 1091 (Women Helpline) and user-defined Emergency Contacts based on AI-contextualized events.
  - **Offline Resilience**: Automatically falls back to localized SMS and WhatsApp pre-filled schemes if internet connectivity is dropped.
  - **Live Tracking System**: Secure tracking links generated and continuously updated (`/track/[sessionId]`) dynamically fetching live GPS data.

- **Universal Linguistic Ear (Bhashini Stack)**: Real-time vernacular speech-to-text (STT) and text-to-speech (TTS) via Azure Speech SDK. Operates seamlessly across 22 scheduled Indian languages.

- **Intelligent Routing (Ministral-3B)**: Dynamic intent routing ensures queries fall to the correct specialist agent almost instantly, utilizing script-agnostic keyword overrides and GitHub AI Models.

- **Offline Resilience & Omni-Channel**: Works natively via WhatsApp, IVR for feature phones, and a Progressive Web App (PWA). Includes on-device intent caching with Microsoft Phi-3 Mini for zero-network environments.

- **Precision Location (ISRO DIGIPIN)**: Pinpoints grievances and emergencies to a 4x4m hyper-precise national addressing grid, standardizing unmapped rural sectors.

- **Data Interoperability Grid (MCP)**: Directly accesses official government servers (NSO, ABDM, eCourts) to fetch real-time, verified citizen data slices ensuring AI outputs are legally grounded.

- **Grievance AI with Azure Vision**: Submit complaints via photo. Azure Computer Vision auto-categorizes tags (e.g., "broken streetlight") while Azure Content Safety enforces enterprise-grade PII masking and moderation.

- **Karma & Gamification**: A civic participation ladder rewarding citizens with Karma points for resolving local issues, establishing community engagement through a local NagarPulse feed.

---

## Installation

### Prerequisites
- Node.js 18 or higher
- npm 9+ or yarn
- Active Azure subscription (for LLM, Speech, Vision, and Translate APIs)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/bharat-setu.git
   cd bharat-setu
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file by copying the template.
   ```bash
   cp .env.local.example .env.local
   ```
   *Edit `.env.local` to include your Azure OpenAI, Speech, Vision, and Map keys (refer to the Environment Variables section for required keys).*

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000`.

### Docker Deployment
```bash
docker build -t bharat-setu:latest .
docker run -p 3000:3000 --env-file .env.local bharat-setu:latest
```

---

## Usage Example

### Starting a Voice Conversation
1. Open the application. During onboarding, select your preferred language (e.g., Hindi).
2. Tap the floating microphone button and speak: `"मेरे घर में पानी नहीं आ रहा है"` (There is no water in my house).
3. The offline keyword logic or the Ministral-3B router will immediately forward the query to **Nagarik Mitra**.
4. The agent will respond in Hindi (TTS), create a high-priority grievance ticket, attach your DIGIPIN, and return a unique grievance ID.

### Filing via WhatsApp
Simply send a photo of a broken streetlight to the Bharat Setu WhatsApp bot. Azure Vision analyzes the photo and automatically files a civic complaint.

---

## Project Structure

```
bharat-setu/
├── src/
│   ├── app/
│   │   ├── api/                  # Core backend endpoints
│   │   │   ├── agent/            # Agent Routing & Chat Pipeline (AutoGen / Ministral)
│   │   │   ├── grievance/        # Vision AI & category classification
│   │   │   ├── sos/              # Async emergency response dispatcher
│   │   │   ├── schemes/          # Semantic scheme searching
│   │   │   ├── voice/            # Azure STT/TTS and audio handling
│   │   │   ├── ...               # Health, Translate, Content Safety APIs
│   │   ├── layout.tsx            # Next.js app layout
│   │   └── page.tsx              # Application shell & PWA configuration
│   ├── components/               # React components (AgentChat, SOSButton, Onboarding UI)
│   ├── lib/                      # Zustand state, Azure configs, MCP tool registries
│   └── styles/                   # Tailwind configurations and GoI color tokens
├── public/                       
│   ├── screens/                  # Standalone HTML modules (Cases, Finance, Welfare, Civic, etc.) injected via iframes
│   └── ...                       # PWA manifest, service workers (sw.js), icons
├── classifier/                   # Offline classifier and fine-tuning metadata
├── fine-tuning/                  # Model tuning configuration
├── .env.local                    # Secrets (Not committed)
├── next.config.js                # Build configuration
└── package.json                  # Project manifest
```

### Key Directories
- **`src/app/api/`**: The backbone of the platform, housing the multi-agent router orchestration, Content Safety validation gate, Translation layer, and SOS dispatcher bridging to authorities.
- **`src/components/`**: Features the UI elements tailored for accessibility, incorporating the `VoiceAssistant` module and the PWA native `SOSButton`.
- **`public/screens/`**: Maintains a modular architecture where the various domains (Civic, Health, Finance, Legal) are served via an iframe relay synced safely using a `postMessage` bridge.

---

*Bharat Setu empowers the citizen. Rather than expecting citizens to understand the bureaucracy, we engineered the bureaucracy to understand the citizen.*
