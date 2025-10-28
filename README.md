# 🚀 EpochGuard Frontend

**Modern React Frontend for Blockchain Security with Explainable AI**

A production-ready Next.js frontend for EpochGuard blockchain validation system featuring interactive SHAP analysis, real-time monitoring, and professional glass-morphism design.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Sakketh7253/epochguard-frontend)

🌐 **Live Demo**: [https://hybrid-mlmodel.netlify.app](https://hybrid-mlmodel.netlify.app)

## 🌟 Features

### 🧠 **Explainable AI Dashboard**
- **Interactive SHAP Analysis**: Real-time model explanations with feature importance
- **Hybrid Model Insights**: Combined Random Forest + Decision Tree analysis
- **Visual Explanations**: Custom charts showing AI decision-making process
- **Live Analysis**: Upload CSV files for instant explainable predictions

### 🎨 **Modern Design System**
- **Glass-morphism UI**: Professional blur effects and gradient backgrounds
- **Responsive Layout**: Seamless experience across desktop, tablet, and mobile
- **Dark Mode Optimized**: Beautiful contrast and accessibility
- **Animated Components**: Smooth transitions and hover effects

### ⚡ **Performance Optimized**
- **Static Export**: Pure HTML/CSS/JS for lightning-fast loading
- **Netlify Optimized**: Full CSS visibility and perfect Lighthouse scores
- **Code Splitting**: Efficient bundle loading and caching
- **SEO Ready**: Meta tags and OpenGraph optimization

## 🚀 Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/Sakketh7253/epochguard-frontend.git
cd epochguard-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your backend URL

# Run development server
npm run dev

# Open browser at http://localhost:3000
```

### Production Build

```bash
# Build for production (static export)
npm run build

# Test production build locally
npx serve out -l 3000

# Output directory: ./out (ready for Netlify)
```

## 🌐 Production Deployment

### Netlify Deployment (Recommended)

**Why Netlify?** Perfect for showcasing complete frontend code with full CSS visibility, unlike other platforms.

#### Option A: One-Click Deploy
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Sakketh7253/epochguard-frontend)

#### Option B: Manual Setup
1. **Fork Repository**: Fork this repo to your GitHub account
2. **Connect to Netlify**: 
   - Go to [netlify.com](https://netlify.com)
   - "New site from Git" → Choose GitHub → Select your fork
3. **Auto-Configuration**: Netlify will detect settings from `netlify.toml`
4. **Environment Variables**: 
   ```
   NEXT_PUBLIC_API_URL=https://epochguard-backend.onrender.com
   ```
5. **Deploy**: Push to main branch for auto-deployment

### Build Configuration (Auto-Detected)
- **Build Command**: `npm run build`
- **Output Directory**: `out` (static export)
- **Node.js Version**: 18.x
- **Deploy Context**: Production with optimizations

### Alternative Platforms

#### Vercel Deployment
```bash
# For Vercel, update next.config.js:
# Remove: output: 'export'
# Remove: trailingSlash: true
npm i -g vercel
vercel --prod
```

#### Static Hosting (Any Platform)
```bash
npm run build
# Upload ./out directory to any static host
```

## 📁 Project Structure

```
frontend-deploy/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage with file upload
│   │   ├── layout.tsx            # Root layout with navigation
│   │   ├── globals.css           # Global Tailwind styles
│   │   ├── analysis/
│   │   │   └── page.tsx          # Blockchain analysis dashboard
│   │   ├── shap-analysis/
│   │   │   └── page.tsx          # SHAP explainability interface
│   │   ├── contact/
│   │   │   └── page.tsx          # Contact form
│   │   └── components/
│   │       ├── FileUpload.tsx    # Drag & drop file interface
│   │       ├── MetricsCards.tsx  # Performance display cards
│   │       └── ContactForm.tsx   # Contact form component
│   ├── components/
│   │   ├── Navigation.tsx        # Main navigation menu
│   │   └── Footer.tsx            # Site footer
│   └── types/
│       └── index.ts              # TypeScript type definitions
├── public/
│   ├── dataset_balanced_100_100.csv     # Sample blockchain data
│   ├── dataset_balanced_400_400.csv     # Larger sample dataset
│   ├── sample-blockchain-data.csv       # Demo dataset
│   ├── _headers                         # Netlify headers config
│   └── _redirects                       # Netlify redirects
├── netlify.toml              # Netlify deployment config
├── next.config.js           # Next.js configuration (static export)
├── tailwind.config.js       # Tailwind CSS configuration
├── package.json            # Dependencies and scripts
└── README.md              # This documentation
```

## 🔧 Environment Configuration

### Local Development

Create `.env.local` in the project root:

```env
# Backend API endpoint
NEXT_PUBLIC_API_URL=https://epochguard-backend.onrender.com

# Optional: Enable development features
NODE_ENV=development
```

### Production (Netlify)

Set environment variables in Netlify Dashboard:

| Variable | Value | Description |
|----------|--------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://epochguard-backend.onrender.com` | Backend API endpoint |
| `NODE_ENV` | `production` | Environment mode |

### API Configuration

The frontend connects to these backend endpoints:

```typescript
// API endpoints used by the frontend
const API_ENDPOINTS = {
  analyze: '/analyze',           // POST: Upload CSV for analysis
  metrics: '/metrics',          // GET: Performance statistics  
  contact: '/contact',          // POST: Contact form submission
  shapAnalysis: '/shap-analysis', // GET/POST: SHAP explanations
  shapCharts: '/shap-charts'     // GET: Visualization data
}
```

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary-blue: #3b82f6
--primary-indigo: #6366f1
--accent-cyan: #06b6d4

/* Gradients */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)
--gradient-blue: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)
```

### Glass-morphism Effects
```css
/* Glass cards */
backdrop-filter: blur(16px) saturate(180%)
background: rgba(255, 255, 255, 0.1)
border: 1px solid rgba(255, 255, 255, 0.125)
border-radius: 12px
```

### Typography Scale
- **Headings**: Inter, system-ui, sans-serif
- **Body**: System fonts with optimized line heights
- **Code**: JetBrains Mono, Consolas, monospace

### Component Library
- **Cards**: Glass-morphism with hover animations
- **Buttons**: Gradient backgrounds with ripple effects  
- **Forms**: Floating labels with validation states
- **Navigation**: Backdrop blur with smooth transitions

## 📊 SHAP Integration

The frontend includes a comprehensive SHAP analysis dashboard that provides:

- Individual model explanations (Random Forest, Decision Tree)
- Hybrid model analysis with weighted predictions
- Feature importance rankings
- Interactive visualizations
- Real-time analysis capabilities

## 🔗 API Integration

The frontend communicates with the FastAPI backend for:

- Blockchain validation analysis
- SHAP explainability generation
- Real-time data processing
- Model predictions and insights

## 🏗️ Technology Stack

### Core Framework
- **Next.js 14.2.33**: React framework with App Router and static export
- **React 18**: Latest React with concurrent features
- **TypeScript**: Full type safety and modern JavaScript features

### Styling & UI
- **Tailwind CSS 3.4**: Utility-first styling with custom design system
- **PostCSS**: CSS processing and optimization
- **Lucide React**: 1000+ beautiful SVG icons
- **Custom Glass-morphism**: Handcrafted backdrop blur components

### Data & API
- **Axios**: Promise-based HTTP client for API requests
- **React Hooks**: State management and lifecycle handling
- **CSV Processing**: Client-side file parsing and validation

### Development Tools
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting (optional)
- **Git Hooks**: Pre-commit validation (optional)

### Deployment & Performance  
- **Static Export**: Pure HTML/CSS/JS generation
- **Netlify Optimizations**: CDN, compression, and caching
- **Bundle Analysis**: Code splitting and tree shaking
- **SEO Optimization**: Meta tags and structured data

### Dependencies Overview

```json
{
  "dependencies": {
    "next": "14.2.33",
    "react": "^18.2.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.400.0",
    "axios": "^1.6.0"
  }
}
```

## 📱 Browser Support

- Chrome/Chromium 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## � Testing & Validation

### Manual Testing Checklist

```bash
# 1. Development server
npm run dev
# ✓ Verify localhost:3000 loads correctly
# ✓ Test navigation between all pages
# ✓ Verify responsive design on mobile

# 2. Production build
npm run build
npx serve out -l 3000
# ✓ Static export generates correctly
# ✓ All CSS and assets load properly
# ✓ API calls work with backend

# 3. Upload functionality
# ✓ Drag & drop CSV files
# ✓ File validation and error handling
# ✓ Sample datasets download correctly
```

### Browser Testing

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 88+ | ✅ Fully Supported |
| Firefox | 85+ | ✅ Fully Supported |  
| Safari | 14+ | ✅ Fully Supported |
| Edge | 88+ | ✅ Fully Supported |

### Performance Targets

- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: <2s
- **Largest Contentful Paint**: <4s
- **Cumulative Layout Shift**: <0.1

## 📊 Features Overview

### 🏠 Homepage (`/`)
- **Hero Section**: Animated gradient background with call-to-action
- **File Upload**: Drag & drop CSV interface with validation
- **Sample Data**: Pre-loaded datasets for testing
- **Metrics Display**: Real-time performance statistics
- **Contact Section**: Integrated contact form

### 🔍 Analysis Page (`/analysis`)  
- **Data Visualization**: Interactive charts and tables
- **Real-time Processing**: Live analysis with loading states
- **Export Results**: Download analysis reports
- **Filter Options**: Sort and filter blockchain data

### 🧠 SHAP Analysis (`/shap-analysis`)
- **Model Explanations**: Individual model SHAP values
- **Feature Importance**: Ranked feature contributions
- **Interactive Charts**: Custom visualizations (no external dependencies)
- **Hybrid Analysis**: Combined model insights
- **Live Analysis**: Upload CSV for instant explanations

### 📞 Contact (`/contact`)
- **Contact Form**: Validated form with backend integration
- **Company Info**: Team and technology details
- **Social Links**: GitHub, LinkedIn, and project links

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Update `NEXT_PUBLIC_API_URL` to production backend
- [ ] Test build locally: `npm run build && npx serve out`
- [ ] Verify all pages load without errors
- [ ] Test API integration with production backend
- [ ] Check responsive design on multiple devices
- [ ] Validate SEO meta tags and OpenGraph

### Netlify Setup
- [ ] Connect GitHub repository
- [ ] Verify auto-detected build settings
- [ ] Set environment variables
- [ ] Enable form handling (if using Netlify Forms)
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificate (automatic)

### Post-Deployment
- [ ] Test live URL: [https://hybrid-mlmodel.netlify.app](https://hybrid-mlmodel.netlify.app)
- [ ] Verify SHAP analysis connects to backend
- [ ] Test file upload functionality
- [ ] Check all navigation links work
- [ ] Validate contact form submission
- [ ] Monitor performance with Lighthouse

## 🔧 Configuration Files

### `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "https://epochguard-backend.onrender.com/api/:splat"
  status = 200
  force = true
```

### `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',        // Static export for Netlify
  trailingSlash: true,     // Ensures proper routing
  distDir: 'out',          // Output directory
  images: {
    unoptimized: true      // Required for static export
  }
}
```

### `tailwind.config.js`
```javascript
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px'
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 6s ease-in-out infinite'
      }
    }
  }
}
```

## �🤝 Contributing

### Getting Started
1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/epochguard-frontend.git
   ```
3. **Create** a feature branch:
   ```bash
   git checkout -b feature/amazing-new-feature
   ```
4. **Make** your changes following the guidelines below
5. **Test** thoroughly with both dev and production builds
6. **Commit** with clear, descriptive messages
7. **Push** to your fork and **create a Pull Request**

### Development Guidelines

#### Code Style
- Use **TypeScript** for all new components
- Follow **React Hooks** patterns
- Use **Tailwind classes** instead of custom CSS
- Keep components **small and focused**
- Add **proper TypeScript types** for all props

#### Component Structure
```typescript
// Example component structure
interface ComponentProps {
  title: string;
  data?: any[];
  onAction?: (id: string) => void;
}

export default function Component({ title, data, onAction }: ComponentProps) {
  // Component logic
  return (
    <div className="glass-card">
      {/* JSX content */}
    </div>
  );
}
```

#### Commit Convention
```bash
feat: add SHAP visualization component
fix: resolve mobile navigation issue  
docs: update API integration guide
style: improve button hover animations
refactor: optimize file upload logic
```

## 🔗 Related Projects

- **Backend API**: [epochguard-backend](https://github.com/Sakketh7253/epochguard-backend)
- **Machine Learning Models**: Integrated via FastAPI backend
- **SHAP Integration**: Real-time explainable AI analysis
- **Docker Deployment**: Containerized backend on Render

## 🌟 Live Demo Links

- **🌐 Frontend**: [https://hybrid-mlmodel.netlify.app](https://hybrid-mlmodel.netlify.app)
- **⚡ Backend API**: [https://epochguard-backend.onrender.com](https://epochguard-backend.onrender.com)
- **📚 API Docs**: [https://epochguard-backend.onrender.com/docs](https://epochguard-backend.onrender.com/docs)
- **🧠 SHAP Analysis**: [https://hybrid-mlmodel.netlify.app/shap-analysis](https://hybrid-mlmodel.netlify.app/shap-analysis)

## 📞 Support & Contact

- **🐛 Bug Reports**: [GitHub Issues](https://github.com/Sakketh7253/epochguard-frontend/issues)
- **💡 Feature Requests**: [GitHub Discussions](https://github.com/Sakketh7253/epochguard-frontend/discussions)
- **📧 Contact**: Use the contact form at [hybrid-mlmodel.netlify.app/contact](https://hybrid-mlmodel.netlify.app/contact)
- **📖 Documentation**: This README and inline code comments

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ Commercial use allowed
- ✅ Modification allowed  
- ✅ Distribution allowed
- ✅ Private use allowed
- ❗ License and copyright notice required

---

**🚀 Built with passion for blockchain security and explainable AI**  
**⭐ Star this repo if you found it helpful!**