# SwaSathiii - AI-Powered Waste Classification Platform

A modern, fully-featured waste classification web application built with React, TypeScript, Vite, Tailwind CSS, and Supabase. SwaSathiii leverages AI to help users identify waste types, learn proper disposal methods, and track their environmental impact.

## Features

### Core Functionality
- **AI-Powered Waste Detection** - Upload images or capture photos with camera to instantly classify waste
- **Multiple Waste Categories** - Plastic, Organic, Metal, E-Waste, Paper, Glass, and Unknown
- **Smart Bin Color Coding** - Visual identification of correct disposal bins
- **Recycling Tips** - Detailed, actionable recycling advice for each waste type

### User Features
- **User Authentication** - Secure sign-up/sign-in with email and password
- **Personal Dashboard** - View eco-impact statistics and scan history
- **Eco-Impact Tracking** - Real-time calculation of CO2 saved, water conserved, and trees saved
- **Community Leaderboard** - View top contributors by scans and environmental impact

### Experience Features
- **Educational Modal** - 6 interactive eco-tips with facts about waste management
- **Scan History** - Search and filter past classifications by waste type
- **Dark Mode** - Full dark mode support with system preference detection
- **Progressive Web App (PWA)** - Install on mobile devices for native app experience
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Smooth Animations** - Micro-interactions and transitions throughout

## Tech Stack

### Frontend
- **React 19** - Component-based UI framework
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first CSS framework
- **Inter Font** - Professional typography

### Backend & Database
- **Supabase** - PostgreSQL database, authentication, and edge functions
- **PostgreSQL** - Robust data persistence
- **Row Level Security (RLS)** - Fine-grained data access control

### AI & External APIs
- **OpenAI Vision (gpt-4o-mini)** - Image classification with optional API key
- **Fallback Keyword Detection** - Works without API key for demo purposes

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx              # Navigation with auth & theme toggle
│   ├── Hero.tsx                # Hero section with CTA
│   ├── HowItWorks.tsx          # 4-step process guide
│   ├── WasteScanner.tsx        # Upload/camera scanner UI
│   ├── ResultCard.tsx          # Classification result display
│   ├── WasteTypes.tsx          # Reference grid of waste categories
│   ├── ScanHistory.tsx         # Searchable history with filters
│   ├── Leaderboard.tsx         # Community leaderboard
│   ├── Footer.tsx              # Footer with links
│   ├── Auth.tsx                # Login/signup/password reset modal
│   ├── Dashboard.tsx           # User profile & eco-impact dashboard
│   ├── EcoTips.tsx             # Educational tips carousel
│   └── ThemeToggle.tsx         # Dark mode toggle
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── auth.ts                 # Authentication helpers
│   └── wasteData.ts            # Waste category data & classification logic
├── types/
│   └── waste.ts                # TypeScript type definitions
├── App.tsx                     # Main app component
├── main.tsx                    # React entry point
└── index.css                   # Global styles & animations
```

## Database Schema

### Tables

#### `user_profiles`
- `id` (uuid, PK) - References auth.users
- `email` (text)
- `display_name` (text, nullable)
- `avatar_url` (text, nullable)
- `total_scans` (integer)
- `total_items_recycled` (integer)
- `co2_saved` (numeric)
- `water_saved` (numeric)
- `created_at`, `updated_at` (timestamptz)

#### `eco_impacts`
- `user_id` (uuid, PK) - References user_profiles
- `total_scans` (integer)
- `plastic_items`, `organic_items`, `metal_items`, `ewaste_items`, `paper_items`, `glass_items` (integers)
- `co2_saved`, `water_saved` (numeric)
- `trees_saved` (numeric)
- `updated_at` (timestamptz)

#### `scan_history`
- `id` (uuid, PK)
- `category` (text) - Waste category
- `confidence` (numeric) - AI confidence 0-1
- `image_url` (text, nullable)
- `session_id` (text, nullable)
- `created_at` (timestamptz)

## Edge Functions

### `classify-waste`
Analyzes uploaded waste images using OpenAI Vision API (when configured) or keyword-based fallback.

**Request:**
```json
{
  "image": "base64-encoded-image",
  "mimeType": "image/jpeg"
}
```

**Response:**
```json
{
  "category": "plastic",
  "confidence": 0.92,
  "label": "Plastic"
}
```

### `update-eco-impact`
Calculates and updates user's environmental impact statistics based on classified items.

## Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Local Development

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create `.env` with Supabase credentials (auto-populated in project):
   ```
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_SUPABASE_ANON_KEY=your_key
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173

4. **Build for production:**
   ```bash
   npm run build
   ```

## AI Classification

### With OpenAI API
To enable accurate AI classification, add your OpenAI API key as an edge function secret:

```bash
# In Supabase dashboard: Settings → Edge Functions → Secrets
OPENAI_API_KEY=sk-...
```

### Without API Key
The app works with demo classification using keyword-based detection. Install the `OPENAI_API_KEY` secret for production-grade accuracy.

## PWA Features

The app includes a service worker for:
- Offline caching of static assets
- Network-first strategy for API calls
- Installable on iOS and Android
- Added to home screen capability
- Dark mode support

## Design System

### Colors
- **Primary Green**: #16a34a (used for accents, buttons)
- **Bin Colors**:
  - Plastic: #FBBF24 (Yellow)
  - Organic: #84CC16 (Green)
  - Metal: #6B7280 (Grey)
  - E-Waste: #EF4444 (Red)
  - Paper: #3B82F6 (Blue)
  - Glass: #06B6D4 (Cyan)

### Animations
- `fade-in-up` - Entrance animation from bottom
- `scale-in` - Bounce-in effect
- `spin-slow` - 3-second rotation
- `float` - Subtle vertical float motion

## Security

- **Row Level Security (RLS)** - All tables protected with user-level policies
- **Authentication** - Supabase email/password auth
- **API Secrets** - Sensitive keys stored in Supabase edge function secrets
- **No Client-Side Secrets** - API calls proxied through edge functions
- **XSS Protection** - React's built-in JSX escaping

## Performance

- **Build Size**: 445KB JavaScript (gzipped: 123KB), 45KB CSS (gzipped: 8KB)
- **Code Splitting**: Lazy-loaded components
- **Service Worker**: Enables offline mode and caching
- **Image Optimization**: SVG icons throughout
- **Tailwind JIT**: Only includes used CSS classes

## Future Enhancements

- [ ] Recycling centers map integration
- [ ] Gamification with badges and achievements
- [ ] Social sharing of eco-impact
- [ ] Multi-language support
- [ ] Waste disposal facility finder
- [ ] Carbon offset marketplace
- [ ] Team challenges and competitions

## Contributing

Contributions are welcome! Please ensure:
- TypeScript types are complete
- Components follow the single responsibility principle
- Styles use Tailwind utilities
- Database changes use migrations

## License

MIT License - feel free to use this project for personal or commercial use.

## Support

For issues or questions:
1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review [OpenAI API docs](https://platform.openai.com/docs)
3. Create an issue in the repository

---

**Built with care for a cleaner planet** ♻️
